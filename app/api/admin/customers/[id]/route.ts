import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { db } from "@/db";
import { customers, bookings, travellers, documents } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { deleteCustomer } from "@/lib/admin/deletes";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const cust = await db.select().from(customers).where(eq(customers.id, id));
    if (cust.length === 0) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    const customerBookings = await db
      .select()
      .from(bookings)
      .where(eq(bookings.customerId, id))
      .orderBy(desc(bookings.createdAt));

    const customerTravellers = await db
      .select()
      .from(travellers)
      .where(eq(travellers.customerId, id));

    const customerDocs = await db
      .select()
      .from(documents)
      .where(eq(documents.customerId, id));

    return NextResponse.json({
      customer: cust[0],
      bookings: customerBookings,
      travellers: customerTravellers,
      documents: customerDocs,
    });
  } catch (err) {
    console.error("GET customer detail error:", err);
    return NextResponse.json({ error: "Failed to fetch customer profile" }, { status: 500 });
  }
}

/** Permanently deletes the record (and anything that only belongs to it). */
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const result = await deleteCustomer(id, admin.email);
    if (!result.success) return NextResponse.json({ error: result.error }, { status: result.status });
    return NextResponse.json(result);
  } catch (err) {
    console.error("DELETE deleteCustomer error:", err);
    return NextResponse.json({ error: "Couldn't delete it. Please try again." }, { status: 500 });
  }
}
