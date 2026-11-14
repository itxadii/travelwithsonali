import { NextResponse } from "next/server";
import { and, eq, ne } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { db } from "@/db";
import { activityLogs, documents, travellers } from "@/db/schema";
import { getCurrentCustomer } from "@/lib/portal/auth";

export const dynamic = "force-dynamic";

/**
 * A customer deletes one of their own documents. Verified documents are locked: once the
 * team has checked an ID it stays on file (only an admin can remove it).
 */
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const customer = await getCurrentCustomer();
  if (!customer) {
    return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
  }

  const { id } = await params;
  try {
    const doc = (await db.select().from(documents).where(and(eq(documents.id, id), eq(documents.customerId, customer.id))))[0];
    if (!doc) {
      return NextResponse.json({ error: "Document not found." }, { status: 404 });
    }
    if (doc.status === "Verified") {
      return NextResponse.json(
        { error: "This document has been verified, so it can't be deleted. Message us on WhatsApp if it needs changing." },
        { status: 409 }
      );
    }

    await db.batch([
      // Only delete if it still isn't verified (an admin may have verified it a moment ago)
      db.delete(documents).where(and(eq(documents.id, id), eq(documents.customerId, customer.id), ne(documents.status, "Verified"))),
      ...(doc.travellerId
        ? [db.update(travellers).set({ idDocumentStatus: "Pending" }).where(eq(travellers.id, doc.travellerId))]
        : []),
      db.insert(activityLogs).values({
        id: `log-${randomUUID()}`,
        actorEmail: customer.email || customer.phone,
        action: "CUSTOMER_DELETE_DOCUMENT",
        entityType: "DOCUMENT",
        entityId: id,
        metadata: JSON.stringify({ documentName: doc.documentName, status: doc.status }),
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/portal/documents/[id] error:", err);
    return NextResponse.json({ error: "Couldn't delete the document. Please try again." }, { status: 500 });
  }
}
