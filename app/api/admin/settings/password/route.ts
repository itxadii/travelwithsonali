import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { db } from "@/db";
import { adminUsers, activityLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

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

    if (newPassword.length < 8) {
      return NextResponse.json({ error: "New password must be at least 8 characters long." }, { status: 400 });
    }

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

    await db.insert(activityLogs).values({
      id: `log-${Date.now()}`,
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
