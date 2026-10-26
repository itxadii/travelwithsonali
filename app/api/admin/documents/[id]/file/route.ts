import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { documentFileResponse } from "@/lib/documentFiles";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const download = new URL(request.url).searchParams.get("download") === "1";
    return await documentFileResponse(id, download);
  } catch (err) {
    console.error("GET /api/admin/documents/[id]/file error:", err);
    return NextResponse.json({ error: "Failed to load document file." }, { status: 500 });
  }
}
