import { and, desc, eq, gte } from "drizzle-orm";
import { db } from "@/db";
import { reviews } from "@/db/schema";
import type { Testimonial } from "@/app/data/testimonialsData";

/** Latest approved, well-rated reviews from real travellers, for the homepage testimonials. */
export async function getHomepageTestimonials(limit = 5): Promise<Testimonial[]> {
  try {
    const rows = await db
      .select()
      .from(reviews)
      .where(and(eq(reviews.isApproved, true), gte(reviews.rating, 4)))
      .orderBy(desc(reviews.createdAt))
      .limit(limit);

    return rows.map((r) => ({
      id: r.id,
      name: r.userName,
      location: r.location || "",
      avatar: "",
      trip: r.tourTitle,
      rating: r.rating,
      date: r.tripDate || r.createdAt.toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
      quote: r.comment,
    }));
  } catch (err) {
    console.error("getHomepageTestimonials error:", err);
    return [];
  }
}
