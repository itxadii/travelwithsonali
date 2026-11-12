import { NextResponse } from "next/server";
import { ADMIN_CHALLENGE_COOKIE, ADMIN_CHALLENGE_COOKIE_PATH, resendAdminLoginCode } from "@/lib/admin/auth";
import { checkRateLimits, getClientIp, tooManyRequests } from "@/lib/rateLimit";

/** Emails a fresh sign-in code for the in-progress sign-in; only the newest code works. */
export async function POST(request: Request) {
  try {
    const challenge = request.headers.get("cookie")?.match(new RegExp(`(?:^|;\\s*)${ADMIN_CHALLENGE_COOKIE}=([^;]+)`))?.[1];
    if (!challenge) {
      return NextResponse.json({ error: "Your sign-in attempt expired. Start again from the login page.", expired: true }, { status: 400 });
    }

    const rate = await checkRateLimits([{ key: ["admin-resend:ip", getClientIp(request)], limit: 3, windowSeconds: 15 * 60 }]);
    if (!rate.allowed) return tooManyRequests(rate.retryAfterSeconds);

    const result = await resendAdminLoginCode(decodeURIComponent(challenge), {
      ip: getClientIp(request),
      userAgent: request.headers.get("user-agent") || "",
    });
    if (!result.success || !result.challenge) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const response = NextResponse.json({ success: true, emailHint: result.emailHint });
    response.cookies.set(ADMIN_CHALLENGE_COOKIE, result.challenge, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 10 * 60,
      path: ADMIN_CHALLENGE_COOKIE_PATH,
    });
    return response;
  } catch (err) {
    console.error("Resend code API error:", err);
    return NextResponse.json({ error: "Couldn't send a new code right now." }, { status: 500 });
  }
}
