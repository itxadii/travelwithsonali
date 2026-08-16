import { NextResponse } from "next/server";
import { getCurrentCustomer } from "@/lib/portal/auth";
import { db } from "@/db";
import { bookings, travellers, payments, documents } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getActiveTours, getTourBySlug } from "@/lib/sanity/queries";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const customer = await getCurrentCustomer();
    if (!customer) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const { bookingId } = await params;

    // Strict Authorization Check: Ensure booking belongs to this customer
    const userBookings = await db
      .select()
      .from(bookings)
      .where(and(eq(bookings.id, bookingId), eq(bookings.customerId, customer.id)));

    if (userBookings.length === 0) {
      // Return 404 so Customer A cannot even detect existence of Customer B's booking!
      return NextResponse.json({ error: "Booking record not found." }, { status: 404 });
    }

    const booking = userBookings[0];

    // Fetch travellers
    const bookingTravellers = await db
      .select()
      .from(travellers)
      .where(eq(travellers.bookingId, booking.id));

    // Fetch payments
    const bookingPayments = await db
      .select()
      .from(payments)
      .where(eq(payments.bookingId, booking.id));

    // Fetch documents
    const bookingDocs = await db
      .select()
      .from(documents)
      .where(eq(documents.bookingId, booking.id));

    // Resolve Sanity tour content
    const tours = await getActiveTours();
    let matchedTour = tours.find(
      (t) => t.id === booking.sanityTourId || t.slug === booking.sanityTourId || t.title.toLowerCase().includes(booking.tourTitle.toLowerCase())
    );

    if (!matchedTour && booking.sanityTourId) {
      matchedTour = (await getTourBySlug(booking.sanityTourId)) || undefined;
    }

    // Operational stay / transport assignment check
    const stayInfo = null; // Admin can assign when finalized
    const transportInfo = null;
    const coordinatorInfo = {
      name: "Sonali Sharma",
      role: "Lead Group Coordinator",
      phone: "+91 98765 43210",
      whatsapp: "+91 98765 43210",
    };

    return NextResponse.json({
      booking,
      sanityTour: matchedTour || null,
      travellers: bookingTravellers,
      payments: bookingPayments,
      documents: bookingDocs,
      operationalInfo: {
        stay: stayInfo,
        transport: transportInfo,
        coordinator: coordinatorInfo,
      },
    });
  } catch (err) {
    console.error("GET /api/portal/trips/[bookingId] error:", err);
    return NextResponse.json({ error: "Failed to load trip details." }, { status: 500 });
  }
}
