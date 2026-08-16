import { NextResponse } from "next/server";
import { getCurrentCustomer } from "@/lib/portal/auth";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getActiveTours, resolveImageUrl } from "@/lib/sanity/queries";

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

    const tours = await getActiveTours();

    const formattedBookings = customerBookings.map((b) => {
      const matchedTour = tours.find(
        (t) => t.id === b.sanityTourId || t.slug === b.sanityTourId || t.title.toLowerCase().includes(b.tourTitle.toLowerCase())
      );

      return {
        ...b,
        image: matchedTour ? matchedTour.image : "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
        destination: matchedTour ? matchedTour.destination : "India",
        duration: matchedTour ? matchedTour.duration : "Multiple Days",
      };
    });

    const upcoming = formattedBookings.filter((b) => b.bookingStatus !== "Completed" && b.bookingStatus !== "Cancelled");
    const past = formattedBookings.filter((b) => b.bookingStatus === "Completed");
    const cancelled = formattedBookings.filter((b) => b.bookingStatus === "Cancelled");

    return NextResponse.json({
      all: formattedBookings,
      upcoming,
      past,
      cancelled,
    });
  } catch (err) {
    console.error("GET /api/portal/trips error:", err);
    return NextResponse.json({ error: "Failed to load customer trips." }, { status: 500 });
  }
}
