import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { inviteAdmin, isOwner, listTeam } from "@/lib/admin/team";

/** Everyone with access to the admin panel. Any admin can see the list; only owners change it. */
export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    return NextResponse.json({ members: await listTeam(), me: admin.id, canManage: isOwner(admin) });
  } catch (err) {
    console.error("GET team error:", err);
    return NextResponse.json({ error: "Failed to load the team." }, { status: 500 });
  }
}

/** Adds someone and emails them a link to set their password. */
export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isOwner(admin)) {
    return NextResponse.json({ error: "Only owners can add people to the team." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const result = await inviteAdmin(
      { name: String(body.name || ""), email: String(body.email || ""), role: String(body.role || "") },
      admin
    );
    if (!result.success) return NextResponse.json({ error: result.error }, { status: result.status });
    return NextResponse.json({ success: true, id: result.id });
  } catch (err) {
    console.error("POST team error:", err);
    return NextResponse.json({ error: "Couldn't add them right now." }, { status: 500 });
  }
}
