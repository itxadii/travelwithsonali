import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { db } from "@/db";
import { bookings, customers, activityLogs, payments, travellers } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { findCustomerByIdentifier } from "@/lib/portal/auth";
import { sendBookingConfirmedEmail } from "@/lib/mailer";

/** TWS-<year>-<4 digits>, re-rolled until it isn't already used (booking_code is unique). */
async function generateBookingCode(): Promise<string> {
  const year = new Date().getFullYear();
  for (let attempt = 0; attempt < 10; attempt++) {
    const code = `TWS-${year}-${Math.floor(1000 + Math.random() * 9000)}`;
    const taken = await db.select({ id: bookings.id }).from(bookings).where(eq(bookings.bookingCode, code)).limit(1);
    if (taken.length === 0) return code;
  }
  // Practically unreachable; fall back to a code that can't collide
  return `TWS-${year}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}

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

    // Customer: the one picked by email in the form, else found by email (then mobile), else created
    const email = typeof customerEmail === "string" ? customerEmail.trim().toLowerCase() : "";
    const phone = typeof customerPhone === "string" ? customerPhone.trim() : "";

    if (targetCustomerId) {
      const picked = (await db.select({ id: customers.id }).from(customers).where(eq(customers.id, targetCustomerId)))[0];
      if (!picked) return NextResponse.json({ error: "That customer no longer exists. Check the email again." }, { status: 400 });
    } else {
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json({ error: "Enter a valid customer email." }, { status: 400 });
      }
      if (!email && !phone) {
        return NextResponse.json({ error: "Enter the customer's email, or their mobile number if they have no email." }, { status: 400 });
      }

      const existingCustomer =
        (email ? await findCustomerByIdentifier(email) : null) || (phone ? await findCustomerByIdentifier(phone) : null);

      if (existingCustomer) {
        targetCustomerId = existingCustomer.id;
        // Add the email if this customer didn't have one yet
        if (!existingCustomer.email && email) {
          await db.update(customers).set({ email }).where(eq(customers.id, existingCustomer.id));
        }
      } else {
        if (!customerName || !String(customerName).trim()) {
          return NextResponse.json({ error: "Enter the customer's name." }, { status: 400 });
        }
        targetCustomerId = `cust-${crypto.randomUUID()}`;
        await db.insert(customers).values({
          id: targetCustomerId,
          name: String(customerName).trim(),
          phone,
          email: email || null,
        });
      }
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

    const bookingId = `book-${crypto.randomUUID()}`;
    const bookingCode = await generateBookingCode();

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
        id: `pay-${crypto.randomUUID()}`,
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
        id: `trav-${crypto.randomUUID()}`,
        bookingId,
        customerId: targetCustomerId,
        fullName: primaryCust[0].name,
        mobile: primaryCust[0].phone,
        idDocumentStatus: "Pending",
      });
    }

    // Confirmation email is a bonus; the booking is already saved
    if (primaryCust[0]?.email) {
      try {
        await sendBookingConfirmedEmail({
          to: primaryCust[0].email,
          name: primaryCust[0].name,
          bookingId,
          bookingCode,
          tourTitle,
          departureDate: departureDate || "Upcoming Batch",
          travellersCount: tCount,
          totalAmount,
          paidAmount,
          outstandingAmount,
          hasPortalAccount: Boolean(primaryCust[0].passwordHash),
        });
      } catch (mailErr) {
        console.warn("Booking confirmation email not sent:", mailErr instanceof Error ? mailErr.message : mailErr);
      }
    }

    await db.insert(activityLogs).values({
      id: `log-${crypto.randomUUID()}`,
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
