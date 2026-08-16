import { NextResponse } from "next/server";
import { getCurrentCustomer } from "@/lib/portal/auth";
import { db } from "@/db";
import { bookings, travellers } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const customer = await getCurrentCustomer();
    if (!customer) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const customerBookings = await db
      .select({ id: bookings.id, bookingCode: bookings.bookingCode, tourTitle: bookings.tourTitle })
      .from(bookings)
      .where(eq(bookings.customerId, customer.id));

    if (customerBookings.length === 0) {
      return NextResponse.json([]);
    }

    const bookingIds = customerBookings.map((b) => b.id);
    const travellerList = await db
      .select()
      .from(travellers)
      .where(inArray(travellers.bookingId, bookingIds));

    const formatted = travellerList.map((t) => {
      const match = customerBookings.find((b) => b.id === t.bookingId);
      return {
        ...t,
        bookingCode: match ? match.bookingCode : "N/A",
        tourTitle: match ? match.tourTitle : "N/A",
      };
    });

    return NextResponse.json(formatted);
  } catch (err) {
    console.error("GET /api/portal/travellers error:", err);
    return NextResponse.json({ error: "Failed to load travellers." }, { status: 500 });
  }
}
