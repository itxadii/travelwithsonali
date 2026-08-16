import { cookies } from "next/headers";
import { db } from "@/db";
import { customers, customerSessions } from "@/db/schema";
import { eq, and, gt, or } from "drizzle-orm";
import bcrypt from "bcryptjs";

const CUSTOMER_COOKIE_NAME = "customer_session";

export interface CustomerSession {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  status: string;
}

export async function loginCustomer(
  loginIdentifier: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const cleanIdentifier = loginIdentifier.trim().toLowerCase();

    // Query customer by email or phone
    const customerList = await db
      .select()
      .from(customers)
      .where(or(eq(customers.email, cleanIdentifier), eq(customers.phone, cleanIdentifier)));

    if (customerList.length === 0) {
      return { success: false, error: "Invalid credentials. Please check your email/phone and password." };
    }

    const customer = customerList[0];

    // Default password check if no passwordHash set yet: allow demo login with 'Customer123!' or customer phone
    if (!customer.passwordHash) {
      const defaultPass = "Customer123!";
      if (password !== defaultPass && password !== customer.phone) {
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

    const cookieStore = await cookies();
    cookieStore.set(CUSTOMER_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });

    return { success: true };
  } catch (err) {
    console.error("Customer Login Error:", err);
    return { success: false, error: "An unexpected error occurred during sign in." };
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
