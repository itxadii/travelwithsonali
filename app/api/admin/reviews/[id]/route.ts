import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { db } from "@/db";
import { reviews, activityLogs } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Review ID required" }, { status: 400 });
  }

  try {
    // Find review first to record title/actor in activity log
    const existing = await db
      .select()
      .from(reviews)
      .where(eq(reviews.id, id));

    const deletedItem = existing[0];

    await db.delete(reviews).where(eq(reviews.id, id));

    // Log deletion activity
    await db.insert(activityLogs).values({
      id: `act-${Date.now()}`,
      actorEmail: admin.email,
      action: "DELETE_REVIEW",
      entityType: "review",
      entityId: id,
      metadata: JSON.stringify({
        reviewer: deletedItem?.userName || "unknown",
        tourTitle: deletedItem?.tourTitle || "unknown",
        commentExcerpt: deletedItem?.comment ? deletedItem.comment.substring(0, 100) : "",
        reason: "Inappropriate / spam review moderation by admin",
      }),
    });

    return NextResponse.json({
      success: true,
      message: "Review successfully deleted.",
      deletedId: id,
    });
  } catch (err) {
    console.error("DELETE /api/admin/reviews/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}
