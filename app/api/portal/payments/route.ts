import { NextResponse } from "next/server";
import { getCurrentCustomer } from "@/lib/portal/auth";
import { db } from "@/db";
import { bookings, payments } from "@/db/schema";
import { eq, inArray, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const customer = await getCurrentCustomer();
    if (!customer) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const customerBookings = await db
      .select()
      .from(bookings)
      .where(eq(bookings.customerId, customer.id))
      .orderBy(desc(bookings.createdAt));

    if (customerBookings.length === 0) {
      return NextResponse.json({
        summary: { total: 0, paid: 0, remaining: 0 },
        payments: [],
      });
    }

    const bookingIds = customerBookings.map((b) => b.id);
    const paymentRecords = await db
      .select()
      .from(payments)
      .where(inArray(payments.bookingId, bookingIds))
      .orderBy(desc(payments.createdAt));

    const totalAmount = customerBookings.reduce((sum, b) => sum + b.totalAmount, 0);
    const totalPaid = customerBookings.reduce((sum, b) => sum + b.paidAmount, 0);
    const remainingAmount = customerBookings.reduce((sum, b) => sum + b.outstandingAmount, 0);

    const formattedPayments = paymentRecords.map((p) => {
      const match = customerBookings.find((b) => b.id === p.bookingId);
      return {
        ...p,
        tourTitle: match ? match.tourTitle : "N/A",
        bookingCode: match ? match.bookingCode : "N/A",
      };
    });

    return NextResponse.json({
      summary: {
        total: totalAmount,
        paid: totalPaid,
        remaining: remainingAmount,
        percentagePaid: totalAmount > 0 ? Math.round((totalPaid / totalAmount) * 100) : 0,
      },
      payments: formattedPayments,
      bookings: customerBookings,
    });
  } catch (err) {
    console.error("GET /api/portal/payments error:", err);
    return NextResponse.json({ error: "Failed to load payment history." }, { status: 500 });
  }
}
