import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { db } from "@/db";
import { leads, leadFollowups, customers, activityLogs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const leadList = await db.select().from(leads).where(eq(leads.id, id));
    if (leadList.length === 0) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const followups = await db
      .select()
      .from(leadFollowups)
      .where(eq(leadFollowups.leadId, id))
      .orderBy(desc(leadFollowups.createdAt));

    return NextResponse.json({
      lead: leadList[0],
      followups,
    });
  } catch (err) {
    console.error("GET lead detail error:", err);
    return NextResponse.json({ error: "Failed to fetch lead" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { status, notes, followupNote } = body;

    const leadList = await db.select().from(leads).where(eq(leads.id, id));
    if (leadList.length === 0) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const targetLead = leadList[0];

    const updateObj: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (status) updateObj.status = status;
    if (notes !== undefined) updateObj.notes = notes;

    await db.update(leads).set(updateObj).where(eq(leads.id, id));

    // AUTO-CONVERT LEAD TO CUSTOMER IF STATUS SET TO 'Converted'
    if (status === "Converted") {
      const existingCustomer = await db
        .select()
        .from(customers)
        .where(eq(customers.phone, targetLead.mobile));

      if (existingCustomer.length === 0) {
        const newCustomerId = `cust-${Date.now()}`;
        await db.insert(customers).values({
          id: newCustomerId,
          name: targetLead.name,
          phone: targetLead.mobile,
          email: targetLead.email || null,
          status: "Active",
          notes: `Converted from lead for ${targetLead.interestedTourTitle}`,
        });

        await db.insert(activityLogs).values({
          id: `log-${Date.now()}`,
          actorEmail: admin.email,
          action: "AUTO_CONVERT_CUSTOMER",
          entityType: "CUSTOMER",
          entityId: newCustomerId,
          metadata: JSON.stringify({ name: targetLead.name, phone: targetLead.mobile }),
        });
      }
    }

    if (followupNote) {
      await db.insert(leadFollowups).values({
        id: `fol-${Date.now()}`,
        leadId: id,
        note: followupNote,
        createdBy: admin.name,
      });
    }

    await db.insert(activityLogs).values({
      id: `log-${Date.now()}`,
      actorEmail: admin.email,
      action: "UPDATE_LEAD",
      entityType: "LEAD",
      entityId: id,
      metadata: JSON.stringify({ status, followupNote }),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH lead error:", err);
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
  }
}
