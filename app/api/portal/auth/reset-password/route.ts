import { NextResponse } from "next/server";
import { resetCustomerPassword } from "@/lib/portal/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, code, newPassword, identifier } = body;

    const tokenOrCode = token || code;

    if (!tokenOrCode) {
      return NextResponse.json(
        { error: "Reset token or 6-digit verification code is required." },
        { status: 400 }
      );
    }

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const result = await resetCustomerPassword(tokenOrCode, newPassword, identifier);

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
