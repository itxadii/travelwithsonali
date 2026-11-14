import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { adminUsers, adminSessions, adminLoginCodes, activityLogs } from "@/db/schema";
import { eq, and, gt, lt, ne, desc } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { createHash, randomInt, randomUUID, timingSafeEqual } from "node:crypto";
import { sendAdminLoginCodeEmail } from "@/lib/mailer";
import { describeDevice } from "@/lib/admin/device";

export const ADMIN_SESSION_COOKIE = "admin_session";
/** Short-lived cookie that links the password step to the emailed-code step */
export const ADMIN_CHALLENGE_COOKIE = "admin_login_challenge";
export const ADMIN_CHALLENGE_COOKIE_PATH = "/api/admin/auth";

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const CHALLENGE_TTL_MS = 10 * 60 * 1000; // 10 minutes to enter the emailed code
const MAX_CODE_ATTEMPTS = 5;
const LAST_SEEN_REFRESH_MS = 5 * 60 * 1000;

export interface AdminUserSession {
  id: string;
  email: string;
  name: string;
  role: string;
  sessionId: string;
}

export interface RequestMeta {
  ip: string;
  userAgent: string;
}

function hashSecret(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function secretsMatch(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

/** Masks an address for display: "tr•••••@gmail.com" */
export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  return `${local.slice(0, 2)}${"•".repeat(Math.max(3, local.length - 2))}@${domain}`;
}

// A real bcrypt hash to compare against when the email is unknown, so a wrong email takes
// as long as a wrong password and can't be told apart by timing.
let dummyHashPromise: Promise<string> | undefined;
function dummyHash(): Promise<string> {
  dummyHashPromise ??= bcrypt.hash(randomUUID(), 10);
  return dummyHashPromise;
}

const INVALID = { success: false as const, error: "Invalid email or password." };

/**
 * Step 1 of admin sign-in: checks the password, then emails a 6-digit code to the admin's
 * address. Returns a challenge token for the caller to store in a short-lived cookie.
 */
export async function beginAdminLogin(
  email: string,
  password: string,
  meta: RequestMeta
): Promise<{ success: boolean; error?: string; reason?: "mail"; challenge?: string; emailHint?: string }> {
  try {
    const clean = email.trim().toLowerCase();
    const user = (await db.select().from(adminUsers).where(eq(adminUsers.email, clean)))[0];
    const ok = await bcrypt.compare(password, user ? user.passwordHash : await dummyHash());
    if (!user || !ok || user.invitePending) return INVALID;

    return await issueLoginCode(user, meta);
  } catch (err) {
    console.error("beginAdminLogin error:", err);
    return { success: false, error: "An unexpected error occurred during sign in." };
  }
}

async function issueLoginCode(user: typeof adminUsers.$inferSelect, meta: RequestMeta) {
  // Only the newest code for this admin stays valid
  await db
    .update(adminLoginCodes)
    .set({ used: true })
    .where(and(eq(adminLoginCodes.userId, user.id), eq(adminLoginCodes.used, false)));

  const challenge = randomUUID();
  const code = randomInt(100000, 1000000).toString();
  const rowId = randomUUID();

  await db.insert(adminLoginCodes).values({
    id: rowId,
    userId: user.id,
    challenge: hashSecret(challenge),
    code: hashSecret(code),
    expiresAt: new Date(Date.now() + CHALLENGE_TTL_MS),
    ip: meta.ip,
    userAgent: meta.userAgent.slice(0, 500),
  });

  try {
    await sendAdminLoginCodeEmail(user.email, user.name, code, { device: describeDevice(meta.userAgent), ip: meta.ip });
  } catch (mailErr) {
    console.error("Admin login code email failed:", mailErr);
    await db.delete(adminLoginCodes).where(eq(adminLoginCodes.id, rowId));
    return {
      success: false,
      reason: "mail" as const,
      error: "We couldn't email your sign-in code. Check the mail settings and try again.",
    };
  }

  return { success: true, challenge, emailHint: maskEmail(user.email) };
}

/** Sends a fresh code for an in-progress sign-in (the old challenge stops working). */
export async function resendAdminLoginCode(
  challenge: string,
  meta: RequestMeta
): Promise<{ success: boolean; error?: string; challenge?: string; emailHint?: string }> {
  try {
    const pending = await findPendingChallenge(challenge);
    if (!pending) return { success: false, error: "Your sign-in attempt expired. Start again from the login page." };
    const user = (await db.select().from(adminUsers).where(eq(adminUsers.id, pending.userId)))[0];
    if (!user) return INVALID;
    return await issueLoginCode(user, meta);
  } catch (err) {
    console.error("resendAdminLoginCode error:", err);
    return { success: false, error: "Couldn't send a new code right now." };
  }
}

async function findPendingChallenge(challenge: string) {
  return (
    await db
      .select()
      .from(adminLoginCodes)
      .where(
        and(
          eq(adminLoginCodes.challenge, hashSecret(challenge.trim())),
          eq(adminLoginCodes.used, false),
          gt(adminLoginCodes.expiresAt, new Date())
        )
      )
      .limit(1)
  )[0];
}

/**
 * Step 2 of admin sign-in: checks the emailed code for the challenge and opens a session.
 */
export async function completeAdminLogin(
  challenge: string,
  code: string,
  meta: RequestMeta
): Promise<{ success: boolean; error?: string; expired?: boolean; token?: string; expiresAt?: Date }> {
  try {
    const pending = await findPendingChallenge(challenge);
    if (!pending) {
      return { success: false, expired: true, error: "Your sign-in attempt expired. Start again from the login page." };
    }

    if (!secretsMatch(hashSecret(code.trim()), pending.code)) {
      const attempts = pending.attempts + 1;
      const locked = attempts >= MAX_CODE_ATTEMPTS;
      await db.update(adminLoginCodes).set({ attempts, used: locked }).where(eq(adminLoginCodes.id, pending.id));
      return locked
        ? { success: false, expired: true, error: "Too many wrong codes. Start again from the login page." }
        : { success: false, error: `That code is wrong. ${MAX_CODE_ATTEMPTS - attempts} attempt${MAX_CODE_ATTEMPTS - attempts === 1 ? "" : "s"} left.` };
    }

    // Claim the code so it can't be replayed from a second tab
    const claimed = await db
      .update(adminLoginCodes)
      .set({ used: true })
      .where(and(eq(adminLoginCodes.id, pending.id), eq(adminLoginCodes.used, false)))
      .returning({ id: adminLoginCodes.id });
    if (claimed.length === 0) return { success: false, expired: true, error: "That code was already used." };

    const user = (await db.select().from(adminUsers).where(eq(adminUsers.id, pending.userId)))[0];
    if (!user) return INVALID;

    const session = await createAdminSession(user.id, meta);

    await db.insert(activityLogs).values({
      id: `log-${randomUUID()}`,
      actorEmail: user.email,
      action: "ADMIN_LOGIN",
      entityType: "ADMIN_USER",
      entityId: user.id,
      metadata: JSON.stringify({ device: describeDevice(meta.userAgent), ip: meta.ip }),
    });

    // Housekeeping: drop expired sessions and old codes
    await db.delete(adminSessions).where(lt(adminSessions.expiresAt, new Date()));
    await db.delete(adminLoginCodes).where(lt(adminLoginCodes.expiresAt, new Date(Date.now() - 24 * 60 * 60 * 1000)));

    return { success: true, ...session };
  } catch (err) {
    console.error("completeAdminLogin error:", err);
    return { success: false, error: "An unexpected error occurred during sign in." };
  }
}

/** Stores only a hash of the token, so a database leak can't be used to hijack sessions. */
async function createAdminSession(userId: string, meta: RequestMeta): Promise<{ token: string; expiresAt: Date }> {
  const token = randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await db.insert(adminSessions).values({
    id: randomUUID(),
    userId,
    token: hashSecret(token),
    expiresAt,
    userAgent: meta.userAgent.slice(0, 500),
    ip: meta.ip,
    lastSeenAt: new Date(),
  });

  return { token, expiresAt };
}

export async function getCurrentAdmin(): Promise<AdminUserSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
    if (!token) return null;

    const session = (
      await db
        .select({
          sessionId: adminSessions.id,
          lastSeenAt: adminSessions.lastSeenAt,
          userId: adminUsers.id,
          email: adminUsers.email,
          name: adminUsers.name,
          role: adminUsers.role,
        })
        .from(adminSessions)
        .innerJoin(adminUsers, eq(adminSessions.userId, adminUsers.id))
        .where(and(eq(adminSessions.token, hashSecret(token)), gt(adminSessions.expiresAt, new Date())))
    )[0];
    if (!session) return null;

    // Keep "last active" fresh without writing on every request
    if (Date.now() - session.lastSeenAt.getTime() > LAST_SEEN_REFRESH_MS) {
      db.update(adminSessions)
        .set({ lastSeenAt: new Date() })
        .where(eq(adminSessions.id, session.sessionId))
        .catch((err) => console.warn("Could not update admin session activity:", err));
    }

    return {
      id: session.userId,
      email: session.email,
      name: session.name,
      role: session.role,
      sessionId: session.sessionId,
    };
  } catch (err) {
    console.error("getCurrentAdmin error:", err);
    return null;
  }
}

/** For admin server pages: the signed-in admin, or a redirect to the login page. */
export async function requireAdmin(): Promise<AdminUserSession> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

export interface AdminDevice {
  id: string;
  device: string;
  ip: string | null;
  signedInAt: Date;
  lastActiveAt: Date;
  expiresAt: Date;
  current: boolean;
}

/** Every device currently signed in to this admin account, most recently active first. */
export async function listAdminSessions(userId: string, currentSessionId: string): Promise<AdminDevice[]> {
  const rows = await db
    .select()
    .from(adminSessions)
    .where(and(eq(adminSessions.userId, userId), gt(adminSessions.expiresAt, new Date())))
    .orderBy(desc(adminSessions.lastSeenAt));

  return rows.map((r) => ({
    id: r.id,
    device: describeDevice(r.userAgent),
    ip: r.ip,
    signedInAt: r.createdAt,
    lastActiveAt: r.lastSeenAt,
    expiresAt: r.expiresAt,
    current: r.id === currentSessionId,
  }));
}

export async function revokeAdminSession(userId: string, sessionId: string): Promise<boolean> {
  const deleted = await db
    .delete(adminSessions)
    .where(and(eq(adminSessions.id, sessionId), eq(adminSessions.userId, userId)))
    .returning({ id: adminSessions.id });
  return deleted.length > 0;
}

/** Signs out every device except the one making the request. */
export async function revokeOtherAdminSessions(userId: string, currentSessionId: string): Promise<number> {
  const deleted = await db
    .delete(adminSessions)
    .where(and(eq(adminSessions.userId, userId), ne(adminSessions.id, currentSessionId)))
    .returning({ id: adminSessions.id });
  return deleted.length;
}

export async function logoutAdmin(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
    if (token) {
      await db.delete(adminSessions).where(eq(adminSessions.token, hashSecret(token)));
    }
    cookieStore.delete(ADMIN_SESSION_COOKIE);
  } catch (err) {
    console.error("Logout error:", err);
  }
}
