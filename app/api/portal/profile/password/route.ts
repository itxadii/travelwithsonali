import { NextResponse } from "next/server";
import { getCurrentCustomer } from "@/lib/portal/auth";
import { db } from "@/db";
import { customers } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const customerSession = await getCurrentCustomer();
    if (!customerSession) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Current password and new password are required." }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "New password must be at least 6 characters long." }, { status: 400 });
    }

    const currentCustomerRecord = (
      await db.select().from(customers).where(eq(customers.id, customerSession.id))
    )[0];

    if (!currentCustomerRecord) {
      return NextResponse.json({ error: "Customer profile not found." }, { status: 404 });
    }

    if (currentCustomerRecord.passwordHash) {
      const isValid = await bcrypt.compare(currentPassword, currentCustomerRecord.passwordHash);
      if (!isValid) {
        return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
      }
    } else {
      // Default initial password check
      if (currentPassword !== "Customer123!" && currentPassword !== currentCustomerRecord.phone) {
        return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
      }
    }

    const newHash = await bcrypt.hash(newPassword, 10);

    await db
      .update(customers)
      .set({
        passwordHash: newHash,
        updatedAt: new Date(),
      })
      .where(eq(customers.id, customerSession.id));

    return NextResponse.json({ success: true, message: "Password updated successfully!" });
  } catch (err) {
    console.error("POST /api/portal/profile/password error:", err);
    return NextResponse.json({ error: "Failed to update password." }, { status: 500 });
  }
}
