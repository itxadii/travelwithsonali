import { NextResponse } from "next/server";
import {
  ADMIN_CHALLENGE_COOKIE,
  ADMIN_CHALLENGE_COOKIE_PATH,
  ADMIN_SESSION_COOKIE,
  completeAdminLogin,
} from "@/lib/admin/auth";
import { checkRateLimits, getClientIp, tooManyRequests } from "@/lib/rateLimit";

/** Step 2: the emailed 6-digit code. On success the admin session cookie is set. */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const code = typeof body.code === "string" ? body.code.replace(/\D/g, "") : "";
    if (code.length !== 6) {
      return NextResponse.json({ error: "Enter the 6-digit code from your email." }, { status: 400 });
    }

    const challenge = request.headers.get("cookie")?.match(new RegExp(`(?:^|;\\s*)${ADMIN_CHALLENGE_COOKIE}=([^;]+)`))?.[1];
    if (!challenge) {
      return NextResponse.json({ error: "Your sign-in attempt expired. Start again from the login page.", expired: true }, { status: 400 });
    }

    const rate = await checkRateLimits([{ key: ["admin-verify:ip", getClientIp(request)], limit: 15, windowSeconds: 15 * 60 }]);
    if (!rate.allowed) return tooManyRequests(rate.retryAfterSeconds);

    const result = await completeAdminLogin(decodeURIComponent(challenge), code, {
      ip: getClientIp(request),
      userAgent: request.headers.get("user-agent") || "",
    });

    if (!result.success || !result.token || !result.expiresAt) {
      const response = NextResponse.json({ error: result.error, expired: Boolean(result.expired) }, { status: 401 });
      if (result.expired) response.cookies.set(ADMIN_CHALLENGE_COOKIE, "", { maxAge: 0, path: ADMIN_CHALLENGE_COOKIE_PATH });
      return response;
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_SESSION_COOKIE, result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: result.expiresAt,
      path: "/",
    });
    response.cookies.set(ADMIN_CHALLENGE_COOKIE, "", { maxAge: 0, path: ADMIN_CHALLENGE_COOKIE_PATH });
    return response;
  } catch (err) {
    console.error("Verify code API error:", err);
    return NextResponse.json({ error: "Couldn't check the code right now. Please try again." }, { status: 500 });
  }
}
