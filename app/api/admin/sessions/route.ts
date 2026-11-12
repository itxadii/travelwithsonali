import { NextResponse } from "next/server";
import { getCurrentAdmin, listAdminSessions, revokeOtherAdminSessions } from "@/lib/admin/auth";

/** Devices currently signed in to the admin account. */
export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const devices = await listAdminSessions(admin.id, admin.sessionId);
    return NextResponse.json(devices);
  } catch (err) {
    console.error("GET admin sessions error:", err);
    return NextResponse.json({ error: "Failed to load signed-in devices" }, { status: 500 });
  }
}

/** Signs out every other device. */
export async function DELETE() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const count = await revokeOtherAdminSessions(admin.id, admin.sessionId);
    return NextResponse.json({ success: true, count });
  } catch (err) {
    console.error("DELETE admin sessions error:", err);
    return NextResponse.json({ error: "Failed to sign out other devices" }, { status: 500 });
  }
}
