import { createTablesIfNotExist } from "./initTables";
import { db } from "../db";
import { adminUsers } from "../db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

async function seedAdmin() {
  console.log("🌱 Seeding Neon PostgreSQL admin database...");

  // 1. DDL creation
  await createTablesIfNotExist();

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password || password.length < 12) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD (at least 12 characters) before running this script.");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  // Check existing admin
  const existingAdmin = await db.select().from(adminUsers).where(eq(adminUsers.email, email));

  if (existingAdmin.length === 0) {
    await db.insert(adminUsers).values({
      id: "admin-1",
      email,
      passwordHash,
      name: "Sonali Palekar",
      role: "SUPER_ADMIN",
    });
    console.log(`✅ Admin user created: ${email}`);
  } else {
    // Update password hash and name if exists
    await db.update(adminUsers).set({ passwordHash, name: "Sonali Palekar" }).where(eq(adminUsers.email, email));
    console.log(`✅ Admin user updated: ${email}`);
  }

  console.log("\n🎉 Database setup complete!");
}

seedAdmin().catch((err) => {
  console.error("❌ Seed error:", err);
  process.exit(1);
});
