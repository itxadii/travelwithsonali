import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { db } from "@/db";
import { customers, activityLogs } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const allCustomers = await db.select().from(customers).orderBy(desc(customers.createdAt));
    return NextResponse.json(allCustomers);
  } catch (err) {
    console.error("GET customers error:", err);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, phone, email, notes } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Customer Name and Phone are required." },
        { status: 400 }
      );
    }

    const customerId = `cust-${Date.now()}`;
    await db.insert(customers).values({
      id: customerId,
      name,
      phone,
      email: email || null,
      notes: notes || null,
    });

    await db.insert(activityLogs).values({
      id: `log-${Date.now()}`,
      actorEmail: admin.email,
      action: "CREATE_CUSTOMER",
      entityType: "CUSTOMER",
      entityId: customerId,
      metadata: JSON.stringify({ name, phone }),
    });

    return NextResponse.json({ success: true, customerId });
  } catch (err) {
    console.error("POST customer error:", err);
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 });
  }
}
