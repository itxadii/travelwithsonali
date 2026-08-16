import { NextResponse } from "next/server";
import { getCurrentCustomer } from "@/lib/portal/auth";
import { db } from "@/db";
import { bookings, documents, travellers } from "@/db/schema";
import { eq, inArray, and } from "drizzle-orm";

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

    const body = await req.json();
    const { documentId, travellerId, bookingId, documentType, documentName } = body;

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
      // Update existing document status to Under Review
      await db
        .update(documents)
        .set({
          status: "Under Review",
          updatedAt: new Date(),
        })
        .where(eq(documents.id, documentId));

      return NextResponse.json({ success: true, message: "Document uploaded and submitted for verification!" });
    }

    // Create new document record
    const newId = `doc-${Date.now()}`;
    await db.insert(documents).values({
      id: newId,
      customerId: customer.id,
      bookingId: bookingId || null,
      travellerId: travellerId || null,
      documentType: documentType || "Aadhaar",
      documentName: documentName || "Identity Proof",
      status: "Under Review",
    });

    return NextResponse.json({ success: true, message: "Document uploaded successfully!", documentId: newId });
  } catch (err) {
    console.error("POST /api/portal/documents error:", err);
    return NextResponse.json({ error: "Failed to submit document." }, { status: 500 });
  }
}
