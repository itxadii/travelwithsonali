import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, getCurrentAdmin, revokeAdminSession } from "@/lib/admin/auth";

/** Signs out one device. Signing out the current device also clears its cookie. */
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const removed = await revokeAdminSession(admin.id, id);
    if (!removed) return NextResponse.json({ error: "Device not found" }, { status: 404 });

    const response = NextResponse.json({ success: true, current: id === admin.sessionId });
    if (id === admin.sessionId) response.cookies.set(ADMIN_SESSION_COOKIE, "", { maxAge: 0, path: "/" });
    return response;
  } catch (err) {
    console.error("DELETE admin session error:", err);
    return NextResponse.json({ error: "Failed to sign out that device" }, { status: 500 });
  }
}
