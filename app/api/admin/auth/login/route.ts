import { NextResponse } from "next/server";
import { ADMIN_CHALLENGE_COOKIE, ADMIN_CHALLENGE_COOKIE_PATH, beginAdminLogin } from "@/lib/admin/auth";
import { checkRateLimits, getClientIp, tooManyRequests } from "@/lib/rateLimit";

/** Step 1: email + password. On success a 6-digit code is emailed and a challenge cookie is set. */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const rate = await checkRateLimits([
      { key: ["admin-login:ip", getClientIp(request)], limit: 10, windowSeconds: 15 * 60 },
      { key: ["admin-login:email", email.trim().toLowerCase()], limit: 10, windowSeconds: 15 * 60 },
    ]);
    if (!rate.allowed) return tooManyRequests(rate.retryAfterSeconds);

    const result = await beginAdminLogin(email, password, {
      ip: getClientIp(request),
      userAgent: request.headers.get("user-agent") || "",
    });

    if (!result.success || !result.challenge) {
      return NextResponse.json({ error: result.error || "Invalid email or password." }, { status: result.reason === "mail" ? 502 : 401 });
    }

    const response = NextResponse.json({ success: true, requiresCode: true, emailHint: result.emailHint });
    response.cookies.set(ADMIN_CHALLENGE_COOKIE, result.challenge, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 10 * 60,
      path: ADMIN_CHALLENGE_COOKIE_PATH,
    });
    return response;
  } catch (err) {
    console.error("Login API error:", err);
    return NextResponse.json({ error: "Invalid email or password." }, { status: 500 });
  }
}
