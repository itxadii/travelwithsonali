import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { db } from "@/db";
import { reviews, activityLogs } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const allReviews = await db
      .select()
      .from(reviews)
      .orderBy(desc(reviews.createdAt));

    return NextResponse.json(allReviews);
  } catch (err) {
    console.error("GET /api/admin/reviews error:", err);
    return NextResponse.json(
      { error: "Failed to fetch admin reviews" },
      { status: 500 }
    );
  }
}
