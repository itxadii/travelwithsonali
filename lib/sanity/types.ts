export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  alt?: string;
}

export interface SanityDeparture {
  date: string;
  availableSeats?: number;
  totalSeats?: number;
  priceOverride?: number;
  status?: string;
}

export interface SanityItineraryDay {
  day: string;
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  description?: any[];
  location?: string;
  meals?: string;
  stay?: string;
  image?: SanityImage;
}

export interface SanityFAQ {
  question: string;
  answer: string;
}

export interface SanityImportantInfo {
  title: string;
  details: string[];
}

export interface SanitySEO {
  title?: string;
  description?: string;
  ogImage?: SanityImage;
}

export interface SanityDestination {
  _id: string;
  _type: "destination";
  name: string;
  slug: { current: string };
  heroImage?: SanityImage | string;
  shortDescription?: string;
  description?: string;
  gallery?: (SanityImage | string)[];
  featured?: boolean;
  seo?: SanitySEO;
}

export interface SanityTour {
  _id: string;
  _type: "tour";
  title: string;
  slug: { current: string };
  destination?: SanityDestination;
  shortDescription?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  description?: any[];
  heroImage?: SanityImage | string;
  gallery?: (SanityImage | string)[];
  duration?: string;
  startingLocation?: string;
  endingLocation?: string;
  groupSize?: string;
  transport?: string;
  accommodation?: string;
  meals?: string;
  price: number;
  priceLabel?: string;
  status?: "Active" | "Draft" | "Sold Out" | "Archived";
  featured?: boolean;
  departures?: SanityDeparture[];
  inclusions?: string[];
  exclusions?: string[];
  itinerary?: SanityItineraryDay[];
  importantInformation?: SanityImportantInfo[];
  faqs?: SanityFAQ[];
  seo?: SanitySEO;
}

export interface SanityStory {
  _id: string;
  _type: "story";
  title: string;
  slug: { current: string };
  category: "Trip Stories" | "Travel Guides" | "Travel Tips" | "Behind the Journey";
  excerpt: string;
  coverImage?: SanityImage | string;
  author?: string;
  authorRole?: string;
  authorAvatar?: SanityImage | string;
  date?: string;
  readTime?: string;
  featured?: boolean;
  content?: string[];
  seo?: SanitySEO;
}

export interface SanityInstagramMoment {
  _key?: string;
  title: string;
  subtitle?: string;
  tag?: string;
  image?: SanityImage | string;
  postUrl?: string;
}

export interface SanityInstagramSection {
  _id?: string;
  _type?: "instagramSection";
  badge?: string;
  heading?: string;
  subheading?: string;
  instagramHandle?: string;
  instagramUrl?: string;
  buttonText?: string;
  moments?: SanityInstagramMoment[];
}

export interface InstagramMoment {
  id?: string | number;
  title: string;
  subtitle: string;
  tag: string;
  image: string;
  postUrl?: string;
}

export interface InstagramSectionData {
  badge?: string;
  heading?: string;
  subheading?: string;
  instagramHandle?: string;
  instagramUrl?: string;
  buttonText?: string;
  moments?: InstagramMoment[];
}
