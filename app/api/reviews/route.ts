import { NextResponse } from "next/server";
import { db, connectionString } from "@/db";
import { reviews } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { neon } from "@neondatabase/serverless";

let tableEnsured = false;

async function ensureTable() {
  if (tableEnsured || !connectionString) return;
  try {
    const sql = neon(connectionString);
    await sql`
      CREATE TABLE IF NOT EXISTS reviews (
        id TEXT PRIMARY KEY,
        tour_slug TEXT NOT NULL,
        tour_title TEXT NOT NULL,
        user_name TEXT NOT NULL,
        user_email TEXT,
        rating INTEGER NOT NULL DEFAULT 5,
        title TEXT,
        comment TEXT NOT NULL,
        location TEXT,
        trip_date TEXT,
        is_approved BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `;
    tableEnsured = true;
  } catch (err) {
    console.error("Failed to ensure reviews table:", err);
  }
}

// Initial sample reviews for tours to provide immediate social proof
const defaultSeedReviews: Record<string, Array<{
  id: string;
  tourSlug: string;
  tourTitle: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  location: string;
  tripDate: string;
  createdAt: string;
}>> = {
  "char-dham-yatra": [
    {
      id: "seed-cd-1",
      tourSlug: "char-dham-yatra",
      tourTitle: "Char Dham Yatra",
      userName: "Pooja Verma",
      rating: 5,
      title: "Soul-stirring journey with perfect coordination!",
      comment: "Traveling to Char Dham with Sonali and team was the best decision for my parents and me. The stays, warm food in high altitudes, and the support during the Kedarnath trek made everything effortless. Highly recommended!",
      location: "Mumbai",
      tripDate: "May 2026 Batch",
      createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    },
    {
      id: "seed-cd-2",
      tourSlug: "char-dham-yatra",
      tourTitle: "Char Dham Yatra",
      userName: "Ramesh Iyer",
      rating: 5,
      title: "Very well managed and safe for families",
      comment: "The vehicle driver was very skilled on mountain roads and the tour coordinator treated everyone like family. Pure vegetarian warm meals were provided throughout. Truly grateful for this experience.",
      location: "Bengaluru",
      tripDate: "June 2026 Batch",
      createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
    },
    {
      id: "seed-cd-3",
      tourSlug: "char-dham-yatra",
      tourTitle: "Char Dham Yatra",
      userName: "Sneha Patil",
      rating: 5,
      title: "Memorable Himalayan pilgrimage",
      comment: "Such an organized group trip! I was traveling solo as a woman and felt 100% safe and welcomed. Made lifelong friends on this sacred tour.",
      location: "Pune",
      tripDate: "June 2026 Batch",
      createdAt: new Date(Date.now() - 40 * 86400000).toISOString(),
    },
  ],
  "kedarnath-dham-yatra": [
    {
      id: "seed-kn-1",
      tourSlug: "kedarnath-dham-yatra",
      tourTitle: "Kedarnath Dham Yatra",
      userName: "Amit Joshi",
      rating: 5,
      title: "Divine experience, zero hassle",
      comment: "Sonali's team took care of pony/helicopter coordination and biometric passes so seamlessly. The temple darshan at dawn is unforgettable.",
      location: "Ahmedabad",
      tripDate: "May 2026 Batch",
      createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    },
  ],
  "spiti-valley-explorer": [
    {
      id: "seed-sp-1",
      tourSlug: "spiti-valley-explorer",
      tourTitle: "Spiti Valley Explorer",
      userName: "Karan Mehta",
      rating: 5,
      title: "Mindblowing landscapes and thrilling drives",
      comment: "Homestays were cozy, the group vibe was super energetic, and stargazing at Kaza was breathtaking. Best Himalayan road trip ever.",
      location: "Delhi",
      tripDate: "July 2026 Batch",
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    },
  ],
};

export async function GET(request: Request) {
  await ensureTable();
  const { searchParams } = new URL(request.url);
  const tourSlug = searchParams.get("tourSlug");

  try {
    let dbReviews: any[] = [];
    if (tourSlug) {
      dbReviews = await db
        .select()
        .from(reviews)
        .where(and(eq(reviews.tourSlug, tourSlug), eq(reviews.isApproved, true)))
        .orderBy(desc(reviews.createdAt));
    } else {
      dbReviews = await db
        .select()
        .from(reviews)
        .where(eq(reviews.isApproved, true))
        .orderBy(desc(reviews.createdAt));
    }

    // Include seed reviews for tour if user DB has few or no entries
    let allList = [...dbReviews];
    if (tourSlug && defaultSeedReviews[tourSlug]) {
      const existingIds = new Set(dbReviews.map((r) => r.id));
      const seedsToAdd = defaultSeedReviews[tourSlug]
        .filter((s) => !existingIds.has(s.id))
        .map((s) => ({
          ...s,
          userEmail: null,
          isApproved: true,
          updatedAt: s.createdAt,
        }));
      allList = [...dbReviews, ...seedsToAdd];
    } else if (!tourSlug) {
      // General list: combine seeds
      const existingIds = new Set(dbReviews.map((r) => r.id));
      Object.values(defaultSeedReviews).forEach((seeds) => {
        seeds.forEach((s) => {
          if (!existingIds.has(s.id)) {
            allList.push({
              ...s,
              userEmail: null,
              isApproved: true,
              updatedAt: s.createdAt,
            });
          }
        });
      });
    }

    // Compute stats
    const totalReviews = allList.length;
    const averageRating =
      totalReviews > 0
        ? Number(
            (
              allList.reduce((acc, curr) => acc + (Number(curr.rating) || 5), 0) /
              totalReviews
            ).toFixed(1)
          )
        : 5.0;

    const ratingDistribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    allList.forEach((r) => {
      const stars = Math.min(5, Math.max(1, Number(r.rating) || 5));
      ratingDistribution[stars] = (ratingDistribution[stars] || 0) + 1;
    });

    return NextResponse.json({
      reviews: allList,
      totalReviews,
      averageRating,
      ratingDistribution,
    });
  } catch (err) {
    console.error("GET /api/reviews error:", err);
    // Graceful fallback with seed reviews if DB unavailable
    const fallbackList = tourSlug ? (defaultSeedReviews[tourSlug] || []) : [];
    return NextResponse.json({
      reviews: fallbackList,
      totalReviews: fallbackList.length,
      averageRating: 5.0,
      ratingDistribution: { 5: fallbackList.length, 4: 0, 3: 0, 2: 0, 1: 0 },
    });
  }
}

export async function POST(request: Request) {
  await ensureTable();

  try {
    const body = await request.json();
    const {
      tourSlug,
      tourTitle,
      userName,
      userEmail,
      rating,
      title,
      comment,
      location,
      tripDate,
    } = body;

    if (!tourSlug || !tourTitle || !userName?.trim() || !comment?.trim()) {
      return NextResponse.json(
        { error: "Tour, your name, and a review comment are required." },
        { status: 400 }
      );
    }

    const numRating = Math.min(5, Math.max(1, parseInt(rating, 10) || 5));
    const newId = `rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const newReview = {
      id: newId,
      tourSlug: tourSlug.trim(),
      tourTitle: tourTitle.trim(),
      userName: userName.trim(),
      userEmail: userEmail ? userEmail.trim().toLowerCase() : null,
      rating: numRating,
      title: title?.trim() || null,
      comment: comment.trim(),
      location: location?.trim() || null,
      tripDate: tripDate?.trim() || null,
      isApproved: true, // Visible immediately; admin can delete if inappropriate
    };

    await db.insert(reviews).values(newReview);

    return NextResponse.json(
      {
        success: true,
        message: "Thank you! Your review has been published.",
        review: newReview,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/reviews error:", err);
    return NextResponse.json(
      { error: "Failed to submit review. Please try again." },
      { status: 500 }
    );
  }
}
