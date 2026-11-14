import { NextResponse } from "next/server";
import { setPasswordFromLink } from "@/lib/admin/team";
import { checkRateLimits, getClientIp, tooManyRequests } from "@/lib/rateLimit";

/** Public: sets an admin's password from the one-time link in their invite or reset email. */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = typeof body.token === "string" ? body.token : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (!token || !password) {
      return NextResponse.json({ error: "Open the link from your email and choose a password." }, { status: 400 });
    }

    const rate = await checkRateLimits([{ key: ["admin-set-password:ip", getClientIp(request)], limit: 10, windowSeconds: 15 * 60 }]);
    if (!rate.allowed) return tooManyRequests(rate.retryAfterSeconds);

    const result = await setPasswordFromLink(token, password);
    if (!result.success) return NextResponse.json({ error: result.error }, { status: result.status });
    return NextResponse.json({ success: true, email: result.email });
  } catch (err) {
    console.error("POST set-password error:", err);
    return NextResponse.json({ error: "Couldn't set your password right now." }, { status: 500 });
  }
}
