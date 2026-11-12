import { NextResponse } from "next/server";
import { getCurrentAdmin, revokeOtherAdminSessions } from "@/lib/admin/auth";
import { db } from "@/db";
import { adminUsers, activityLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { checkRateLimits, tooManyRequests } from "@/lib/rateLimit";

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Current and New passwords are required." }, { status: 400 });
    }

    if (typeof newPassword !== "string" || newPassword.length < 8 || newPassword.length > 128) {
      return NextResponse.json({ error: "New password must be between 8 and 128 characters." }, { status: 400 });
    }

    const rate = await checkRateLimits([
      { key: ["admin-change-password", admin.id], limit: 5, windowSeconds: 15 * 60 },
    ]);
    if (!rate.allowed) return tooManyRequests(rate.retryAfterSeconds);

    const users = await db.select().from(adminUsers).where(eq(adminUsers.id, admin.id));
    if (users.length === 0) {
      return NextResponse.json({ error: "Admin account not found" }, { status: 404 });
    }

    const user = users[0];
    const isCurrentValid = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!isCurrentValid) {
      return NextResponse.json({ error: "Incorrect current password." }, { status: 400 });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await db
      .update(adminUsers)
      .set({
        passwordHash: newHash,
        updatedAt: new Date(),
      })
      .where(eq(adminUsers.id, admin.id));

    // Anyone holding an old session (e.g. a stolen cookie) is signed out
    await revokeOtherAdminSessions(admin.id, admin.sessionId);

    await db.insert(activityLogs).values({
      id: `log-${crypto.randomUUID()}`,
      actorEmail: admin.email,
      action: "CHANGE_PASSWORD",
      entityType: "ADMIN_USER",
      entityId: admin.id,
      metadata: JSON.stringify({ message: "Password updated successfully." }),
    });

    return NextResponse.json({ success: true, message: "Password changed successfully." });
  } catch (err) {
    console.error("Change password error:", err);
    return NextResponse.json({ error: "Failed to change password." }, { status: 500 });
  }
}
