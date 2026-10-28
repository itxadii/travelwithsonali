import { NextResponse } from "next/server";
import { normalizeIdentifier, requestPasswordReset } from "@/lib/portal/auth";
import { checkRateLimits, getClientIp, tooManyRequests } from "@/lib/rateLimit";

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

    // Also stops the endpoint being used to flood a customer's inbox
    const rate = await checkRateLimits([
      { key: ["forgot-password:ip", getClientIp(req)], limit: 10, windowSeconds: 60 * 60 },
      { key: ["forgot-password:id", normalizeIdentifier(String(identifier))], limit: 3, windowSeconds: 60 * 60 },
    ]);
    if (!rate.allowed) return tooManyRequests(rate.retryAfterSeconds);

    // SITE_URL keeps reset links pointing at the real site regardless of the request's Host header
    const siteUrl = (process.env.SITE_URL || new URL(req.url).origin).replace(/\/$/, "");
    const result = await requestPasswordReset(identifier, siteUrl);

    if (!result.success) {
      const status = result.reason === "not_found" ? 404 : result.reason === "no_email" ? 422 : 500;
      return NextResponse.json(
        { error: result.error || "Unable to send reset email.", reason: result.reason },
        { status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "We've emailed you a 6-digit reset code and link.",
    });
  } catch (err) {
    console.error("POST /api/portal/auth/forgot-password error:", err);
    return NextResponse.json(
      { error: "Server error while processing your password reset request." },
      { status: 500 }
    );
  }
}
