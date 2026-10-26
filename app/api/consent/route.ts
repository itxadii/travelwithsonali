import { NextResponse } from "next/server";
import { createHash, randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { analyticsEvents, consentRecords } from "@/db/schema";
import { getCurrentCustomer } from "@/lib/portal/auth";
import { checkRateLimits, getClientIp, tooManyRequests } from "@/lib/rateLimit";
import {
  CONSENT_COOKIE,
  CONSENT_MAX_AGE_SECONDS,
  CONSENT_VERSION,
  MARKETING_ENABLED,
  VISITOR_COOKIE,
  parseConsent,
  serializeConsent,
  type ConsentAction,
  type ConsentState,
} from "@/lib/consent/config";

const ACTIONS: ConsentAction[] = ["accept_all", "reject_all", "custom"];

/** Records a consent choice, sets the consent cookie, and erases analytics data when analytics consent is withdrawn. */
export async function POST(req: Request) {
  try {
    const rate = await checkRateLimits([
      { key: ["consent:ip", getClientIp(req)], limit: 60, windowSeconds: 60 * 60 },
    ]);
    if (!rate.allowed) return tooManyRequests(rate.retryAfterSeconds);

    const body = await req.json().catch(() => null);
    const action = body?.action as ConsentAction;
    const language = body?.language === "hi" ? "hi" : "en";
    if (!ACTIONS.includes(action) || typeof body?.analytics !== "boolean" || typeof body?.marketing !== "boolean") {
      return NextResponse.json({ error: "Invalid consent choice." }, { status: 400 });
    }

    const cookieStore = await cookies();
    // Reuse the consent ID even across notice versions, so one browser's history stays linked
    const previousRaw = cookieStore.get(CONSENT_COOKIE)?.value;
    let previousConsentId: string | undefined;
    try {
      previousConsentId = previousRaw ? JSON.parse(decodeURIComponent(previousRaw))?.consentId : undefined;
    } catch {
      previousConsentId = undefined;
    }
    const previous = parseConsent(previousRaw);

    const state: ConsentState = {
      version: CONSENT_VERSION,
      analytics: body.analytics,
      marketing: MARKETING_ENABLED && body.marketing,
      consentId: typeof previousConsentId === "string" && previousConsentId.length <= 64 ? previousConsentId : randomUUID(),
      updatedAt: Date.now(),
    };

    const customer = await getCurrentCustomer();
    const ipHash = createHash("sha256")
      .update(`${process.env.SESSION_SECRET || ""}|${getClientIp(req)}`)
      .digest("hex");

    await db.insert(consentRecords).values({
      id: randomUUID(),
      consentId: state.consentId,
      customerId: customer?.id ?? null,
      noticeVersion: CONSENT_VERSION,
      language,
      action,
      analytics: state.analytics,
      marketing: state.marketing,
      ipHash,
      userAgent: req.headers.get("user-agent")?.slice(0, 300) ?? null,
    });

    const secure = process.env.NODE_ENV === "production";
    const response = NextResponse.json({ consent: state, withdrew: Boolean(previous?.analytics && !state.analytics) });

    response.cookies.set(CONSENT_COOKIE, serializeConsent(state), {
      maxAge: CONSENT_MAX_AGE_SECONDS,
      path: "/",
      sameSite: "lax",
      secure,
      httpOnly: false, // the banner reads it to know whether to ask
    });

    const visitorId = cookieStore.get(VISITOR_COOKIE)?.value;
    if (state.analytics) {
      response.cookies.set(VISITOR_COOKIE, visitorId || randomUUID(), {
        maxAge: CONSENT_MAX_AGE_SECONDS,
        path: "/",
        sameSite: "lax",
        secure,
        httpOnly: true,
      });
    } else if (visitorId) {
      // Withdrawal: erase what was collected under analytics consent (DPDP s.8(7))
      await db.delete(analyticsEvents).where(eq(analyticsEvents.visitorId, visitorId));
      response.cookies.delete(VISITOR_COOKIE);
    }

    return response;
  } catch (err) {
    console.error("POST /api/consent error:", err);
    return NextResponse.json({ error: "Could not save your choice." }, { status: 500 });
  }
}
