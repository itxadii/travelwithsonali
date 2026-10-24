import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { sql } from "drizzle-orm";
import { db } from "@/db";

/**
 * Fixed-window rate limiting stored in Postgres, so limits hold across serverless instances.
 * Fails open: if the database check errors, the request is allowed and the error is logged.
 */

export interface RateLimitRule {
  /** Bucket name plus the thing being limited, e.g. ["portal-login:ip", ip] */
  key: string[];
  limit: number;
  windowSeconds: number;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

function hashKey(parts: string[]): string {
  return createHash("sha256").update(parts.join("|")).digest("hex");
}

async function hit(rule: RateLimitRule): Promise<RateLimitResult> {
  const key = hashKey(rule.key);
  const window = `${rule.windowSeconds} seconds`;

  const result = await db.execute(sql`
    INSERT INTO rate_limits (key, count, window_start)
    VALUES (${key}, 1, NOW())
    ON CONFLICT (key) DO UPDATE SET
      count = CASE
        WHEN rate_limits.window_start < NOW() - ${window}::interval THEN 1
        ELSE rate_limits.count + 1
      END,
      window_start = CASE
        WHEN rate_limits.window_start < NOW() - ${window}::interval THEN NOW()
        ELSE rate_limits.window_start
      END
    RETURNING count,
      GREATEST(0, CEIL(EXTRACT(EPOCH FROM (window_start + ${window}::interval - NOW()))))::int AS retry_after
  `);

  const row = result.rows[0] as { count: number; retry_after: number };
  return {
    allowed: Number(row.count) <= rule.limit,
    retryAfterSeconds: Number(row.retry_after) || rule.windowSeconds,
  };
}

/**
 * Counts one attempt against every rule. Blocked if any rule is over its limit.
 */
export async function checkRateLimits(rules: RateLimitRule[]): Promise<RateLimitResult> {
  try {
    const results = await Promise.all(rules.map(hit));

    // Occasionally clear out stale windows so the table stays small
    if (Math.random() < 0.01) {
      await db.execute(sql`DELETE FROM rate_limits WHERE window_start < NOW() - INTERVAL '1 day'`);
    }

    const blocked = results.filter((r) => !r.allowed);
    if (blocked.length === 0) return { allowed: true, retryAfterSeconds: 0 };
    return { allowed: false, retryAfterSeconds: Math.max(...blocked.map((r) => r.retryAfterSeconds)) };
  } catch (err) {
    console.error("Rate limit check failed (allowing request):", err);
    return { allowed: true, retryAfterSeconds: 0 };
  }
}

/**
 * Client IP as reported by the hosting proxy (Vercel and most hosts set these headers).
 */
export function getClientIp(req: Request): string {
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}

export function tooManyRequests(retryAfterSeconds: number) {
  const minutes = Math.max(1, Math.ceil(retryAfterSeconds / 60));
  return NextResponse.json(
    { error: `Too many attempts. Please try again in ${minutes} minute${minutes === 1 ? "" : "s"}.` },
    { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
  );
}
