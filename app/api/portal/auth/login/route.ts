import { NextResponse } from "next/server";
import { loginCustomer, normalizeIdentifier } from "@/lib/portal/auth";
import { checkRateLimits, getClientIp, tooManyRequests } from "@/lib/rateLimit";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { loginIdentifier, password } = body;

    if (!loginIdentifier || !password) {
      return NextResponse.json({ error: "Email or Phone and password are required." }, { status: 400 });
    }

    const rate = await checkRateLimits([
      { key: ["portal-login:ip", getClientIp(req)], limit: 20, windowSeconds: 15 * 60 },
      { key: ["portal-login:id", normalizeIdentifier(String(loginIdentifier))], limit: 10, windowSeconds: 15 * 60 },
    ]);
    if (!rate.allowed) return tooManyRequests(rate.retryAfterSeconds);

    const result = await loginCustomer(loginIdentifier, password);

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Authentication failed." }, { status: 401 });
    }

    const response = NextResponse.json({ success: true, message: "Welcome back!" });

    if (result.token && result.expiresAt) {
      response.cookies.set("customer_session", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: result.expiresAt,
        path: "/",
      });
    }

    return response;
  } catch (err) {
    console.error("Portal Auth Login Route Error:", err);
    return NextResponse.json({ error: "Server error during login." }, { status: 500 });
  }
}
