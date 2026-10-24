import { NextResponse } from "next/server";
import { loginAdmin } from "@/lib/admin/auth";
import { checkRateLimits, getClientIp, tooManyRequests } from "@/lib/rateLimit";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const rate = await checkRateLimits([
      { key: ["admin-login:ip", getClientIp(request)], limit: 10, windowSeconds: 15 * 60 },
      { key: ["admin-login:email", String(email).trim().toLowerCase()], limit: 10, windowSeconds: 15 * 60 },
    ]);
    if (!rate.allowed) return tooManyRequests(rate.retryAfterSeconds);

    const result = await loginAdmin(email, password);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Invalid email or password." },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true, message: "Logged in successfully." });
  } catch (err) {
    console.error("Login API error:", err);
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 500 }
    );
  }
}
