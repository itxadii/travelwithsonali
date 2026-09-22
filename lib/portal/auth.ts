import { cookies } from "next/headers";
import { db } from "@/db";
import { customers, customerSessions, customerPasswordResets } from "@/db/schema";
import { eq, and, gt, or, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";

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
      .where(eq(customers.email, clean));
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

export async function loginCustomer(
  loginIdentifier: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const customer = await findCustomerByIdentifier(loginIdentifier);

    if (!customer) {
      return { success: false, error: "Invalid credentials. Please check your email or mobile number." };
    }

    // Default password check if no passwordHash set yet: allow demo login with 'Customer123!' or customer phone
    if (!customer.passwordHash) {
      const defaultPass = "Customer123!";
      const digits = normalizePhoneNumber(loginIdentifier);
      const custPhoneDigits = normalizePhoneNumber(customer.phone);
      if (password !== defaultPass && password !== customer.phone && password !== custPhoneDigits) {
        return { success: false, error: "Invalid password. Default access password is Customer123!" };
      }
    } else {
      const isValid = await bcrypt.compare(password, customer.passwordHash);
      if (!isValid) {
        return { success: false, error: "Invalid email/phone or password." };
      }
    }

    // Create session token
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days

    await db.insert(customerSessions).values({
      id: crypto.randomUUID(),
      customerId: customer.id,
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

    return { success: true };
  } catch (err) {
    console.error("Customer Login Error:", err);
    return { success: false, error: "An unexpected error occurred during sign in." };
  }
}

/**
 * Generate a password reset token & 6-digit code for a customer.
 */
export async function requestPasswordReset(
  identifier: string
): Promise<{ success: boolean; error?: string; message?: string; code?: string; token?: string }> {
  try {
    const customer = await findCustomerByIdentifier(identifier);

    if (!customer) {
      return {
        success: false,
        error: "No account found with that email or mobile number.",
      };
    }

    // Generate token and 6-digit code
    const token = crypto.randomUUID();
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // e.g. 748291
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await db.insert(customerPasswordResets).values({
      id: crypto.randomUUID(),
      customerId: customer.id,
      token,
      code,
      expiresAt,
      used: false,
    });

    return {
      success: true,
      message: "Reset code generated successfully.",
      code,
      token,
    };
  } catch (err) {
    console.error("requestPasswordReset error:", err);
    return { success: false, error: "Failed to generate password reset request." };
  }
}

/**
 * Verify reset token or 6-digit code and update the customer's password.
 */
export async function resetCustomerPassword(
  tokenOrCode: string,
  newPassword: string,
  identifier?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: "Password must be at least 6 characters long." };
    }

    const cleanInput = tokenOrCode.trim();

    // Look for valid reset record by token OR by 6-digit code
    let resets = await db
      .select({
        resetId: customerPasswordResets.id,
        customerId: customerPasswordResets.customerId,
        token: customerPasswordResets.token,
        code: customerPasswordResets.code,
        expiresAt: customerPasswordResets.expiresAt,
        used: customerPasswordResets.used,
      })
      .from(customerPasswordResets)
      .where(
        and(
          or(eq(customerPasswordResets.token, cleanInput), eq(customerPasswordResets.code, cleanInput)),
          eq(customerPasswordResets.used, false),
          gt(customerPasswordResets.expiresAt, new Date())
        )
      );

    // If matching by 6-digit code and identifier was provided, filter by that customer
    if (resets.length > 1 && identifier) {
      const customer = await findCustomerByIdentifier(identifier);
      if (customer) {
        resets = resets.filter((r) => r.customerId === customer.id);
      }
    }

    if (resets.length === 0) {
      return {
        success: false,
        error: "Invalid or expired reset code / token. Please request a new one.",
      };
    }

    const resetRecord = resets[0];

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update customer password
    await db
      .update(customers)
      .set({
        passwordHash,
        updatedAt: new Date(),
      })
      .where(eq(customers.id, resetRecord.customerId));

    // Mark reset token as used
    await db
      .update(customerPasswordResets)
      .set({ used: true })
      .where(eq(customerPasswordResets.id, resetRecord.resetId));

    // Auto log-in customer with new session
    const sessionToken = crypto.randomUUID();
    const sessionExpiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    await db.insert(customerSessions).values({
      id: crypto.randomUUID(),
      customerId: resetRecord.customerId,
      token: sessionToken,
      expiresAt: sessionExpiresAt,
    });

    try {
      const cookieStore = await cookies();
      cookieStore.set(CUSTOMER_COOKIE_NAME, sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: sessionExpiresAt,
        path: "/",
      });
    } catch (cookieErr) {
      console.warn("Could not set cookie (outside request context):", cookieErr);
    }

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
