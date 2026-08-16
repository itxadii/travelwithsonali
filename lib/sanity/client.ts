import { createClient } from "next-sanity";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "travelwithsonali";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = process.env.SANITY_API_VERSION || "2024-03-01";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production",
});

/**
 * Helper to safely execute Sanity GROQ queries.
 * Returns null if Sanity is unreachable or returns an error.
 */
export async function sanityFetch<T>(query: string, params: Record<string, unknown> = {}): Promise<T | null> {
  try {
    if (!projectId || projectId === "your_project_id_here") {
      return null;
    }
    const data = await client.fetch<T>(query, params, {
      next: { revalidate: 60 },
    });
    return data;
  } catch (error) {
    console.warn("Sanity fetch warning/error:", error);
    return null;
  }
}
