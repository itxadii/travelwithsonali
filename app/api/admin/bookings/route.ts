import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { db } from "@/db";
import { bookings, customers, activityLogs, payments, travellers } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const list = await db
      .select({
        id: bookings.id,
        bookingCode: bookings.bookingCode,
        customerId: bookings.customerId,
        customerName: customers.name,
        customerPhone: customers.phone,
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
        createdAt: bookings.createdAt,
      })
      .from(bookings)
      .innerJoin(customers, eq(bookings.customerId, customers.id))
      .orderBy(desc(bookings.createdAt));

    return NextResponse.json(list);
  } catch (err) {
    console.error("GET bookings error:", err);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      customerId,
      customerName,
      customerPhone,
      customerEmail,
      sanityTourId,
      tourTitle,
      departureDate,
      travellersCount,
      pricePerTraveller,
      discount,
      advancePayment,
      paymentMethod,
      notes,
    } = body;

    let targetCustomerId = customerId;

    // Create Customer if new
    if (!targetCustomerId) {
      if (!customerName || !customerPhone) {
        return NextResponse.json({ error: "Customer Name and Phone are required." }, { status: 400 });
      }
      targetCustomerId = `cust-${Date.now()}`;
      await db.insert(customers).values({
        id: targetCustomerId,
        name: customerName,
        phone: customerPhone,
        email: customerEmail || null,
      });
    }

    const tCount = Number(travellersCount) || 1;
    const priceVal = Number(pricePerTraveller) || 0;
    const discountVal = Number(discount) || 0;
    const advanceVal = Number(advancePayment) || 0;

    const subtotal = priceVal * tCount;
    const totalAmount = Math.max(0, subtotal - discountVal);
    const paidAmount = Math.min(totalAmount, advanceVal);
    const outstandingAmount = Math.max(0, totalAmount - paidAmount);

    let paymentStatus = "Unpaid";
    if (paidAmount >= totalAmount && totalAmount > 0) {
      paymentStatus = "Paid";
    } else if (paidAmount > 0) {
      paymentStatus = "Partially Paid";
    }

    const bookingId = `book-${Date.now()}`;
    const bookingCode = `TWS-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    await db.insert(bookings).values({
      id: bookingId,
      bookingCode,
      customerId: targetCustomerId,
      sanityTourId: sanityTourId || null,
      tourTitle,
      departureDate: departureDate || "Upcoming Batch",
      travellersCount: tCount,
      pricePerTraveller: priceVal,
      discount: discountVal,
      totalAmount,
      paidAmount,
      outstandingAmount,
      paymentStatus,
      bookingStatus: "Confirmed",
      notes: notes || null,
    });

    // Advance Payment entry if provided
    if (advanceVal > 0) {
      await db.insert(payments).values({
        id: `pay-${Date.now()}`,
        bookingId,
        amount: paidAmount,
        paymentMethod: paymentMethod || "UPI",
        paymentDate: new Date().toISOString().split("T")[0],
        referenceNumber: `ADV-${bookingCode}`,
        notes: "Advance booking payment",
        recordedBy: admin.email,
      });
    }

    // Add Lead Customer as primary Traveller
    const primaryCust = await db.select().from(customers).where(eq(customers.id, targetCustomerId));
    if (primaryCust.length > 0) {
      await db.insert(travellers).values({
        id: `trav-${Date.now()}`,
        bookingId,
        customerId: targetCustomerId,
        fullName: primaryCust[0].name,
        mobile: primaryCust[0].phone,
        idDocumentStatus: "Pending",
      });
    }

    await db.insert(activityLogs).values({
      id: `log-${Date.now()}`,
      actorEmail: admin.email,
      action: "CREATE_BOOKING",
      entityType: "BOOKING",
      entityId: bookingId,
      metadata: JSON.stringify({ bookingCode, tourTitle, totalAmount, paidAmount }),
    });

    return NextResponse.json({ success: true, bookingId, bookingCode });
  } catch (err) {
    console.error("POST booking error:", err);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
