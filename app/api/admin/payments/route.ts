import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { db } from "@/db";
import { payments, bookings, activityLogs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const list = await db.select().from(payments).orderBy(desc(payments.createdAt));
    return NextResponse.json(list);
  } catch (err) {
    console.error("GET payments error:", err);
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { bookingId, amount, paymentMethod, paymentDate, referenceNumber, notes } = body;

    const amountVal = Number(amount);
    if (!bookingId || isNaN(amountVal) || amountVal <= 0) {
      return NextResponse.json(
        { error: "Booking ID and valid positive payment Amount > 0 are required." },
        { status: 400 }
      );
    }

    const bList = await db.select().from(bookings).where(eq(bookings.id, bookingId));
    if (bList.length === 0) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const booking = bList[0];
    const newPaidAmount = booking.paidAmount + amountVal;
    const newOutstanding = Math.max(0, booking.totalAmount - newPaidAmount);

    let newPaymentStatus = "Unpaid";
    if (newPaidAmount >= booking.totalAmount && booking.totalAmount > 0) {
      newPaymentStatus = "Paid";
    } else if (newPaidAmount > 0) {
      newPaymentStatus = "Partially Paid";
    }

    const payId = `pay-${Date.now()}`;
    await db.insert(payments).values({
      id: payId,
      bookingId,
      amount: amountVal,
      paymentMethod: paymentMethod || "UPI",
      paymentDate: paymentDate || new Date().toISOString().split("T")[0],
      referenceNumber: referenceNumber || null,
      notes: notes || null,
      recordedBy: admin.email,
    });

    // Update booking financials
    await db
      .update(bookings)
      .set({
        paidAmount: newPaidAmount,
        outstandingAmount: newOutstanding,
        paymentStatus: newPaymentStatus,
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, bookingId));

    // Audit log
    await db.insert(activityLogs).values({
      id: `log-${Date.now()}`,
      actorEmail: admin.email,
      action: "ADD_PAYMENT",
      entityType: "BOOKING",
      entityId: bookingId,
      metadata: JSON.stringify({
        amount: amountVal,
        paymentMethod,
        referenceNumber,
        newPaidAmount,
        newOutstanding,
      }),
    });

    return NextResponse.json({
      success: true,
      paymentId: payId,
      newPaidAmount,
      newOutstanding,
      paymentStatus: newPaymentStatus,
    });
  } catch (err) {
    console.error("POST payment error:", err);
    return NextResponse.json({ error: "Failed to record payment" }, { status: 500 });
  }
}
