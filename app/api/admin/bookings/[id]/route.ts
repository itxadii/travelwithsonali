import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { db } from "@/db";
import { bookings, customers, travellers, payments, documents, activityLogs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const list = await db
      .select({
        id: bookings.id,
        bookingCode: bookings.bookingCode,
        customerId: bookings.customerId,
        customerName: customers.name,
        customerPhone: customers.phone,
        customerEmail: customers.email,
        sanityTourId: bookings.sanityTourId,
        tourTitle: bookings.tourTitle,
        departureDate: bookings.departureDate,
        travellersCount: bookings.travellersCount,
        pricePerTraveller: bookings.pricePerTraveller,
        discount: bookings.discount,
        totalAmount: bookings.totalAmount,
        paidAmount: bookings.paidAmount,
        outstandingAmount: bookings.outstandingAmount,
        paymentStatus: bookings.paymentStatus,
        bookingStatus: bookings.bookingStatus,
        notes: bookings.notes,
        createdAt: bookings.createdAt,
      })
      .from(bookings)
      .innerJoin(customers, eq(bookings.customerId, customers.id))
      .where(eq(bookings.id, id));

    if (list.length === 0) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const bookingTravellers = await db.select().from(travellers).where(eq(travellers.bookingId, id));
    const bookingPayments = await db.select().from(payments).where(eq(payments.bookingId, id)).orderBy(desc(payments.createdAt));
    const bookingDocs = await db.select().from(documents).where(eq(documents.bookingId, id));
    const logs = await db.select().from(activityLogs).where(eq(activityLogs.entityId, id)).orderBy(desc(activityLogs.createdAt));

    return NextResponse.json({
      booking: list[0],
      travellers: bookingTravellers,
      payments: bookingPayments,
      documents: bookingDocs,
      logs,
    });
  } catch (err) {
    console.error("GET booking detail error:", err);
    return NextResponse.json({ error: "Failed to fetch booking details" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { bookingStatus, notes } = body;

    const updateObj: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (bookingStatus) updateObj.bookingStatus = bookingStatus;
    if (notes !== undefined) updateObj.notes = notes;

    await db.update(bookings).set(updateObj).where(eq(bookings.id, id));

    await db.insert(activityLogs).values({
      id: `log-${Date.now()}`,
      actorEmail: admin.email,
      action: "UPDATE_BOOKING_STATUS",
      entityType: "BOOKING",
      entityId: id,
      metadata: JSON.stringify({ bookingStatus }),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH booking error:", err);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}
