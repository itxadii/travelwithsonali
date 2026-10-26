import type { MetadataRoute } from "next";
import { sanityFetch } from "@/lib/sanity/client";
import { TOURS_DATA } from "@/app/data/toursData";
import { DESTINATIONS_DATA } from "@/app/data/destinationsData";
import { STORIES_DATA } from "@/app/data/storiesData";
import { absoluteUrl } from "@/lib/seo";

// Regenerated at most hourly, so new tours, destinations and stories appear without a deploy
export const revalidate = 3600;

interface SanityRoute {
  _type: "tour" | "destination" | "story";
  slug: string;
  _updatedAt: string;
}

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" | "yearly" }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/tours", priority: 0.9, changeFrequency: "weekly" },
  { path: "/destinations", priority: 0.9, changeFrequency: "weekly" },
  { path: "/stories", priority: 0.7, changeFrequency: "weekly" },
  { path: "/gallery", priority: 0.6, changeFrequency: "monthly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.6, changeFrequency: "yearly" },
  { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
  { path: "/cancellation-policy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms-and-conditions", priority: 0.3, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sanityRoutes =
    (await sanityFetch<SanityRoute[]>(
      `*[(_type == "tour" && status == "Active") || _type in ["destination", "story"]][defined(slug.current)]{
        _type, "slug": slug.current, _updatedAt
      }`
    )) || [];

  // Content pages: Sanity first (with real last-edited dates), plus built-in pages that still render without a Sanity document
  const entries = new Map<string, { lastModified?: Date; priority: number }>();
  const add = (path: string, priority: number, updatedAt?: string) => {
    if (!entries.has(path)) entries.set(path, { lastModified: updatedAt ? new Date(updatedAt) : undefined, priority });
  };

  for (const route of sanityRoutes) {
    if (route._type === "tour") add(`/tours/${route.slug}`, 0.8, route._updatedAt);
    if (route._type === "destination") add(`/destinations/${route.slug}`, 0.8, route._updatedAt);
    if (route._type === "story") add(`/stories/${route.slug}`, 0.6, route._updatedAt);
  }
  if (!sanityRoutes.some((r) => r._type === "tour")) TOURS_DATA.forEach((t) => add(`/tours/${t.slug}`, 0.8));
  DESTINATIONS_DATA.forEach((d) => add(`/destinations/${d.slug}`, 0.8));
  if (!sanityRoutes.some((r) => r._type === "story")) STORIES_DATA.forEach((s) => add(`/stories/${s.slug}`, 0.6));

  return [
    ...STATIC_ROUTES.map((r) => ({
      url: absoluteUrl(r.path),
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    })),
    ...Array.from(entries, ([path, { lastModified, priority }]) => ({
      url: absoluteUrl(path),
      ...(lastModified && { lastModified }),
      changeFrequency: "weekly" as const,
      priority,
    })),
  ];
}
