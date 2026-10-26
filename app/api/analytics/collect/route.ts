import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { lt } from "drizzle-orm";
import { db } from "@/db";
import { analyticsEvents } from "@/db/schema";
import { checkRateLimits } from "@/lib/rateLimit";
import { ANALYTICS_RETENTION_DAYS, CONSENT_COOKIE, VISITOR_COOKIE, parseConsent } from "@/lib/consent/config";

const clip = (value: unknown, max: number) =>
  typeof value === "string" && value.trim() ? value.trim().slice(0, max) : null;

/** Keeps only coarse device facts instead of storing the raw user-agent string. */
function describeDevice(ua: string) {
  const deviceType = /ipad|tablet/i.test(ua) ? "tablet" : /mobi|android|iphone/i.test(ua) ? "mobile" : "desktop";
  const browser = /edg\//i.test(ua)
    ? "Edge"
    : /opr\/|opera/i.test(ua)
      ? "Opera"
      : /samsungbrowser/i.test(ua)
        ? "Samsung Internet"
        : /chrome|crios/i.test(ua)
          ? "Chrome"
          : /firefox|fxios/i.test(ua)
            ? "Firefox"
            : /safari/i.test(ua)
              ? "Safari"
              : "Other";
  const os = /android/i.test(ua)
    ? "Android"
    : /iphone|ipad|ipod/i.test(ua)
      ? "iOS"
      : /windows/i.test(ua)
        ? "Windows"
        : /mac os/i.test(ua)
          ? "macOS"
          : /linux/i.test(ua)
            ? "Linux"
            : "Other";
  return { deviceType, browser, os };
}

/** Records a page view, but only when the visitor has given analytics consent for the current notice. */
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const consent = parseConsent(cookieStore.get(CONSENT_COOKIE)?.value);
    const visitorId = cookieStore.get(VISITOR_COOKIE)?.value;
    if (!consent?.analytics || !visitorId) return new NextResponse(null, { status: 204 });

    const rate = await checkRateLimits([
      { key: ["analytics:visitor", visitorId], limit: 300, windowSeconds: 60 * 60 },
    ]);
    if (!rate.allowed) return new NextResponse(null, { status: 204 });

    const body = await req.json().catch(() => null);
    const path = clip(body?.path, 300);
    const sessionId = clip(body?.sessionId, 64);
    if (!path || !path.startsWith("/") || !sessionId) {
      return NextResponse.json({ error: "Invalid event." }, { status: 400 });
    }

    const { deviceType, browser, os } = describeDevice(req.headers.get("user-agent") || "");

    await db.insert(analyticsEvents).values({
      id: randomUUID(),
      visitorId,
      sessionId,
      path,
      referrerHost: clip(body?.referrerHost, 200),
      utmSource: clip(body?.utmSource, 100),
      utmMedium: clip(body?.utmMedium, 100),
      utmCampaign: clip(body?.utmCampaign, 100),
      deviceType,
      browser,
      os,
      country: clip(req.headers.get("x-vercel-ip-country"), 2),
    });

    // Retention: occasionally sweep events past the retention period
    if (Math.random() < 0.02) {
      const cutoff = new Date(Date.now() - ANALYTICS_RETENTION_DAYS * 24 * 60 * 60 * 1000);
      await db.delete(analyticsEvents).where(lt(analyticsEvents.createdAt, cutoff));
    }

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("POST /api/analytics/collect error:", err);
    return new NextResponse(null, { status: 204 });
  }
}
