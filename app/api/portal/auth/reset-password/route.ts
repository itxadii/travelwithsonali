import { NextResponse } from "next/server";
import { resetCustomerPassword } from "@/lib/portal/auth";
import { checkRateLimits, getClientIp, tooManyRequests } from "@/lib/rateLimit";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, code, newPassword, identifier } = body;

    if (!token && !(code && identifier)) {
      return NextResponse.json(
        { error: "Please provide the reset link, or your email/phone and the 6-digit code." },
        { status: 400 }
      );
    }

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const rate = await checkRateLimits([
      { key: ["reset-password:ip", getClientIp(req)], limit: 10, windowSeconds: 15 * 60 },
    ]);
    if (!rate.allowed) return tooManyRequests(rate.retryAfterSeconds);

    const result = await resetCustomerPassword({ token, code, identifier }, newPassword);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to reset password." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Password reset successful! You are now logged in.",
    });
  } catch (err) {
    console.error("POST /api/portal/auth/reset-password error:", err);
    return NextResponse.json(
      { error: "Server error while resetting password." },
      { status: 500 }
    );
  }
}
