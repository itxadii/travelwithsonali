import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { deleteTraveller } from "@/lib/admin/deletes";

/** Permanently deletes the record (and anything that only belongs to it). */
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const result = await deleteTraveller(id, admin.email);
    if (!result.success) return NextResponse.json({ error: result.error }, { status: result.status });
    return NextResponse.json(result);
  } catch (err) {
    console.error("DELETE deleteTraveller error:", err);
    return NextResponse.json({ error: "Couldn't delete it. Please try again." }, { status: 500 });
  }
}
