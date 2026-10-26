import { NextResponse } from "next/server";
import { getCurrentCustomer } from "@/lib/portal/auth";
import { db } from "@/db";
import { documents } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { documentFileResponse } from "@/lib/documentFiles";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const customer = await getCurrentCustomer();
  if (!customer) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  const { id } = await params;

  try {
    const owned = await db
      .select({ id: documents.id })
      .from(documents)
      .where(and(eq(documents.id, id), eq(documents.customerId, customer.id)));

    if (owned.length === 0) {
      return NextResponse.json({ error: "Document not found." }, { status: 404 });
    }

    const download = new URL(request.url).searchParams.get("download") === "1";
    return await documentFileResponse(id, download);
  } catch (err) {
    console.error("GET /api/portal/documents/[id]/file error:", err);
    return NextResponse.json({ error: "Failed to load document file." }, { status: 500 });
  }
}
