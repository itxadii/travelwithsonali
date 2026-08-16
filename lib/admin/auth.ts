import { cookies } from "next/headers";
import { db } from "@/db";
import { adminUsers, adminSessions } from "@/db/schema";
import { eq, and, gt } from "drizzle-orm";
import bcrypt from "bcryptjs";

const SESSION_COOKIE_NAME = "admin_session";

export interface AdminUserSession {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function loginAdmin(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const users = await db.select().from(adminUsers).where(eq(adminUsers.email, email.trim().toLowerCase()));
    if (users.length === 0) {
      return { success: false, error: "Invalid email or password." };
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return { success: false, error: "Invalid email or password." };
    }

    // Create session token
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await db.insert(adminSessions).values({
      id: crypto.randomUUID(),
      userId: user.id,
      token,
      expiresAt,
    });

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });

    return { success: true };
  } catch (err) {
    console.error("Login error:", err);
    return { success: false, error: "An unexpected error occurred during sign in." };
  }
}

export async function getCurrentAdmin(): Promise<AdminUserSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) return null;

    const sessions = await db
      .select({
        sessionToken: adminSessions.token,
        userId: adminUsers.id,
        email: adminUsers.email,
        name: adminUsers.name,
        role: adminUsers.role,
      })
      .from(adminSessions)
      .innerJoin(adminUsers, eq(adminSessions.userId, adminUsers.id))
      .where(and(eq(adminSessions.token, token), gt(adminSessions.expiresAt, new Date())));

    if (sessions.length === 0) return null;

    const session = sessions[0];
    return {
      id: session.userId,
      email: session.email,
      name: session.name,
      role: session.role,
    };
  } catch (err) {
    console.error("getCurrentAdmin error:", err);
    return null;
  }
}

export async function logoutAdmin(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (token) {
      await db.delete(adminSessions).where(eq(adminSessions.token, token));
    }

    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch (err) {
    console.error("Logout error:", err);
  }
}
