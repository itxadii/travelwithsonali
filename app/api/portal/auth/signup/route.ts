import { NextResponse } from "next/server";
import { db } from "@/db";
import { customers, customerSessions } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { findCustomerByIdentifier } from "@/lib/portal/auth";

const CUSTOMER_COOKIE_NAME = "customer_session";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, email, password } = body;

    if (!name || !phone || !password) {
      return NextResponse.json({ error: "Full name, phone number, and password are required." }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long." }, { status: 400 });
    }

    const cleanPhone = phone.trim();
    const cleanEmail = email ? email.trim().toLowerCase() : null;

    // Check if customer already exists by phone or email (using resilient normalization)
    const existingCustomer =
      (await findCustomerByIdentifier(cleanPhone)) ||
      (cleanEmail ? await findCustomerByIdentifier(cleanEmail) : null);

    let customerId = "";

    const passwordHash = await bcrypt.hash(password, 10);

    if (existingCustomer) {
      const cust = existingCustomer;
      customerId = cust.id;

      // If user already has a password set, instruct them to log in instead
      if (cust.passwordHash) {
        return NextResponse.json(
          { error: "An account with this phone/email already exists. Please sign in instead." },
          { status: 400 }
        );
      }

      // If existing customer record was created by admin (e.g. from lead), activate their password!
      await db
        .update(customers)
        .set({
          name: name.trim(),
          email: cleanEmail || cust.email,
          passwordHash,
          updatedAt: new Date(),
        })
        .where(eq(customers.id, cust.id));
    } else {
      // Create new customer record
      customerId = `cust-${Date.now()}`;
      await db.insert(customers).values({
        id: customerId,
        name: name.trim(),
        phone: cleanPhone,
        email: cleanEmail,
        passwordHash,
        status: "Active",
      });
    }

    // Auto log-in customer and issue session token
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days

    await db.insert(customerSessions).values({
      id: crypto.randomUUID(),
      customerId,
      token,
      expiresAt,
    });

    const cookieStore = await cookies();
    cookieStore.set(CUSTOMER_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });

    return NextResponse.json({ success: true, message: "Account created successfully!" });
  } catch (err) {
    console.error("POST /api/portal/auth/signup error:", err);
    return NextResponse.json({ error: "Failed to create customer account." }, { status: 500 });
  }
}
