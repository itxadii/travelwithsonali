import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from "../db";
import { customers, bookings, customerSessions } from "../db/schema";
import { eq, or, ilike } from "drizzle-orm";

async function check() {
  console.log("Searching for customers...");
  const custs = await db
    .select()
    .from(customers)
    .where(or(ilike(customers.name, "%Aditya%"), eq(customers.phone, "9529602759")));
  console.log("CUSTOMERS FOUND:", JSON.stringify(custs, null, 2));

  console.log("\nSearching for booking TWS-2026-840...");
  const books = await db
    .select()
    .from(bookings)
    .where(eq(bookings.bookingCode, "TWS-2026-840"));
  console.log("BOOKINGS FOUND:", JSON.stringify(books, null, 2));

  console.log("\nSearching for active sessions...");
  const sessions = await db.select().from(customerSessions);
  console.log("SESSIONS FOUND:", JSON.stringify(sessions, null, 2));

  process.exit(0);
}

check().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
