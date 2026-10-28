import { NextResponse } from "next/server";
import { normalizeIdentifier, verifyCustomerEmail } from "@/lib/portal/auth";
import { checkRateLimits, getClientIp, tooManyRequests } from "@/lib/rateLimit";

/** Confirms a new account's email with the emailed 6-digit code, then signs the customer in. */
export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();
    if (!email || !code) {
      return NextResponse.json({ error: "Enter your email and the 6-digit code." }, { status: 400 });
    }

    const rate = await checkRateLimits([
      { key: ["verify-email:ip", getClientIp(req)], limit: 20, windowSeconds: 15 * 60 },
      { key: ["verify-email:id", normalizeIdentifier(String(email))], limit: 10, windowSeconds: 15 * 60 },
    ]);
    if (!rate.allowed) return tooManyRequests(rate.retryAfterSeconds);

    const result = await verifyCustomerEmail(String(email), String(code));
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/portal/auth/verify-email error:", err);
    return NextResponse.json({ error: "Couldn't confirm your email right now. Please try again." }, { status: 500 });
  }
}
