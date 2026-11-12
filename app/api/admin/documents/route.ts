import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { db } from "@/db";
import { documents, customers, travellers, activityLogs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { sendDocumentStatusEmail } from "@/lib/mailer";

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
    if (!["Under Review", "Verified", "Rejected"].includes(status)) {
      return NextResponse.json({ error: "Status must be Under Review, Verified or Rejected." }, { status: 400 });
    }

    const updated = await db
      .update(documents)
      .set({
        status,
        verifiedBy: admin.email,
        notes: notes || null,
        updatedAt: new Date(),
      })
      .where(eq(documents.id, documentId))
      .returning({ travellerId: documents.travellerId, customerId: documents.customerId, documentName: documents.documentName });

    if (updated.length === 0) {
      return NextResponse.json({ error: "Document not found." }, { status: 404 });
    }

    // Keep the traveller's ID status in step with the verification decision
    if (updated[0].travellerId) {
      await db
        .update(travellers)
        .set({ idDocumentStatus: status })
        .where(eq(travellers.id, updated[0].travellerId));
    }

    // Let the customer know the outcome (email is a bonus; the status is saved)
    if (status !== "Under Review" && updated[0].customerId) {
      const owner = (await db.select().from(customers).where(eq(customers.id, updated[0].customerId)))[0];
      if (owner?.email) {
        try {
          await sendDocumentStatusEmail({
            to: owner.email,
            name: owner.name,
            documentName: updated[0].documentName,
            status,
            notes: notes || null,
          });
        } catch (mailErr) {
          console.warn("Document status email not sent:", mailErr instanceof Error ? mailErr.message : mailErr);
        }
      }
    }

    // Audit log
    await db.insert(activityLogs).values({
      id: `log-${crypto.randomUUID()}`,
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
