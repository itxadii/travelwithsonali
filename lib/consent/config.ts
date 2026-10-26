/**
 * Cookie consent configuration shared by the browser and the API routes.
 *
 * Bump CONSENT_VERSION whenever the notice text, the categories, or the tools behind
 * them change: every visitor is then asked again, so consent always matches the
 * notice they actually saw (DPDP Act s.5/s.6, MeitY CMS guidance on renewal).
 */
export const CONSENT_VERSION = "2026-10-26.2"; // .2: Google Analytics added to the analytics purpose

/** Stores the visitor's choice. Essential: without it we can't honour a "reject". */
export const CONSENT_COOKIE = "tws_consent";
/** Random analytics visitor ID. Only set after analytics consent; deleted on withdrawal. */
export const VISITOR_COOKIE = "tws_vid";

/** Consent expires after 12 months, after which the visitor is asked again. */
export const CONSENT_MAX_AGE_SECONDS = 365 * 24 * 60 * 60;
/** Analytics events older than this are deleted. */
export const ANALYTICS_RETENTION_DAYS = 365;

export const GRIEVANCE_EMAIL = "travelwithsonaliinfo@gmail.com";
/** Data Protection Board of India complaint link. Set NEXT_PUBLIC_DPB_COMPLAINT_URL once the Board's portal URL is confirmed. */
export const DPB_COMPLAINT_URL = process.env.NEXT_PUBLIC_DPB_COMPLAINT_URL || "https://www.meity.gov.in";

/** Google Analytics 4 measurement ID (public by design). Loaded only for visitors who accept analytics. */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "G-6E6T7CECYM";
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";

/** The marketing category is only offered when a marketing tool is actually configured. */
export const MARKETING_ENABLED = Boolean(META_PIXEL_ID);

export type ConsentLanguage = "en" | "hi";
export type ConsentAction = "accept_all" | "reject_all" | "custom";

export interface ConsentState {
  /** Notice version the choice was made against */
  version: string;
  analytics: boolean;
  marketing: boolean;
  /** Pseudonymous ID tying this browser's choices together in the consent log */
  consentId: string;
  /** Epoch ms of the choice */
  updatedAt: number;
}

/** Plain JSON: Next.js URL-encodes cookie values itself when setting them. */
export function serializeConsent(state: ConsentState): string {
  return JSON.stringify(state);
}

/**
 * Decodes a cookie value to its JSON object. The value may arrive raw (server, already
 * decoded), encoded once (document.cookie), or encoded twice (cookies saved by an
 * earlier version), so decode until it looks like JSON.
 */
export function decodeCookieJson(raw: string | undefined | null): Record<string, unknown> | null {
  if (!raw) return null;
  let value = raw;
  for (let i = 0; i < 3 && !value.startsWith("{"); i++) {
    try {
      value = decodeURIComponent(value);
    } catch {
      return null;
    }
  }
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

/** Returns null for a missing, malformed, or outdated-version cookie (the visitor must be asked again). */
export function parseConsent(raw: string | undefined | null): ConsentState | null {
  if (!raw) return null;
  try {
    const value = decodeCookieJson(raw);
    if (
      value &&
      value.version === CONSENT_VERSION &&
      typeof value.analytics === "boolean" &&
      typeof value.marketing === "boolean" &&
      typeof value.consentId === "string" &&
      typeof value.updatedAt === "number"
    ) {
      return value as unknown as ConsentState;
    }
  } catch {
    // fall through
  }
  return null;
}
