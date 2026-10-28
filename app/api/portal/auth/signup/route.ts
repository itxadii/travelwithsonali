import { NextResponse } from "next/server";
import { db } from "@/db";
import { customers } from "@/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { findCustomerByIdentifier, sendEmailVerificationCode } from "@/lib/portal/auth";
import { checkRateLimits, getClientIp, tooManyRequests } from "@/lib/rateLimit";

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
    const existingByEmail = cleanEmail ? await findCustomerByIdentifier(cleanEmail) : null;
    const existingCustomer = existingByEmail || (await findCustomerByIdentifier(cleanPhone));

    // Someone who signed up but never entered their code: send a fresh code instead of failing
    if (existingByEmail && existingByEmail.passwordHash && !existingByEmail.emailVerified) {
      try {
        await sendEmailVerificationCode(existingByEmail);
      } catch (mailErr) {
        console.error("Signup resend verification error:", mailErr);
        return NextResponse.json({ error: "We couldn't send the verification email. Please try again shortly." }, { status: 502 });
      }
      return NextResponse.json({ success: true, needsVerification: true, email: cleanEmail });
    }

    // Existing records (including ones created by admin without a password) can only be
    // claimed through the emailed password reset, which proves ownership of the email.
    if (existingCustomer) {
      return NextResponse.json(
        {
          error:
            "An account with this mobile number or email already exists. Sign in, or use Forgot password to set your password.",
        },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const customerId = `cust-${crypto.randomUUID()}`;
    const customer = { id: customerId, name: name.trim(), email: cleanEmail };
    await db.insert(customers).values({
      ...customer,
      phone: cleanPhone,
      passwordHash,
      emailVerified: false,
      status: "Active",
    });

    // No session yet: the account becomes usable once the emailed code is entered
    try {
      await sendEmailVerificationCode(customer);
    } catch (mailErr) {
      console.error("Signup verification email error:", mailErr);
      // Remove the half-created account so the person can simply try again
      await db.delete(customers).where(eq(customers.id, customerId));
      return NextResponse.json({ error: "We couldn't send the verification email. Please try again shortly." }, { status: 502 });
    }

    return NextResponse.json({ success: true, needsVerification: true, email: cleanEmail });
  } catch (err) {
    console.error("POST /api/portal/auth/signup error:", err);
    return NextResponse.json({ error: "Failed to create customer account." }, { status: 500 });
  }
}
