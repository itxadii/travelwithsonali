import { db } from "../db";
import { adminUsers, customers, customerSessions } from "../db/schema";
import bcrypt from "bcryptjs";
import { eq, isNotNull } from "drizzle-orm";

// Old demo/default passwords that were seeded or accepted by earlier versions of the app
const DEFAULT_CUSTOMER_PASSWORD = "Customer123!";
const DEFAULT_ADMIN_PASSWORD = "SonaliAdmin2026!";

/**
 * Removes the old default password from every customer still using it (they can set a new one
 * through Forgot Password) and signs them out. Warns about admins still on the default password.
 */
async function clearDefaultPasswords() {
  const custs = await db.select().from(customers).where(isNotNull(customers.passwordHash));
  let cleared = 0;

  for (const c of custs) {
    if (c.passwordHash && (await bcrypt.compare(DEFAULT_CUSTOMER_PASSWORD, c.passwordHash))) {
      await db.update(customers).set({ passwordHash: null, updatedAt: new Date() }).where(eq(customers.id, c.id));
      await db.delete(customerSessions).where(eq(customerSessions.customerId, c.id));
      console.log(`🔒 Cleared default password for ${c.name} (${c.email || c.phone})`);
      cleared++;
    }
  }
  console.log(`✅ Checked ${custs.length} customers, cleared ${cleared}.`);

  const admins = await db.select().from(adminUsers);
  for (const a of admins) {
    if (await bcrypt.compare(DEFAULT_ADMIN_PASSWORD, a.passwordHash)) {
      console.warn(`⚠️ Admin ${a.email} still uses the old default password. Change it in Admin → Settings now.`);
    }
  }
}

clearDefaultPasswords()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed:", err);
    process.exit(1);
  });
