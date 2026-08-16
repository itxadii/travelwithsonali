import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { db } from "@/db";
import { documents, customers, travellers, activityLogs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const list = await db
      .select({
        id: documents.id,
        customerId: documents.customerId,
        customerName: customers.name,
        bookingId: documents.bookingId,
        travellerId: documents.travellerId,
        travellerName: travellers.fullName,
        documentType: documents.documentType,
        documentName: documents.documentName,
        filePath: documents.filePath,
        status: documents.status,
        verifiedBy: documents.verifiedBy,
        notes: documents.notes,
        createdAt: documents.createdAt,
      })
      .from(documents)
      .leftJoin(customers, eq(documents.customerId, customers.id))
      .leftJoin(travellers, eq(documents.travellerId, travellers.id))
      .orderBy(desc(documents.createdAt));

    return NextResponse.json(list);
  } catch (err) {
    console.error("GET documents error:", err);
    return NextResponse.json({ error: "Failed to fetch document metadata" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { documentId, status, notes } = body;

    if (!documentId || !status) {
      return NextResponse.json({ error: "Document ID and Status are required." }, { status: 400 });
    }

    await db
      .update(documents)
      .set({
        status,
        verifiedBy: admin.email,
        notes: notes || null,
        updatedAt: new Date(),
      })
      .where(eq(documents.id, documentId));

    // Audit log
    await db.insert(activityLogs).values({
      id: `log-${Date.now()}`,
      actorEmail: admin.email,
      action: status === "Verified" ? "VERIFY_DOCUMENT" : "REJECT_DOCUMENT",
      entityType: "DOCUMENT",
      entityId: documentId,
      metadata: JSON.stringify({ status, notes }),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH document error:", err);
    return NextResponse.json({ error: "Failed to update document status" }, { status: 500 });
  }
}
