import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { db } from "../db";
import { adminUsers, adminSessions } from "../db/schema";
import { eq } from "drizzle-orm";

/**
 * Changes the admin account's email (where sign-in codes are sent).
 *   npm run admin:email -- new@example.com                       (when there is one admin)
 *   npm run admin:email -- new@example.com --from old@example.com (pick which admin to change)
 */
async function main() {
  const args = process.argv.slice(2);
  const newEmail = (args.find((a) => !a.startsWith("--")) || "").trim().toLowerCase();
  const fromIndex = args.indexOf("--from");
  const fromEmail = fromIndex >= 0 ? (args[fromIndex + 1] || "").trim().toLowerCase() : "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
    throw new Error("Pass the new email address, e.g. npm run admin:email -- travelwithsonaliinfo@gmail.com");
  }

  const admins = await db.select().from(adminUsers);
  const target = fromEmail ? admins.find((a) => a.email.toLowerCase() === fromEmail) : admins.length === 1 ? admins[0] : undefined;

  if (!target) {
    if (admins.length === 0) throw new Error("No admin user exists yet. Run `npm run seed:admin` first.");
    throw new Error(`Several admins exist; choose one with --from <email>. Admins: ${admins.map((a) => a.email).join(", ")}`);
  }
  if (target.email.toLowerCase() === newEmail) {
    console.log(`ℹ️ Admin email is already ${newEmail}.`);
    return;
  }
  if (admins.some((a) => a.email.toLowerCase() === newEmail)) {
    throw new Error(`Another admin already uses ${newEmail}.`);
  }

  await db.update(adminUsers).set({ email: newEmail, updatedAt: new Date() }).where(eq(adminUsers.id, target.id));
  // Sign out every device so the next sign-in proves access to the new inbox
  await db.delete(adminSessions).where(eq(adminSessions.userId, target.id));

  console.log(`✅ Admin email changed: ${target.email} → ${newEmail}. Sign in again with the new email.`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed:", err instanceof Error ? err.message : err);
    process.exit(1);
  });
