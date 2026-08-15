export interface Story {
  id: string;
  slug: string;
  title: string;
  category: "Trip Stories" | "Travel Guides" | "Travel Tips" | "Behind the Journey";
  excerpt: string;
  author: string;
  authorRole: string;
  authorAvatar: string;
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
  content: string[];
}

export const STORIES_DATA: Story[] = [
  {
    id: "kedarnath-group-travel-experience",
    slug: "kedarnath-group-travel-experience",
    title: "What It's Really Like Travelling to Kedarnath With a Group",
    category: "Trip Stories",
    excerpt: "From sharing walking sticks on the 16km uphill trek to singing bhajans at midnight outside the temple, here is how strangers became family.",
    author: "Sonali Sharma",
    authorRole: "Founder & Lead Explorer",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    date: "14 May 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
    featured: true,
    content: [
      "Trekking to Kedarnath isn't just about reaching a temple at 11,750 feet. It is a raw test of endurance, spirit, and emotion that hits differently when shared with a group of positive souls.",
      "I still remember our June batch — 14 people from Mumbai, Delhi, Bengaluru, and Pune who had never met before. By Day 2 at Gaurikund base, everyone was checking up on each other's water bottles and sharing energy bars.",
      "As dusk fell near the shrine, the temple lights lit up against the towering snow-covered Kedar peak. Standing together in the cold mountain air, tears in our eyes and warm chai cups in hand, we knew this memory would stay with us forever."
    ]
  },
  {
    id: "kashmir-trip-guide",
    slug: "kashmir-trip-guide",
    title: "7 Things To Know Before Your First Kashmir Trip",
    category: "Travel Guides",
    excerpt: "Sim card rules, Gondola ticket tips, local tea customs, and packing hacks to ensure your Kashmir adventure is seamless.",
    author: "Sonali Sharma",
    authorRole: "Founder & Lead Explorer",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    date: "28 April 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1200&q=80",
    featured: true,
    content: [
      "Kashmir is one of the most stunning regions in the world, but it has unique travel dynamics every first-time visitor should know.",
      "First: Prepaid mobile SIM cards from outside J&K do not work due to telecom regulations. Always bring or convert to a Postpaid connection (Jio / Airtel).",
      "Second: Book your Gulmarg Gondola Phase 1 & Phase 2 tickets well in advance. Tickets sell out weeks ahead during peak spring and autumn seasons."
    ]
  },
  {
    id: "why-group-travel-is-different",
    slug: "why-group-travel-is-different",
    title: "Why Group Travel Hits Different (And Why You Shouldn't Wait For Friends)",
    category: "Behind the Journey",
    excerpt: "Waiting for friends to align leaves your bucket list on pending. Here is why joining a curated group trip changes your life.",
    author: "Sonali Sharma",
    authorRole: "Founder & Lead Explorer",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    date: "10 March 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
    featured: false,
    content: [
      "How many times has your Goa or Himachal group trip plan died on 'bro next month for sure'?",
      "When you join a group trip with Travel With Sonali, you step out of your comfort zone and into an environment designed for authentic human connection. You travel as an individual, but leave as a tight-knit family."
    ]
  },
  {
    id: "people-you-meet-while-travelling",
    slug: "people-you-meet-while-travelling",
    title: "The Unforgettable People You Meet While Travelling",
    category: "Trip Stories",
    excerpt: "A tribute to the solo dreamers, guitar players, midnight storytellers, and lifelong friends made on the road.",
    author: "Sonali Sharma",
    authorRole: "Founder & Lead Explorer",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    date: "15 February 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1539635273304-0e8723577246?auto=format&fit=crop&w=1200&q=80",
    featured: false,
    content: [
      "The destinations are breathtaking, but it's always the people who make a trip unforgettable.",
      "From software engineers escaping screen fatigue to photographers capturing sunrise peaks, every group brings a unique energy that stays in your heart forever."
    ]
  }
];
