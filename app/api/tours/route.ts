import { NextResponse } from "next/server";
import { getActiveTours } from "@/lib/sanity/queries";

export const dynamic = "force-static";
export const revalidate = 60;

/** Published tours for form dropdowns (admin bookings/leads, enquiry forms). */
export async function GET() {
  const tours = await getActiveTours();
  return NextResponse.json(
    tours.map((t) => ({ id: t.id, title: t.title, price: t.price, numericPrice: t.numericPrice }))
  );
}
