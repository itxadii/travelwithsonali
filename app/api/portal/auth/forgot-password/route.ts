import { NextResponse } from "next/server";
import { requestPasswordReset } from "@/lib/portal/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { identifier } = body;

    if (!identifier) {
      return NextResponse.json(
        { error: "Please provide your registered email or mobile number." },
        { status: 400 }
      );
    }

    const result = await requestPasswordReset(identifier);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Unable to find account." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Reset code generated successfully.",
      code: result.code,
      token: result.token,
      directLink: `/portal/reset-password?token=${result.token}`,
    });
  } catch (err) {
    console.error("POST /api/portal/auth/forgot-password error:", err);
    return NextResponse.json(
      { error: "Server error while processing your password reset request." },
      { status: 500 }
    );
  }
}
