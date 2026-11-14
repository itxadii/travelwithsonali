import { NextResponse } from "next/server";
import { getCurrentCustomer, revokeOtherCustomerSessions } from "@/lib/portal/auth";
import { db } from "@/db";
import { customers } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { checkRateLimits, tooManyRequests } from "@/lib/rateLimit";

export async function POST(req: Request) {
  try {
    const customerSession = await getCurrentCustomer();
    if (!customerSession) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const body = await req.json();
    const currentPassword = typeof body.currentPassword === "string" ? body.currentPassword : "";
    const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Current password and new password are required." }, { status: 400 });
    }

    if (newPassword.length < 8 || newPassword.length > 128) {
      return NextResponse.json({ error: "New password must be between 8 and 128 characters." }, { status: 400 });
    }

    const rate = await checkRateLimits([
      { key: ["portal-change-password", customerSession.id], limit: 5, windowSeconds: 15 * 60 },
    ]);
    if (!rate.allowed) return tooManyRequests(rate.retryAfterSeconds);

    const currentCustomerRecord = (
      await db.select().from(customers).where(eq(customers.id, customerSession.id))
    )[0];

    if (!currentCustomerRecord) {
      return NextResponse.json({ error: "Customer profile not found." }, { status: 404 });
    }

    const isValid =
      !!currentCustomerRecord.passwordHash &&
      (await bcrypt.compare(currentPassword, currentCustomerRecord.passwordHash));
    if (!isValid) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
    }

    const newHash = await bcrypt.hash(newPassword, 10);

    await db
      .update(customers)
      .set({
        passwordHash: newHash,
        updatedAt: new Date(),
      })
      .where(eq(customers.id, customerSession.id));

    // Anyone still signed in with the old password is signed out; this browser stays in
    await revokeOtherCustomerSessions(customerSession.id);

    return NextResponse.json({ success: true, message: "Password updated. You've been signed out on your other devices." });
  } catch (err) {
    console.error("POST /api/portal/profile/password error:", err);
    return NextResponse.json({ error: "Failed to update password." }, { status: 500 });
  }
}
