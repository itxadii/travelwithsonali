import type { Metadata } from "next";

/** Public site origin. Set SITE_URL in production (it also builds password-reset links). */
export const SITE_URL = (process.env.SITE_URL || "https://travelwithsonali.com").replace(/\/$/, "");
export const SITE_NAME = "Travel With Sonali";
export const DEFAULT_DESCRIPTION =
  "Small-group tours, Himalayan treks and spiritual yatras across India and Nepal, personally planned and led by Sonali. Fixed departures, safe stays and a warm travel community.";
export const DEFAULT_OG_IMAGE = "/images/hero_bg.jpg";
export const INSTAGRAM_URL = "https://www.instagram.com/travel_withsonali";

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Trims text to a search-snippet friendly length without cutting a word in half. */
export function clampDescription(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, clean.lastIndexOf(" ", max - 1))}…`;
}

interface PageMetadataInput {
  /** Page title without the brand; the root layout's template appends " | Travel With Sonali" */
  title: string;
  description: string;
  /** Path of the canonical URL, e.g. "/tours/manali-kasol" */
  path: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
}

/**
 * Metadata for a public page: canonical URL plus Open Graph and Twitter cards.
 * Open Graph is replaced (not merged) by Next.js per segment, so every page sets it in full here.
 */
export function pageMetadata({ title, description, path, image, imageAlt, type = "website" }: PageMetadataInput): Metadata {
  const desc = clampDescription(description);
  const images = [{ url: image || DEFAULT_OG_IMAGE, alt: imageAlt || title }];
  return {
    title,
    description: desc,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description: desc,
      url: path,
      siteName: SITE_NAME,
      locale: "en_IN",
      type,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description: desc,
      images: images.map((i) => i.url),
    },
  };
}
