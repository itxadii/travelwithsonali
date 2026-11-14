import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { isOwner, resendSetupLink } from "@/lib/admin/team";
import { checkRateLimits, tooManyRequests } from "@/lib/rateLimit";

/** Emails a fresh invite, or a password reset link for someone already set up. */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isOwner(admin)) {
    return NextResponse.json({ error: "Only owners can send these links." }, { status: 403 });
  }

  const { id } = await params;
  const rate = await checkRateLimits([{ key: ["admin-setup-link", id], limit: 5, windowSeconds: 60 * 60 }]);
  if (!rate.allowed) return tooManyRequests(rate.retryAfterSeconds);

  try {
    const result = await resendSetupLink(id, admin);
    if (!result.success) return NextResponse.json({ error: result.error }, { status: result.status });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST resend setup link error:", err);
    return NextResponse.json({ error: "Couldn't send the email right now." }, { status: 500 });
  }
}
