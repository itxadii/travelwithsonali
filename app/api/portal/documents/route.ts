import { NextResponse } from "next/server";
import { getCurrentCustomer } from "@/lib/portal/auth";
import { db } from "@/db";
import { bookings, documents, travellers } from "@/db/schema";
import { eq, inArray, and, or } from "drizzle-orm";
import { checkRateLimits, tooManyRequests } from "@/lib/rateLimit";
import { saveDocumentFile, validateDocumentFile } from "@/lib/documentFiles";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const customer = await getCurrentCustomer();
    if (!customer) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const customerBookings = await db
      .select({ id: bookings.id, bookingCode: bookings.bookingCode })
      .from(bookings)
      .where(eq(bookings.customerId, customer.id));

    if (customerBookings.length === 0) {
      return NextResponse.json({ documents: [], summary: { total: 0, completed: 0, pending: 0 } });
    }

    const bookingIds = customerBookings.map((b) => b.id);

    const docList = await db
      .select()
      .from(documents)
      .where(inArray(documents.bookingId, bookingIds));

    const travellerList = await db
      .select()
      .from(travellers)
      .where(inArray(travellers.bookingId, bookingIds));

    const formattedDocs = docList.map((d) => {
      const matchTraveller = travellerList.find((t) => t.id === d.travellerId);
      return {
        ...d,
        travellerName: matchTraveller ? matchTraveller.fullName : customer.name,
      };
    });

    const completed = formattedDocs.filter((d) => d.status === "Verified" || d.status === "Uploaded").length;

    return NextResponse.json({
      documents: formattedDocs,
      travellers: travellerList,
      summary: {
        total: formattedDocs.length || travellerList.length,
        completed,
        pending: (formattedDocs.length || travellerList.length) - completed,
      },
    });
  } catch (err) {
    console.error("GET /api/portal/documents error:", err);
    return NextResponse.json({ error: "Failed to load documents." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const customer = await getCurrentCustomer();
    if (!customer) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const rate = await checkRateLimits([
      { key: ["document-upload:customer", customer.id], limit: 20, windowSeconds: 60 * 60 },
    ]);
    if (!rate.allowed) return tooManyRequests(rate.retryAfterSeconds);

    let form: FormData;
    try {
      form = await req.formData();
    } catch {
      return NextResponse.json({ error: "Please attach the document file." }, { status: 400 });
    }

    const file = form.get("file");
    const fileError = validateDocumentFile(file instanceof File ? file : null);
    if (fileError) {
      return NextResponse.json({ error: fileError }, { status: 400 });
    }
    const upload = file as File;

    const field = (name: string) => {
      const value = form.get(name);
      return typeof value === "string" && value.trim() ? value.trim() : null;
    };
    const documentId = field("documentId");
    const travellerId = field("travellerId");
    const bookingId = field("bookingId");
    const documentType = field("documentType") || "Aadhaar Card";

    // Verify booking belongs to customer
    if (bookingId) {
      const userBookings = await db
        .select()
        .from(bookings)
        .where(and(eq(bookings.id, bookingId), eq(bookings.customerId, customer.id)));

      if (userBookings.length === 0) {
        return NextResponse.json({ error: "Unauthorized booking resource." }, { status: 403 });
      }
    }

    if (documentId) {
      // Attach a file to one of the customer's existing (requested) documents
      const updated = await db
        .update(documents)
        .set({
          status: "Under Review",
          filePath: upload.name.slice(0, 200),
          notes: null,
          updatedAt: new Date(),
        })
        .where(and(eq(documents.id, documentId), eq(documents.customerId, customer.id)))
        .returning({ id: documents.id });

      if (updated.length === 0) {
        return NextResponse.json({ error: "Document not found." }, { status: 404 });
      }

      await saveDocumentFile(documentId, upload);
      return NextResponse.json({ success: true, message: "Document uploaded and submitted for verification!" });
    }

    // Verify traveller belongs to customer (directly or via one of their bookings)
    if (travellerId) {
      const ownedTravellers = await db
        .select({ id: travellers.id })
        .from(travellers)
        .leftJoin(bookings, eq(travellers.bookingId, bookings.id))
        .where(
          and(
            eq(travellers.id, travellerId),
            or(eq(travellers.customerId, customer.id), eq(bookings.customerId, customer.id))
          )
        );

      if (ownedTravellers.length === 0) {
        return NextResponse.json({ error: "Unauthorized traveller resource." }, { status: 403 });
      }
    }

    // Create new document record
    const newId = `doc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    await db.insert(documents).values({
      id: newId,
      customerId: customer.id,
      bookingId: bookingId || null,
      travellerId: travellerId || null,
      documentType,
      documentName: documentType,
      filePath: upload.name.slice(0, 200),
      status: "Under Review",
    });

    try {
      await saveDocumentFile(newId, upload);
    } catch (err) {
      // Don't leave a record that claims a file exists when it doesn't
      await db.delete(documents).where(eq(documents.id, newId));
      throw err;
    }

    return NextResponse.json({ success: true, message: "Document uploaded successfully!", documentId: newId });
  } catch (err) {
    console.error("POST /api/portal/documents error:", err);
    return NextResponse.json({ error: "Failed to upload document. Please try again." }, { status: 500 });
  }
}
