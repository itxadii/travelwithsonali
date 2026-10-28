import { cookies } from "next/headers";
import { db } from "@/db";
import { customers, customerSessions, customerPasswordResets, customerEmailVerifications } from "@/db/schema";
import { eq, and, gt, or, sql, desc } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { createHash, randomInt, randomUUID, timingSafeEqual } from "node:crypto";
import { sendEmailVerificationEmail, sendPasswordResetEmail } from "@/lib/mailer";

const CUSTOMER_COOKIE_NAME = "customer_session";

export interface CustomerSession {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  status: string;
}

/**
 * Normalizes phone numbers by stripping non-digits and extracting the standard 10-digit number.
 * Supports: +91 98765 43210, 9876543210, 09876543210, +91-98765-43210
 */
export function normalizePhoneNumber(input: string): string {
  if (!input) return "";
  const digits = input.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    return digits.slice(2);
  }
  if (digits.length === 11 && digits.startsWith("0")) {
    return digits.slice(1);
  }
  if (digits.length >= 10) {
    return digits.slice(-10);
  }
  return digits;
}

/**
 * Canonical form of a login identifier (lowercased email, or 10-digit phone) for rate-limit keys.
 */
export function normalizeIdentifier(identifier: string): string {
  const clean = identifier.trim().toLowerCase();
  return clean.includes("@") ? clean : normalizePhoneNumber(clean);
}

/**
 * Find customer by email or phone number with resilient normalization.
 */
export async function findCustomerByIdentifier(identifier: string) {
  const clean = identifier.trim().toLowerCase();
  const digits = normalizePhoneNumber(clean);

  // If it's an email (has @)
  if (clean.includes("@")) {
    const list = await db
      .select()
      .from(customers)
      // Case-insensitive: accounts created from the admin panel may store mixed-case emails
      .where(sql`LOWER(TRIM(${customers.email})) = ${clean}`);
    return list[0] || null;
  }

  // Otherwise, match by phone with multiple normalization checks
  const list = await db
    .select()
    .from(customers)
    .where(
      or(
        eq(customers.phone, clean),
        digits.length >= 10
          ? sql`regexp_replace(${customers.phone}, '[^0-9]', '', 'g') LIKE ${`%${digits}`}`
          : sql`FALSE`
      )
    );

  return list[0] || null;
}

const INVALID_LOGIN_MESSAGE =
  "Invalid email/phone or password. Never set a password? Use Forgot Password to create one.";

export async function loginCustomer(
  loginIdentifier: string,
  password: string
): Promise<{ success: boolean; error?: string; token?: string; expiresAt?: Date; reason?: "unverified"; email?: string }> {
  try {
    const customer = await findCustomerByIdentifier(loginIdentifier);

    // Customers created by admin (no password yet) must set one via the emailed reset flow.
    if (!customer || !customer.passwordHash) {
      return { success: false, error: INVALID_LOGIN_MESSAGE };
    }

    const isValid = await bcrypt.compare(password, customer.passwordHash);
    if (!isValid) {
      return { success: false, error: INVALID_LOGIN_MESSAGE };
    }

    // Correct password but email not confirmed yet: send a fresh code and ask for it
    if (!customer.emailVerified && customer.email) {
      await sendEmailVerificationCode(customer);
      return {
        success: false,
        reason: "unverified",
        email: customer.email,
        error: "Confirm your email to finish signing in. We've sent you a new 6-digit code.",
      };
    }

    const { token, expiresAt } = await createCustomerSession(customer.id);
    return { success: true, token, expiresAt };
  } catch (err) {
    console.error("Customer Login Error:", err);
    return { success: false, error: "An unexpected error occurred during sign in." };
  }
}

/**
 * Creates a session row and sets the session cookie (when called inside a request).
 */
async function createCustomerSession(customerId: string): Promise<{ token: string; expiresAt: Date }> {
  const token = randomUUID();
  const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days

  await db.insert(customerSessions).values({
    id: randomUUID(),
    customerId,
    token,
    expiresAt,
  });

  try {
    const cookieStore = await cookies();
    cookieStore.set(CUSTOMER_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });
  } catch (cookieErr) {
    console.warn("Could not set cookie (outside request context):", cookieErr);
  }

  return { token, expiresAt };
}

const RESET_TTL_MS = 60 * 60 * 1000; // 1 hour
const MAX_RESET_CODE_ATTEMPTS = 5;

function hashSecret(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function secretsMatch(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

/**
 * Generate a password reset token & 6-digit code and email them to the customer.
 * Reports clearly when no account matches or the account has no email, so the
 * visitor knows what to do next; the endpoint's rate limits slow down account scanning.
 */
export async function requestPasswordReset(
  identifier: string,
  siteUrl: string
): Promise<{ success: boolean; error?: string; reason?: "not_found" | "no_email" }> {
  try {
    const customer = await findCustomerByIdentifier(identifier);

    // Tell the visitor plainly instead of pretending a code was sent.
    // (Rate limits on the endpoint keep this from being used to scan for accounts.)
    if (!customer) {
      return {
        success: false,
        reason: "not_found",
        error: "No account exists with that email or mobile number. Check it, or create a new account.",
      };
    }
    if (!customer.email) {
      return {
        success: false,
        reason: "no_email",
        error: "This account has no email address, so we can't send a code. Message us on WhatsApp and we'll help you reset it.",
      };
    }

    // Only the most recent reset request stays valid
    await db
      .update(customerPasswordResets)
      .set({ used: true })
      .where(and(eq(customerPasswordResets.customerId, customer.id), eq(customerPasswordResets.used, false)));

    const token = randomUUID();
    const code = randomInt(100000, 1000000).toString();

    await db.insert(customerPasswordResets).values({
      id: randomUUID(),
      customerId: customer.id,
      token: hashSecret(token),
      code: hashSecret(code),
      expiresAt: new Date(Date.now() + RESET_TTL_MS),
      used: false,
    });

    const resetLink = `${siteUrl}/portal/reset-password?token=${encodeURIComponent(token)}`;
    await sendPasswordResetEmail(customer.email, customer.name, code, resetLink);

    return { success: true };
  } catch (err) {
    console.error("requestPasswordReset error:", err);
    return { success: false, error: "We couldn't send the reset email right now. Please try again later." };
  }
}

/**
 * Verify a reset link token, or a 6-digit code for a specific customer, and set a new password.
 */
export async function resetCustomerPassword(
  credentials: { token?: string; code?: string; identifier?: string },
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  const invalid = {
    success: false,
    error: "Invalid or expired reset code / link. Please request a new one.",
  };

  try {
    if (!newPassword || newPassword.length < 8) {
      return { success: false, error: "Password must be at least 8 characters long." };
    }

    let reset: typeof customerPasswordResets.$inferSelect | undefined;

    if (credentials.token) {
      reset = (
        await db
          .select()
          .from(customerPasswordResets)
          .where(
            and(
              eq(customerPasswordResets.token, hashSecret(credentials.token.trim())),
              eq(customerPasswordResets.used, false),
              gt(customerPasswordResets.expiresAt, new Date())
            )
          )
      )[0];
      if (!reset) return invalid;
    } else if (credentials.code && credentials.identifier) {
      const customer = await findCustomerByIdentifier(credentials.identifier);
      if (!customer) return invalid;

      reset = (
        await db
          .select()
          .from(customerPasswordResets)
          .where(
            and(
              eq(customerPasswordResets.customerId, customer.id),
              eq(customerPasswordResets.used, false),
              gt(customerPasswordResets.expiresAt, new Date())
            )
          )
          .orderBy(desc(customerPasswordResets.createdAt))
          .limit(1)
      )[0];
      if (!reset) return invalid;

      if (!secretsMatch(hashSecret(credentials.code.trim()), reset.code)) {
        const attempts = reset.attempts + 1;
        await db
          .update(customerPasswordResets)
          .set({ attempts, used: attempts >= MAX_RESET_CODE_ATTEMPTS })
          .where(eq(customerPasswordResets.id, reset.id));
        return invalid;
      }
    } else {
      return { success: false, error: "Please provide the reset link, or your email/phone and the 6-digit code." };
    }

    // Mark used first so the same code/link can't be replayed concurrently
    const claimed = await db
      .update(customerPasswordResets)
      .set({ used: true })
      .where(and(eq(customerPasswordResets.id, reset.id), eq(customerPasswordResets.used, false)))
      .returning({ id: customerPasswordResets.id });
    if (claimed.length === 0) return invalid;

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await db
      .update(customers)
      .set({
        passwordHash,
        // The code or link arrived by email, which proves the customer owns that address
        emailVerified: true,
        updatedAt: new Date(),
      })
      .where(eq(customers.id, reset.customerId));

    // Sign out every existing session, then log the customer in fresh
    await db.delete(customerSessions).where(eq(customerSessions.customerId, reset.customerId));
    await createCustomerSession(reset.customerId);

    return { success: true };
  } catch (err) {
    console.error("resetCustomerPassword error:", err);
    return { success: false, error: "Failed to reset password." };
  }
}

export async function getCurrentCustomer(): Promise<CustomerSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(CUSTOMER_COOKIE_NAME)?.value;

    if (!token) return null;

    const sessions = await db
      .select({
        sessionToken: customerSessions.token,
        id: customers.id,
        name: customers.name,
        phone: customers.phone,
        email: customers.email,
        status: customers.status,
      })
      .from(customerSessions)
      .innerJoin(customers, eq(customerSessions.customerId, customers.id))
      .where(and(eq(customerSessions.token, token), gt(customerSessions.expiresAt, new Date())));

    if (sessions.length === 0) return null;

    const session = sessions[0];
    return {
      id: session.id,
      name: session.name,
      phone: session.phone,
      email: session.email,
      status: session.status,
    };
  } catch (err) {
    console.error("getCurrentCustomer error:", err);
    return null;
  }
}

export async function logoutCustomer(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(CUSTOMER_COOKIE_NAME)?.value;

    if (token) {
      await db.delete(customerSessions).where(eq(customerSessions.token, token));
    }

    cookieStore.delete(CUSTOMER_COOKIE_NAME);
  } catch (err) {
    console.error("Logout customer error:", err);
  }
}

// ---------------------------------------------------------------------------
// Email verification for new accounts
// ---------------------------------------------------------------------------

const VERIFY_TTL_MS = 30 * 60 * 1000; // 30 minutes
const MAX_VERIFY_ATTEMPTS = 5;

/** Emails a new 6-digit code to the customer; any earlier unused code stops working. */
export async function sendEmailVerificationCode(customer: { id: string; name: string; email: string | null }) {
  if (!customer.email) throw new Error("Customer has no email address to verify.");

  await db
    .update(customerEmailVerifications)
    .set({ used: true })
    .where(and(eq(customerEmailVerifications.customerId, customer.id), eq(customerEmailVerifications.used, false)));

  const code = randomInt(100000, 1000000).toString();
  await db.insert(customerEmailVerifications).values({
    id: randomUUID(),
    customerId: customer.id,
    code: hashSecret(code),
    expiresAt: new Date(Date.now() + VERIFY_TTL_MS),
  });

  await sendEmailVerificationEmail(customer.email, customer.name, code);
}

/** Checks the emailed code; on success marks the email verified and signs the customer in. */
export async function verifyCustomerEmail(email: string, code: string): Promise<{ success: boolean; error?: string }> {
  const invalid = { success: false, error: "That code is wrong or has expired. Check the latest email, or send a new code." };
  try {
    const customer = await findCustomerByIdentifier(email);
    if (!customer || !customer.email) return invalid;
    if (customer.emailVerified) {
      return { success: false, error: "This email is already confirmed. Sign in with your password." };
    }

    const pending = (
      await db
        .select()
        .from(customerEmailVerifications)
        .where(
          and(
            eq(customerEmailVerifications.customerId, customer.id),
            eq(customerEmailVerifications.used, false),
            gt(customerEmailVerifications.expiresAt, new Date())
          )
        )
        .orderBy(desc(customerEmailVerifications.createdAt))
        .limit(1)
    )[0];
    if (!pending) return invalid;

    if (!secretsMatch(hashSecret(code.trim()), pending.code)) {
      const attempts = pending.attempts + 1;
      await db
        .update(customerEmailVerifications)
        .set({ attempts, used: attempts >= MAX_VERIFY_ATTEMPTS })
        .where(eq(customerEmailVerifications.id, pending.id));
      return invalid;
    }

    const claimed = await db
      .update(customerEmailVerifications)
      .set({ used: true })
      .where(and(eq(customerEmailVerifications.id, pending.id), eq(customerEmailVerifications.used, false)))
      .returning({ id: customerEmailVerifications.id });
    if (claimed.length === 0) return invalid;

    await db.update(customers).set({ emailVerified: true, updatedAt: new Date() }).where(eq(customers.id, customer.id));
    await createCustomerSession(customer.id);
    return { success: true };
  } catch (err) {
    console.error("verifyCustomerEmail error:", err);
    return { success: false, error: "Couldn't confirm your email right now. Please try again." };
  }
}
