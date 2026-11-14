import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { db } from "@/db";
import { bookings, customers, travellers, payments, documents, activityLogs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { sendBookingStatusEmail } from "@/lib/mailer";
import { deleteBooking } from "@/lib/admin/deletes";

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

    const before = (await db.select().from(bookings).where(eq(bookings.id, id)))[0];
    if (!before) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    await db.update(bookings).set(updateObj).where(eq(bookings.id, id));

    // Tell the customer when the status actually changes (email is a bonus; the update is saved)
    if (bookingStatus && bookingStatus !== before.bookingStatus) {
      const customer = (await db.select().from(customers).where(eq(customers.id, before.customerId)))[0];
      if (customer?.email) {
        try {
          await sendBookingStatusEmail({
            to: customer.email,
            name: customer.name,
            bookingId: id,
            bookingCode: before.bookingCode,
            tourTitle: before.tourTitle,
            departureDate: before.departureDate,
            status: bookingStatus,
          });
        } catch (mailErr) {
          console.warn("Booking status email not sent:", mailErr instanceof Error ? mailErr.message : mailErr);
        }
      }
    }

    await db.insert(activityLogs).values({
      id: `log-${crypto.randomUUID()}`,
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

/** Permanently deletes the record (and anything that only belongs to it). */
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const result = await deleteBooking(id, admin.email);
    if (!result.success) return NextResponse.json({ error: result.error }, { status: result.status });
    return NextResponse.json(result);
  } catch (err) {
    console.error("DELETE deleteBooking error:", err);
    return NextResponse.json({ error: "Couldn't delete it. Please try again." }, { status: 500 });
  }
}
