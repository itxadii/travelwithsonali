import { NextResponse } from "next/server";
import { getCurrentCustomer } from "@/lib/portal/auth";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { eq, or, isNull, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const customer = await getCurrentCustomer();
    if (!customer) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const notifList = await db
      .select()
      .from(notifications)
      .where(or(eq(notifications.recipientId, customer.id), isNull(notifications.recipientId)))
      .orderBy(desc(notifications.createdAt));

    const unreadCount = notifList.filter((n) => !n.isRead).length;

    return NextResponse.json({
      notifications: notifList,
      unreadCount,
    });
  } catch (err) {
    console.error("GET /api/portal/notifications error:", err);
    return NextResponse.json({ error: "Failed to load notifications." }, { status: 500 });
  }
}

export async function PATCH() {
  try {
    const customer = await getCurrentCustomer();
    if (!customer) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.recipientId, customer.id));

    return NextResponse.json({ success: true, message: "Marked all as read." });
  } catch (err) {
    console.error("PATCH /api/portal/notifications error:", err);
    return NextResponse.json({ error: "Failed to update notifications." }, { status: 500 });
  }
}
