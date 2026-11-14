import { NextResponse } from "next/server";
import { CUSTOMER_CHALLENGE_COOKIE, CUSTOMER_CHALLENGE_COOKIE_PATH, completeCustomerLogin } from "@/lib/portal/auth";
import { checkRateLimits, getClientIp, tooManyRequests } from "@/lib/rateLimit";

/** Second step of customer sign-in: the 6-digit code from their email. */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const code = typeof body.code === "string" ? body.code.replace(/\D/g, "") : "";
    if (code.length !== 6) {
      return NextResponse.json({ error: "Enter the 6-digit code from your email." }, { status: 400 });
    }

    const challenge = req.headers.get("cookie")?.match(new RegExp(`(?:^|;\s*)${CUSTOMER_CHALLENGE_COOKIE}=([^;]+)`))?.[1];
    if (!challenge) {
      return NextResponse.json({ error: "Your sign-in attempt expired. Enter your email and password again.", expired: true }, { status: 400 });
    }

    const rate = await checkRateLimits([{ key: ["portal-login-code:ip", getClientIp(req)], limit: 20, windowSeconds: 15 * 60 }]);
    if (!rate.allowed) return tooManyRequests(rate.retryAfterSeconds);

    const result = await completeCustomerLogin(decodeURIComponent(challenge), code);
    if (!result.success || !result.token || !result.expiresAt) {
      const response = NextResponse.json({ error: result.error, expired: Boolean(result.expired) }, { status: 401 });
      if (result.expired) response.cookies.set(CUSTOMER_CHALLENGE_COOKIE, "", { maxAge: 0, path: CUSTOMER_CHALLENGE_COOKIE_PATH });
      return response;
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set("customer_session", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: result.expiresAt,
      path: "/",
    });
    response.cookies.set(CUSTOMER_CHALLENGE_COOKIE, "", { maxAge: 0, path: CUSTOMER_CHALLENGE_COOKIE_PATH });
    return response;
  } catch (err) {
    console.error("POST verify-login-code error:", err);
    return NextResponse.json({ error: "Couldn't check the code right now. Please try again." }, { status: 500 });
  }
}
