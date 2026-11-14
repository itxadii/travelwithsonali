import { db } from "@/db";
import { activityLogs, adminSetupTokens, adminSessions, adminUsers } from "@/db/schema";
import { and, eq, gt, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { createHash, randomUUID } from "node:crypto";
import { sendAdminInviteEmail } from "@/lib/mailer";
import { SITE_URL } from "@/lib/seo";
import type { AdminUserSession } from "@/lib/admin/auth";

/**
 * Admin team: owners add people by email; each person sets their own password from an
 * emailed link, then signs in with password + emailed code like everyone else.
 */

export const OWNER_ROLE = "SUPER_ADMIN";
export const ADMIN_ROLE = "ADMIN";
export type AdminRole = typeof OWNER_ROLE | typeof ADMIN_ROLE;

const SETUP_LINK_TTL_MS = 72 * 60 * 60 * 1000; // 3 days to accept an invite or reset

export function isOwner(admin: Pick<AdminUserSession, "role"> | null | undefined): boolean {
  return admin?.role === OWNER_ROLE;
}

export function roleLabel(role: string): string {
  return role === OWNER_ROLE ? "Owner" : "Admin";
}

function hashSecret(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function log(actorEmail: string, action: string, entityId: string, metadata: Record<string, unknown>) {
  return db.insert(activityLogs).values({
    id: `log-${randomUUID()}`,
    actorEmail,
    action,
    entityType: "ADMIN_USER",
    entityId,
    metadata: JSON.stringify(metadata),
  });
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  invitePending: boolean;
  createdAt: Date;
  activeDevices: number;
}

export async function listTeam(): Promise<TeamMember[]> {
  const rows = await db
    .select({
      id: adminUsers.id,
      name: adminUsers.name,
      email: adminUsers.email,
      role: adminUsers.role,
      invitePending: adminUsers.invitePending,
      createdAt: adminUsers.createdAt,
      activeDevices: sql<number>`(SELECT count(*)::int FROM admin_sessions s WHERE s.user_id = ${adminUsers.id} AND s.expires_at > NOW())`,
    })
    .from(adminUsers)
    .orderBy(adminUsers.createdAt);
  return rows;
}

async function ownerCount(): Promise<number> {
  const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(adminUsers).where(eq(adminUsers.role, OWNER_ROLE));
  return count;
}

/** Creates a one-time link and emails it. Earlier unused links for this person stop working. */
async function sendSetupLink(user: { id: string; name: string; email: string }, inviter: string, kind: "invite" | "reset") {
  await db.delete(adminSetupTokens).where(eq(adminSetupTokens.userId, user.id));
  const token = randomUUID() + randomUUID().replace(/-/g, "");
  await db.insert(adminSetupTokens).values({
    id: randomUUID(),
    userId: user.id,
    token: hashSecret(token),
    expiresAt: new Date(Date.now() + SETUP_LINK_TTL_MS),
  });
  const link = `${SITE_URL}/admin/set-password?token=${encodeURIComponent(token)}`;
  await sendAdminInviteEmail(user.email, user.name, inviter, link, kind);
}

type Result = { success: true } | { success: false; status: number; error: string };

export async function inviteAdmin(
  input: { name: string; email: string; role: string },
  actor: AdminUserSession
): Promise<Result & { id?: string }> {
  const name = input.name.trim().slice(0, 100);
  const email = input.email.trim().toLowerCase();
  const role: AdminRole = input.role === OWNER_ROLE ? OWNER_ROLE : ADMIN_ROLE;

  if (!name) return { success: false, status: 400, error: "Enter their name." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { success: false, status: 400, error: "Enter a valid email address." };

  const existing = (await db.select({ id: adminUsers.id }).from(adminUsers).where(eq(adminUsers.email, email)))[0];
  if (existing) return { success: false, status: 409, error: "Someone on the team already uses that email." };

  const id = `admin-${randomUUID()}`;
  // Placeholder hash nobody knows; the person chooses their real password from the email
  const passwordHash = await bcrypt.hash(randomUUID(), 10);
  await db.insert(adminUsers).values({ id, email, name, role, passwordHash, invitePending: true });

  try {
    await sendSetupLink({ id, name, email }, actor.name, "invite");
  } catch (err) {
    console.error("Admin invite email failed:", err);
    await db.delete(adminUsers).where(eq(adminUsers.id, id));
    return { success: false, status: 502, error: "Couldn't send the invite email. Check the mail settings and try again." };
  }

  await log(actor.email, "INVITE_ADMIN", id, { name, email, role });
  return { success: true, id };
}

/** Re-sends the invite, or for someone already set up, a password reset link. */
export async function resendSetupLink(id: string, actor: AdminUserSession): Promise<Result> {
  const user = (await db.select().from(adminUsers).where(eq(adminUsers.id, id)))[0];
  if (!user) return { success: false, status: 404, error: "That person isn't on the team." };
  try {
    await sendSetupLink(user, actor.name, user.invitePending ? "invite" : "reset");
  } catch (err) {
    console.error("Admin setup link email failed:", err);
    return { success: false, status: 502, error: "Couldn't send the email. Check the mail settings and try again." };
  }
  await log(actor.email, user.invitePending ? "RESEND_ADMIN_INVITE" : "SEND_ADMIN_PASSWORD_RESET", id, { email: user.email });
  return { success: true };
}

export async function changeAdminRole(id: string, role: string, actor: AdminUserSession): Promise<Result> {
  const nextRole: AdminRole = role === OWNER_ROLE ? OWNER_ROLE : ADMIN_ROLE;
  const user = (await db.select().from(adminUsers).where(eq(adminUsers.id, id)))[0];
  if (!user) return { success: false, status: 404, error: "That person isn't on the team." };
  if (user.role === nextRole) return { success: true };
  if (user.role === OWNER_ROLE && (await ownerCount()) <= 1) {
    return { success: false, status: 409, error: "There must always be at least one owner. Make someone else an owner first." };
  }
  await db.update(adminUsers).set({ role: nextRole, updatedAt: new Date() }).where(eq(adminUsers.id, id));
  await log(actor.email, "CHANGE_ADMIN_ROLE", id, { email: user.email, from: roleLabel(user.role), to: roleLabel(nextRole) });
  return { success: true };
}

export async function removeAdmin(id: string, actor: AdminUserSession): Promise<Result> {
  if (id === actor.id) return { success: false, status: 409, error: "You can't remove yourself. Ask another owner to do it." };
  const user = (await db.select().from(adminUsers).where(eq(adminUsers.id, id)))[0];
  if (!user) return { success: false, status: 404, error: "That person isn't on the team." };
  if (user.role === OWNER_ROLE && (await ownerCount()) <= 1) {
    return { success: false, status: 409, error: "There must always be at least one owner." };
  }
  // Sessions, sign-in codes and setup links cascade, so they're signed out everywhere at once
  await db.batch([
    db.delete(adminUsers).where(eq(adminUsers.id, id)),
    log(actor.email, "REMOVE_ADMIN", id, { name: user.name, email: user.email, role: roleLabel(user.role) }),
  ]);
  return { success: true };
}

/** Public step: the person from the email sets their password with the link's token. */
export async function setPasswordFromLink(token: string, password: string): Promise<Result & { email?: string }> {
  if (typeof password !== "string" || password.length < 10 || password.length > 128) {
    return { success: false, status: 400, error: "Use a password between 10 and 128 characters." };
  }
  const row = (
    await db
      .select()
      .from(adminSetupTokens)
      .where(and(eq(adminSetupTokens.token, hashSecret(token.trim())), gt(adminSetupTokens.expiresAt, new Date())))
  )[0];
  if (!row) return { success: false, status: 400, error: "This link has expired or was already used. Ask an owner to send a new one." };

  const user = (await db.select().from(adminUsers).where(eq(adminUsers.id, row.userId)))[0];
  if (!user) return { success: false, status: 400, error: "This account no longer exists." };

  const passwordHash = await bcrypt.hash(password, 10);
  await db.batch([
    db.delete(adminSetupTokens).where(eq(adminSetupTokens.userId, user.id)),
    db.update(adminUsers).set({ passwordHash, invitePending: false, updatedAt: new Date() }).where(eq(adminUsers.id, user.id)),
    // A new password signs out every existing device
    db.delete(adminSessions).where(eq(adminSessions.userId, user.id)),
    log(user.email, user.invitePending ? "ACCEPT_ADMIN_INVITE" : "RESET_ADMIN_PASSWORD", user.id, {}),
  ]);
  return { success: true, email: user.email };
}
