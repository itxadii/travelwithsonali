import { NextResponse } from "next/server";
import { getCurrentCustomer } from "@/lib/portal/auth";
import { db } from "@/db";
import { bookings, travellers, documents, notifications, payments } from "@/db/schema";
import { eq, inArray, desc } from "drizzle-orm";
import { getActiveTours, getTourBySlug, resolveImageUrl } from "@/lib/sanity/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const customer = await getCurrentCustomer();
    if (!customer) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    // 1. Fetch customer's bookings
    const customerBookings = await db
      .select()
      .from(bookings)
      .where(eq(bookings.customerId, customer.id))
      .orderBy(desc(bookings.createdAt));

    // 2. Separate into upcoming & past
    const activeBookings = customerBookings.filter((b) => b.bookingStatus !== "Cancelled");
    const upcomingBookings = activeBookings.filter((b) => b.bookingStatus !== "Completed");
    const pastBookings = activeBookings.filter((b) => b.bookingStatus === "Completed");

    // Primary next trip (first upcoming or most recent)
    const nextBooking = upcomingBookings.length > 0 ? upcomingBookings[0] : null;

    let nextTripDetail = null;
    let SanityTourData = null;

    if (nextBooking) {
      // Resolve Sanity tour content
      const tours = await getActiveTours();
      let matchedTour = tours.find((t) => t.id === nextBooking.sanityTourId || t.slug === nextBooking.sanityTourId);
      if (!matchedTour) {
        matchedTour = tours.find((t) => t.title.toLowerCase().includes(nextBooking.tourTitle.toLowerCase()));
      }

      SanityTourData = matchedTour || null;

      // Fetch travellers for this booking
      const bookingTravellers = await db
        .select()
        .from(travellers)
        .where(eq(travellers.bookingId, nextBooking.id));

      // Fetch documents for this booking
      const bookingDocs = await db
        .select()
        .from(documents)
        .where(eq(documents.bookingId, nextBooking.id));

      // Calculate readiness score
      let totalSteps = 4;
      let completedSteps = 0;

      if (nextBooking.bookingStatus === "Confirmed") completedSteps++;
      if (bookingTravellers.length > 0) completedSteps++;
      if (nextBooking.paymentStatus === "Paid" || nextBooking.paidAmount > 0) completedSteps++;
      const verifiedDocs = bookingDocs.filter((d) => d.status === "Verified" || d.status === "Uploaded");
      if (bookingDocs.length > 0 && verifiedDocs.length === bookingDocs.length) completedSteps++;

      const readinessPercentage = Math.round((completedSteps / totalSteps) * 100);

      nextTripDetail = {
        booking: nextBooking,
        sanityTour: SanityTourData,
        travellersCount: bookingTravellers.length,
        documentsVerifiedCount: verifiedDocs.length,
        totalDocumentsCount: bookingDocs.length,
        readinessPercentage,
      };
    }

    // 3. Fetch Notifications for customer
    const userNotifs = await db
      .select()
      .from(notifications)
      .where(eq(notifications.recipientId, customer.id))
      .orderBy(desc(notifications.createdAt));

    // Featured tours if no upcoming trip
    const featuredTours = upcomingBookings.length === 0 ? (await getActiveTours()).slice(0, 3) : [];

    return NextResponse.json({
      customer,
      nextTrip: nextTripDetail,
      totalUpcomingCount: upcomingBookings.length,
      totalPastCount: pastBookings.length,
      notifications: userNotifs,
      featuredTours,
    });
  } catch (err) {
    console.error("GET /api/portal/dashboard error:", err);
    return NextResponse.json({ error: "Failed to load dashboard." }, { status: 500 });
  }
}
