import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from "../db";
import { customers, bookings, travellers, payments } from "../db/schema";
import { eq } from "drizzle-orm";
import { normalizePhoneNumber } from "../lib/portal/auth";

async function mergeDuplicates() {
  console.log("Analyzing customer database for duplicate profiles...");
  const allCusts = await db.select().from(customers);

  // Group by normalized phone
  const phoneMap = new Map<string, typeof allCusts>();

  for (const c of allCusts) {
    const norm = normalizePhoneNumber(c.phone) || c.phone;
    if (!phoneMap.has(norm)) {
      phoneMap.set(norm, []);
    }
    phoneMap.get(norm)!.push(c);
  }

  for (const [phone, list] of phoneMap.entries()) {
    if (list.length > 1) {
      console.log(`\nFound duplicate customer group for phone ${phone}:`);
      list.forEach((c) => console.log(`  - ID: ${c.id}, Name: ${c.name}, HasPassword: ${Boolean(c.passwordHash)}`));

      // Choose primary: the one with passwordHash, or the earliest one
      const primary = list.find((c) => c.passwordHash) || list[0];
      const duplicates = list.filter((c) => c.id !== primary.id);

      console.log(`  ⭐ Primary Account chosen: ${primary.id} (${primary.name})`);

      for (const dup of duplicates) {
        console.log(`  Reassigning bookings from duplicate ${dup.id} -> ${primary.id}...`);
        await db
          .update(bookings)
          .set({ customerId: primary.id })
          .where(eq(bookings.customerId, dup.id));

        console.log(`  Reassigning travellers from duplicate ${dup.id} -> ${primary.id}...`);
        await db
          .update(travellers)
          .set({ customerId: primary.id })
          .where(eq(travellers.customerId, dup.id));

        console.log(`  Deleting duplicate customer row ${dup.id}...`);
        await db.delete(customers).where(eq(customers.id, dup.id));
      }
    }
  }

  console.log("\n✅ Duplicate resolution complete!");
  process.exit(0);
}

mergeDuplicates().catch((err) => {
  console.error("Merge error:", err);
  process.exit(1);
});
