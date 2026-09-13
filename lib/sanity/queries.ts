import { sanityFetch } from "./client";
import { SanityTour, SanityDestination, SanityStory, SanityInstagramSection, InstagramSectionData, InstagramMoment } from "./types";
import { TOURS_DATA, Tour } from "@/app/data/toursData";
import { DESTINATIONS_DATA, Destination } from "@/app/data/destinationsData";
import { STORIES_DATA, Story } from "@/app/data/storiesData";
import { urlFor } from "./image";

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80";

/**
 * Safely resolves an image URL string from string, Sanity image asset, or fallback URL.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function resolveImageUrl(source: any, fallback: string = DEFAULT_IMAGE): string {
  if (!source) return fallback;
  if (typeof source === "string") return source;
  if (typeof source === "object") {
    if (source.asset) {
      try {
        const builtUrl = urlFor(source)?.url();
        if (builtUrl) return builtUrl;
      } catch (err) {
        console.warn("Failed to build image URL from asset:", err);
      }
    }
  }
  return fallback;
}

// GROQ Queries
export const activeToursQuery = `
  *[_type == "tour" && status == "Active"] | order(_createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    heroImage,
    gallery,
    duration,
    startingLocation,
    endingLocation,
    groupSize,
    transport,
    accommodation,
    meals,
    price,
    priceLabel,
    status,
    featured,
    inclusions,
    exclusions,
    "destinationName": destination->name,
    "destinationSlug": destination->slug.current
  }
`;

export const featuredToursQuery = `
  *[_type == "tour" && status == "Active" && featured == true] | order(_createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    heroImage,
    gallery,
    duration,
    startingLocation,
    endingLocation,
    groupSize,
    transport,
    accommodation,
    meals,
    price,
    priceLabel,
    status,
    featured,
    inclusions,
    exclusions,
    "destinationName": destination->name,
    "destinationSlug": destination->slug.current
  }
`;

export const tourBySlugQuery = `
  *[_type == "tour" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    description,
    heroImage,
    gallery,
    duration,
    startingLocation,
    endingLocation,
    groupSize,
    transport,
    accommodation,
    meals,
    price,
    priceLabel,
    status,
    featured,
    departures,
    inclusions,
    exclusions,
    itinerary,
    importantInformation,
    faqs,
    seo,
    "destinationName": destination->name,
    "destinationSlug": destination->slug.current
  }
`;

export const destinationsQuery = `
  *[_type == "destination"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    heroImage,
    shortDescription,
    description,
    gallery,
    featured,
    seo
  }
`;

export const destinationBySlugQuery = `
  *[_type == "destination" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    heroImage,
    shortDescription,
    description,
    gallery,
    featured,
    seo
  }
`;

export const toursByDestinationQuery = `
  *[_type == "tour" && status == "Active" && destination->slug.current == $slug] | order(_createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    heroImage,
    duration,
    price,
    priceLabel,
    status,
    "destinationName": destination->name
  }
`;

export const storiesQuery = `
  *[_type == "story"] | order(_createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    category,
    excerpt,
    coverImage,
    author,
    authorRole,
    authorAvatar,
    date,
    readTime,
    featured,
    content,
    seo
  }
`;

export const storyBySlugQuery = `
  *[_type == "story" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    category,
    excerpt,
    coverImage,
    author,
    authorRole,
    authorAvatar,
    date,
    readTime,
    featured,
    content,
    seo
  }
`;

/**
 * Converts a SanityTour object to the application's Tour interface,
 * filling in defaults where fields may be empty.
 */
export function mapSanityTourToAppTour(raw: Record<string, unknown>): Tour {
  const priceNum = typeof raw.price === "number" ? raw.price : 11999;
  const priceStr = `₹${priceNum.toLocaleString("en-IN")}`;
  const slugStr = typeof raw.slug === "string" ? raw.slug : String(raw._id || "tour");

  const heroImg = resolveImageUrl(raw.heroImage, DEFAULT_IMAGE);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const galleryImgs = Array.isArray(raw.gallery) && raw.gallery.length > 0
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? raw.gallery.map((g: any) => resolveImageUrl(g, DEFAULT_IMAGE))
    : [DEFAULT_IMAGE];

  return {
    id: String(raw._id || slugStr),
    slug: slugStr,
    title: String(raw.title || "Tour Package"),
    destination: String(raw.destinationName || raw.startingLocation || "India"),
    duration: String(raw.duration || "5 Nights / 6 Days"),
    departureDate: "Multiple Batches",
    price: priceStr,
    numericPrice: priceNum,
    image: heroImg,
    gallery: galleryImgs,
    description: String(raw.shortDescription || "Unforgettable group travel experience with Travel With Sonali."),
    overview: String(raw.shortDescription || "Explore breathtaking landscapes and curated group moments."),
    groupSize: String(raw.groupSize || "10 - 15 Travellers"),
    startingPoint: String(raw.startingLocation || "Mumbai / Delhi"),
    transport: String(raw.transport || "AC Bus / Local Vehicle"),
    accommodation: String(raw.accommodation || "3-Star Hotels / Stays"),
    meals: String(raw.meals || "Breakfast & Dinner Included"),
    featured: Boolean(raw.featured),
    category: "Mountains",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    itinerary: Array.isArray(raw.itinerary) ? raw.itinerary.map((item: any) => ({
      day: String(item.day || "Day"),
      title: String(item.title || "Day Itinerary"),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      description: typeof item.description === "string" ? item.description : (Array.isArray(item.description) ? item.description.map((b: any) => b.children?.map((c: any) => c.text).join('')).join(' ') : "Detailed day itinerary."),
      meals: item.meals ? String(item.meals) : undefined,
      stay: item.stay ? String(item.stay) : undefined,
    })) : [],
    inclusions: Array.isArray(raw.inclusions) ? raw.inclusions.map(String) : ["Accommodation", "Transfers", "Breakfast & Dinner"],
    exclusions: Array.isArray(raw.exclusions) ? raw.exclusions.map(String) : ["Personal Expenses", "Lunch"],
    importantInfo: Array.isArray(raw.importantInformation)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ? raw.importantInformation.map((info: any) => ({
          title: String(info.title || "Important Note"),
          details: Array.isArray(info.details) ? info.details.map(String) : [],
        }))
      : [
          {
            title: "General Guidelines",
            details: ["Carry valid photo ID proof.", "Follow group coordinator guidelines."],
          },
        ],
  };
}

export function mapSanityStoryToAppStory(raw: SanityStory): Story {
  return {
    id: raw._id || raw.slug.current,
    slug: raw.slug.current,
    title: raw.title,
    category: raw.category || "Trip Stories",
    excerpt: raw.excerpt || "",
    author: raw.author || "Sonali Palekar",
    authorRole: raw.authorRole || "Founder & Lead Explorer",
    authorAvatar: resolveImageUrl(raw.authorAvatar, "/images/sonali.png"),
    date: raw.date || "2026",
    readTime: raw.readTime || "5 min read",
    image: resolveImageUrl(raw.coverImage, DEFAULT_IMAGE),
    featured: Boolean(raw.featured),
    content: Array.isArray(raw.content) ? raw.content : [raw.excerpt],
  };
}

// Fetch helper with fallback to static dataset
export async function getActiveTours(): Promise<Tour[]> {
  const sanityTours = await sanityFetch<Record<string, unknown>[]>(activeToursQuery);
  if (sanityTours && sanityTours.length > 0) {
    return sanityTours.map(mapSanityTourToAppTour);
  }
  return TOURS_DATA;
}

export async function getFeaturedTours(): Promise<Tour[]> {
  const sanityTours = await sanityFetch<Record<string, unknown>[]>(featuredToursQuery);
  if (sanityTours && sanityTours.length > 0) {
    return sanityTours.map(mapSanityTourToAppTour);
  }
  return TOURS_DATA.filter((t) => t.featured);
}

export async function getTourBySlug(slug: string): Promise<Tour | null> {
  const sanityTour = await sanityFetch<Record<string, unknown>>(tourBySlugQuery, { slug });
  if (sanityTour && sanityTour.title) {
    return mapSanityTourToAppTour(sanityTour);
  }
  const fallback = TOURS_DATA.find((t) => t.slug === slug);
  return fallback || null;
}

export async function getDestinations(): Promise<Destination[]> {
  const sanityDestinations = await sanityFetch<SanityDestination[]>(destinationsQuery);
  if (sanityDestinations && sanityDestinations.length > 0) {
    return sanityDestinations.map((d) => ({
      id: d._id || d.slug.current,
      slug: d.slug.current,
      name: d.name,
      tagline: d.shortDescription || "Unforgettable travel experience",
      description: d.description || d.shortDescription || "",
      image: resolveImageUrl(d.heroImage, DEFAULT_IMAGE),
      featured: Boolean(d.featured),
      toursCount: 1,
      bestTimeToVisit: "Round the Year",
      highlights: ["Scenic Views", "Group Travel", "Curated Stays"],
    }));
  }
  return DESTINATIONS_DATA;
}

export async function getDestinationBySlug(slug: string): Promise<Destination | null> {
  const sanityDest = await sanityFetch<SanityDestination>(destinationBySlugQuery, { slug });
  if (sanityDest && sanityDest.name) {
    return {
      id: sanityDest._id || sanityDest.slug.current,
      slug: sanityDest.slug.current,
      name: sanityDest.name,
      tagline: sanityDest.shortDescription || "Unforgettable travel experience",
      description: sanityDest.description || sanityDest.shortDescription || "",
      image: resolveImageUrl(sanityDest.heroImage, DEFAULT_IMAGE),
      featured: Boolean(sanityDest.featured),
      toursCount: 1,
      bestTimeToVisit: "Round the Year",
      highlights: ["Scenic Views", "Group Travel", "Curated Stays"],
    };
  }
  const fallback = DESTINATIONS_DATA.find((d) => d.slug === slug);
  return fallback || null;
}

export async function getToursByDestination(slug: string): Promise<Tour[]> {
  const sanityTours = await sanityFetch<Record<string, unknown>[]>(toursByDestinationQuery, { slug });
  if (sanityTours && sanityTours.length > 0) {
    return sanityTours.map(mapSanityTourToAppTour);
  }
  return TOURS_DATA.filter((t) => t.destination.toLowerCase().includes(slug.toLowerCase()) || t.slug.includes(slug));
}

export async function getStories(): Promise<Story[]> {
  const sanityStories = await sanityFetch<SanityStory[]>(storiesQuery);
  if (sanityStories && sanityStories.length > 0) {
    return sanityStories.map(mapSanityStoryToAppStory);
  }
  return STORIES_DATA;
}

export async function getStoryBySlug(slug: string): Promise<Story | null> {
  const sanityStory = await sanityFetch<SanityStory>(storyBySlugQuery, { slug });
  if (sanityStory && sanityStory.title) {
    return mapSanityStoryToAppStory(sanityStory);
  }
  const fallback = STORIES_DATA.find((s) => s.slug === slug);
  return fallback || null;
}

export const instagramSectionQuery = `
  *[_type == "instagramSection"][0] {
    _id,
    badge,
    heading,
    subheading,
    instagramHandle,
    instagramUrl,
    buttonText,
    moments[] {
      _key,
      title,
      subtitle,
      tag,
      image,
      postUrl
    }
  }
`;

export const DEFAULT_INSTAGRAM_MOMENTS: InstagramMoment[] = [
  {
    id: 1,
    title: "Himachal High Pass",
    subtitle: "@travelwithsonali • Himachal Batch",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
    tag: "Group Batch",
    postUrl: "https://instagram.com",
  },
  {
    id: 2,
    title: "Manali Riverside Bliss",
    subtitle: "@travelwithsonali • Manali & Kasol",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    tag: "Mountain Retreat",
    postUrl: "https://instagram.com",
  },
  {
    id: 3,
    title: "Spiti Golden Sunsets",
    subtitle: "@travelwithsonali • Spiti Valley",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    tag: "Alpine Twilight",
    postUrl: "https://instagram.com",
  },
  {
    id: 4,
    title: "Kedarnath Divine Silence",
    subtitle: "@travelwithsonali • Sacred Trails",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    tag: "Himalayan Peace",
    postUrl: "https://instagram.com",
  },
  {
    id: 5,
    title: "Coastal Waves in Gokarna",
    subtitle: "@travelwithsonali • Ocean Journey",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
    tag: "Beach Sunshine",
    postUrl: "https://instagram.com",
  },
  {
    id: 6,
    title: "High Altitude Winter Trail",
    subtitle: "@travelwithsonali • Winter Trek",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80",
    tag: "Snow Adventure",
    postUrl: "https://instagram.com",
  },
  {
    id: 7,
    title: "Kasol Evening Campfire",
    subtitle: "@travelwithsonali • Community",
    image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80",
    tag: "Campfire Stories",
    postUrl: "https://instagram.com",
  },
];

export async function getInstagramSection(): Promise<InstagramSectionData> {
  const data = await sanityFetch<SanityInstagramSection>(instagramSectionQuery);
  if (data && data.heading) {
    return {
      badge: data.badge || "Social Community",
      heading: data.heading || "Follow Our Moments on Instagram",
      subheading: data.subheading || "Tag @travelwithsonali to get featured in our stories.",
      instagramHandle: data.instagramHandle || "@travelwithsonali",
      instagramUrl: data.instagramUrl || "https://instagram.com",
      buttonText: data.buttonText || `Follow ${data.instagramHandle || "@travelwithsonali"}`,
      moments: Array.isArray(data.moments) && data.moments.length > 0
        ? data.moments.map((m, idx) => ({
            id: m._key || idx + 1,
            title: m.title || `Moment ${idx + 1}`,
            subtitle: m.subtitle || data.instagramHandle || "@travelwithsonali",
            tag: m.tag || "Travel Moment",
            image: resolveImageUrl(m.image, DEFAULT_IMAGE),
            postUrl: m.postUrl || data.instagramUrl || "https://instagram.com",
          }))
        : DEFAULT_INSTAGRAM_MOMENTS,
    };
  }

  return {
    badge: "Social Community",
    heading: "Follow Our Moments on Instagram",
    subheading: "Tag @travelwithsonali to get featured in our stories.",
    instagramHandle: "@travelwithsonali",
    instagramUrl: "https://instagram.com",
    buttonText: "Follow @travelwithsonali",
    moments: DEFAULT_INSTAGRAM_MOMENTS,
  };
}
