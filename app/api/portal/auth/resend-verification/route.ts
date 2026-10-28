import { NextResponse } from "next/server";
import { findCustomerByIdentifier, normalizeIdentifier, sendEmailVerificationCode } from "@/lib/portal/auth";
import { checkRateLimits, getClientIp, tooManyRequests } from "@/lib/rateLimit";

/** Sends a new verification code to an account that hasn't confirmed its email yet. */
export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Enter the email you signed up with." }, { status: 400 });
    }

    const rate = await checkRateLimits([
      { key: ["resend-verification:ip", getClientIp(req)], limit: 10, windowSeconds: 60 * 60 },
      { key: ["resend-verification:id", normalizeIdentifier(String(email))], limit: 3, windowSeconds: 60 * 60 },
    ]);
    if (!rate.allowed) return tooManyRequests(rate.retryAfterSeconds);

    const customer = await findCustomerByIdentifier(String(email));
    if (!customer || !customer.email) {
      return NextResponse.json({ error: "No account exists with that email. Create an account first." }, { status: 404 });
    }
    if (customer.emailVerified) {
      return NextResponse.json({ error: "This email is already confirmed. Sign in with your password." }, { status: 409 });
    }

    await sendEmailVerificationCode(customer);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/portal/auth/resend-verification error:", err);
    return NextResponse.json({ error: "We couldn't send the email right now. Please try again shortly." }, { status: 502 });
  }
}
