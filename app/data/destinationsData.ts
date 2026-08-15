export interface Destination {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  featured: boolean;
  toursCount: number;
  bestTimeToVisit: string;
  highlights: string[];
}

export const DESTINATIONS_DATA: Destination[] = [
  {
    id: "manali",
    slug: "manali",
    name: "Manali & Kasol",
    tagline: "Pine forests, river streams & mountain music.",
    description: "Himachal's iconic mountain escape. Experience Old Manali cafe culture, Solang snow sports, Atal Tunnel Lahaul view, and Kasol riverside campfires.",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
    featured: true,
    toursCount: 1,
    bestTimeToVisit: "Round the Year",
    highlights: ["Atal Tunnel & Sissu", "Solang Valley Snow", "Kasol Bonfire Night", "Hadimba Temple"]
  },
  {
    id: "kedarnath",
    slug: "kedarnath",
    name: "Kedarnath Dham",
    tagline: "Isn't just a destination. It's a journey you'll remember.",
    description: "Nestled among snow-draped Himalayan mountains in Garhwal Uttarakhand, Kedarnath offers a profound spiritual trek combined with majestic nature.",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
    featured: true,
    toursCount: 3,
    bestTimeToVisit: "May to October",
    highlights: ["Himalayan Trek", "12th Jyotirlinga", "Devprayag Sangam", "Evening Aarti"]
  },
  {
    id: "spiti",
    slug: "spiti",
    name: "Spiti Valley",
    tagline: "High passes, ancient monasteries & moon lakes.",
    description: "The cold high-altitude desert of Himachal Pradesh home to ancient Tibetan monasteries, Hikkim highest post office, and turquoise Chandratal Lake.",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    featured: true,
    toursCount: 1,
    bestTimeToVisit: "June to September",
    highlights: ["Hikkim Highest Post Office", "Key Monastery", "Chandratal Lake", "Chicham Bridge"]
  },
  {
    id: "meghalaya",
    slug: "meghalaya",
    name: "Mystic Meghalaya",
    tagline: "Cloudy mountains, crystal rivers & root bridges.",
    description: "Discover Northeast India's rain paradise — transparent Umngot River in Dawki, Cherrapunjee waterfalls, and Double Decker Living Root Bridges.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    featured: true,
    toursCount: 1,
    bestTimeToVisit: "October to May",
    highlights: ["Dawki Transparent River", "Double Decker Root Bridge", "Nohkalikai Falls", "Laitlum Canyon"]
  },
  {
    id: "nepal",
    slug: "nepal",
    name: "Nepal & Muktinath",
    tagline: "Himalayan peaks, serene lakes & sacred temples.",
    description: "A breathtaking cross-border journey to Kathmandu, Pokhara, and holy Muktinath Temple amidst Annapurna and Dhaulagiri mountain views.",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    featured: false,
    toursCount: 1,
    bestTimeToVisit: "September to May",
    highlights: ["Muktinath Darshan", "Pashupatinath Temple", "Phewa Lake Boating", "Jomsom Valley"]
  },
  {
    id: "tirupati",
    slug: "tirupati",
    name: "Tirupati Balaji",
    tagline: "Divine blessings at Lord Venkateswara's abode.",
    description: "Experience divine South Indian temple heritage at Sri Venkateswara Temple Tirumala, Kalahasti Temple, and Padmavathi Temple.",
    image: "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80",
    featured: false,
    toursCount: 1,
    bestTimeToVisit: "Round the Year",
    highlights: ["Tirumala Balaji Darshan", "Shri Kalahasti Temple", "Padmavathi Temple", "ISKCON Temple"]
  }
];
