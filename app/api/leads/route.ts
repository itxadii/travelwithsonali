import { NextResponse } from "next/server";
import { db } from "@/db";
import { leads, activityLogs } from "@/db/schema";
import { checkRateLimits, getClientIp, tooManyRequests } from "@/lib/rateLimit";
import { sendNewEnquiryEmail } from "@/lib/mailer";

/** Public website enquiry form (Enquire modal + Contact page) → admin Leads. */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

    const name = str(body.name, 100);
    const mobile = str(body.mobile, 30);
    const email = str(body.email, 200);
    const tour = str(body.tour, 150) || "General Enquiry";
    const message = str(body.message, 2000);
    const travellersCount = Math.min(50, Math.max(1, parseInt(String(body.travellers), 10) || 1));

    if (!name || !mobile) {
      return NextResponse.json({ error: "Please enter your name and mobile number." }, { status: 400 });
    }
    if (!/^[+\d][\d\s()-]{6,}$/.test(mobile)) {
      return NextResponse.json({ error: "Please enter a valid mobile number." }, { status: 400 });
    }

    const rate = await checkRateLimits([
      { key: ["enquiry:ip", getClientIp(request)], limit: 5, windowSeconds: 60 * 60 },
    ]);
    if (!rate.allowed) return tooManyRequests(rate.retryAfterSeconds);

    const leadId = `lead-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    await db.insert(leads).values({
      id: leadId,
      name,
      mobile,
      email: email || null,
      interestedTourTitle: tour,
      source: "Website",
      travellersCount,
      status: "New",
      notes: message || null,
    });

    await db.insert(activityLogs).values({
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      actorEmail: email || "website-visitor",
      action: "CREATE_LEAD",
      entityType: "LEAD",
      entityId: leadId,
      metadata: JSON.stringify({ name, interestedTourTitle: tour, source: "Website enquiry form" }),
    });

    // Email alert is a bonus; the lead is already saved, so never fail the request over it
    try {
      await sendNewEnquiryEmail({ name, mobile, email, tour, travellersCount, message });
    } catch (err) {
      console.warn("Enquiry email notification not sent:", err instanceof Error ? err.message : err);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/leads error:", err);
    return NextResponse.json(
      { error: "Sorry, we couldn't send your enquiry. Please call or WhatsApp us instead." },
      { status: 500 }
    );
  }
}
