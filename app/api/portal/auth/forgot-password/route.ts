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

    // SITE_URL keeps reset links pointing at the real site regardless of the request's Host header
    const siteUrl = (process.env.SITE_URL || new URL(req.url).origin).replace(/\/$/, "");
    const result = await requestPasswordReset(identifier, siteUrl);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Unable to send reset email." },
        { status: 500 }
      );
    }

    // Same response whether or not an account exists, so this can't be used to look up customers
    return NextResponse.json({
      success: true,
      message:
        "If an account with an email address matches what you entered, we've emailed it a 6-digit reset code and link.",
    });
  } catch (err) {
    console.error("POST /api/portal/auth/forgot-password error:", err);
    return NextResponse.json(
      { error: "Server error while processing your password reset request." },
      { status: 500 }
    );
  }
}
