import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { db } from "@/db";
import { leads, activityLogs } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const allLeads = await db.select().from(leads).orderBy(desc(leads.createdAt));
    return NextResponse.json(allLeads);
  } catch (err) {
    console.error("GET leads error:", err);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
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
      name,
      mobile,
      email,
      interestedTourSanityId,
      interestedTourTitle,
      source,
      travellersCount,
      notes,
    } = body;

    if (!name || !mobile || !interestedTourTitle) {
      return NextResponse.json(
        { error: "Name, Mobile, and Interested Tour are required." },
        { status: 400 }
      );
    }

    const leadId = `lead-${Date.now()}`;
    await db.insert(leads).values({
      id: leadId,
      name,
      mobile,
      email: email || null,
      interestedTourSanityId: interestedTourSanityId || null,
      interestedTourTitle,
      source: source || "Website",
      travellersCount: Number(travellersCount) || 1,
      status: "New",
      assignedTo: admin.name,
      notes: notes || null,
    });

    // Log Activity
    await db.insert(activityLogs).values({
      id: `log-${Date.now()}`,
      actorEmail: admin.email,
      action: "CREATE_LEAD",
      entityType: "LEAD",
      entityId: leadId,
      metadata: JSON.stringify({ name, interestedTourTitle, source }),
    });

    return NextResponse.json({ success: true, leadId });
  } catch (err) {
    console.error("POST lead error:", err);
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}
