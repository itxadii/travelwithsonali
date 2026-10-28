import { NextResponse } from "next/server";
import { db } from "@/db";
import { customers, customerSessions } from "@/db/schema";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { findCustomerByIdentifier } from "@/lib/portal/auth";
import { checkRateLimits, getClientIp, tooManyRequests } from "@/lib/rateLimit";

const CUSTOMER_COOKIE_NAME = "customer_session";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, email, password } = body;

    // Email is required: password reset codes can only be sent by email
    if (!name || !phone || !email || !password) {
      return NextResponse.json({ error: "Full name, mobile number, email and password are required." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())) {
      return NextResponse.json({ error: "Enter a valid email address, like name@gmail.com." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long." }, { status: 400 });
    }

    const rate = await checkRateLimits([
      { key: ["signup:ip", getClientIp(req)], limit: 10, windowSeconds: 60 * 60 },
    ]);
    if (!rate.allowed) return tooManyRequests(rate.retryAfterSeconds);

    const cleanPhone = phone.trim();
    const cleanEmail = email ? email.trim().toLowerCase() : null;

    // Check if customer already exists by phone or email (using resilient normalization)
    const existingCustomer =
      (await findCustomerByIdentifier(cleanPhone)) ||
      (cleanEmail ? await findCustomerByIdentifier(cleanEmail) : null);

    // Existing records (including ones created by admin without a password) can only be
    // claimed through the emailed password reset, which proves ownership of the email.
    if (existingCustomer) {
      return NextResponse.json(
        {
          error:
            "An account with this phone/email already exists. Please sign in, or use Forgot Password to set your password.",
        },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const customerId = `cust-${crypto.randomUUID()}`;
    await db.insert(customers).values({
      id: customerId,
      name: name.trim(),
      phone: cleanPhone,
      email: cleanEmail,
      passwordHash,
      status: "Active",
    });

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
