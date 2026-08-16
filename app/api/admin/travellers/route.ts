import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { db } from "@/db";
import { travellers, bookings, customers, activityLogs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const list = await db
      .select({
        id: travellers.id,
        bookingId: travellers.bookingId,
        bookingCode: bookings.bookingCode,
        tourTitle: bookings.tourTitle,
        departureDate: bookings.departureDate,
        customerName: customers.name,
        fullName: travellers.fullName,
        dob: travellers.dob,
        gender: travellers.gender,
        mobile: travellers.mobile,
        emergencyContact: travellers.emergencyContact,
        idDocumentType: travellers.idDocumentType,
        idNumberMasked: travellers.idNumberMasked,
        idDocumentStatus: travellers.idDocumentStatus,
        createdAt: travellers.createdAt,
      })
      .from(travellers)
      .innerJoin(bookings, eq(travellers.bookingId, bookings.id))
      .leftJoin(customers, eq(travellers.customerId, customers.id))
      .orderBy(desc(travellers.createdAt));

    return NextResponse.json(list);
  } catch (err) {
    console.error("GET travellers error:", err);
    return NextResponse.json({ error: "Failed to fetch travellers" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { bookingId, fullName, dob, gender, mobile, emergencyContact, idDocumentType, idNumber } = body;

    if (!bookingId || !fullName) {
      return NextResponse.json({ error: "Booking ID and Full Name are required." }, { status: 400 });
    }

    // Mask ID number (e.g. 1234 5678 9101 -> XXXX XXXX 9101)
    let masked = undefined;
    if (idNumber) {
      const clean = idNumber.replace(/\s+/g, "");
      if (clean.length >= 4) {
        masked = `XXXX XXXX ${clean.slice(-4)}`;
      } else {
        masked = `XXXX ${clean}`;
      }
    }

    const travId = `trav-${Date.now()}`;
    await db.insert(travellers).values({
      id: travId,
      bookingId,
      fullName,
      dob: dob || null,
      gender: gender || null,
      mobile: mobile || null,
      emergencyContact: emergencyContact || null,
      idDocumentType: idDocumentType || "Aadhaar",
      idNumberMasked: masked || null,
      idDocumentStatus: "Pending",
    });

    await db.insert(activityLogs).values({
      id: `log-${Date.now()}`,
      actorEmail: admin.email,
      action: "ADD_TRAVELLER",
      entityType: "TRAVELLER",
      entityId: travId,
      metadata: JSON.stringify({ fullName, bookingId }),
    });

    return NextResponse.json({ success: true, travellerId: travId });
  } catch (err) {
    console.error("POST traveller error:", err);
    return NextResponse.json({ error: "Failed to add traveller" }, { status: 500 });
  }
}
