import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { changeAdminRole, isOwner, removeAdmin } from "@/lib/admin/team";

/** Changes someone's role (owner ↔ admin). */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isOwner(admin)) {
    return NextResponse.json({ error: "Only owners can change roles." }, { status: 403 });
  }

  const { id } = await params;
  try {
    const body = await request.json();
    const result = await changeAdminRole(id, String(body.role || ""), admin);
    if (!result.success) return NextResponse.json({ error: result.error }, { status: result.status });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH team member error:", err);
    return NextResponse.json({ error: "Couldn't change the role right now." }, { status: 500 });
  }
}

/** Removes someone's access; they're signed out on every device. */
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isOwner(admin)) {
    return NextResponse.json({ error: "Only owners can remove people." }, { status: 403 });
  }

  const { id } = await params;
  try {
    const result = await removeAdmin(id, admin);
    if (!result.success) return NextResponse.json({ error: result.error }, { status: result.status });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE team member error:", err);
    return NextResponse.json({ error: "Couldn't remove them right now." }, { status: 500 });
  }
}
