import { NextResponse } from "next/server";
import { CUSTOMER_CHALLENGE_COOKIE, CUSTOMER_CHALLENGE_COOKIE_PATH, resendCustomerLoginCode } from "@/lib/portal/auth";
import { checkRateLimits, getClientIp, tooManyRequests } from "@/lib/rateLimit";

/** Emails a fresh sign-in code for the attempt in progress. */
export async function POST(req: Request) {
  try {
    const challenge = req.headers.get("cookie")?.match(new RegExp(`(?:^|;\s*)${CUSTOMER_CHALLENGE_COOKIE}=([^;]+)`))?.[1];
    if (!challenge) {
      return NextResponse.json({ error: "Your sign-in attempt expired. Enter your email and password again.", expired: true }, { status: 400 });
    }

    const rate = await checkRateLimits([{ key: ["portal-login-resend:ip", getClientIp(req)], limit: 5, windowSeconds: 15 * 60 }]);
    if (!rate.allowed) return tooManyRequests(rate.retryAfterSeconds);

    const result = await resendCustomerLoginCode(decodeURIComponent(challenge));
    if (!result.success || !result.challenge) {
      return NextResponse.json({ error: result.error, expired: Boolean(result.expired) }, { status: 400 });
    }

    const response = NextResponse.json({ success: true, emailHint: result.emailHint });
    response.cookies.set(CUSTOMER_CHALLENGE_COOKIE, result.challenge, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 10 * 60,
      path: CUSTOMER_CHALLENGE_COOKIE_PATH,
    });
    return response;
  } catch (err) {
    console.error("POST resend-login-code error:", err);
    return NextResponse.json({ error: "Couldn't send a new code right now." }, { status: 500 });
  }
}
