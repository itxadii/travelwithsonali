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
    id: "kedarnath",
    slug: "kedarnath",
    name: "Kedarnath",
    tagline: "Isn't just a destination. It's a journey you'll remember.",
    description: "Nestled among snow-draped Himalayan mountains in Uttarakhand, Kedarnath offers a profound spiritual trekking experience combined with awe-inspiring nature.",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
    featured: true,
    toursCount: 3,
    bestTimeToVisit: "May to October",
    highlights: ["16km Himalayan Trek", "Ancient Shiva Temple", "Chopta Tungnath", "Devprayag Confluence"]
  },
  {
    id: "kashmir",
    slug: "kashmir",
    name: "Kashmir",
    tagline: "Paradise, but better experienced together.",
    description: "From serene Dal Lake houseboats to Gulmarg's snow peaks and Pahalgam's pine valleys, Kashmir is a dream realm of natural beauty and warm hospitality.",
    image: "https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1200&q=80",
    featured: true,
    toursCount: 4,
    bestTimeToVisit: "April to November",
    highlights: ["Shikara Ride", "Gulmarg Gondola", "Betaab Valley", "Heritage Houseboat"]
  },
  {
    id: "manali",
    slug: "manali",
    name: "Manali & Kasol",
    tagline: "Pine forests, river streams & mountain music.",
    description: "The classic Himalayan escape for adventurous youth. Enjoy Old Manali cafe culture, Solang valley snow sports, and Kasol riverside campfires.",
    image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80",
    featured: true,
    toursCount: 5,
    bestTimeToVisit: "Round the Year",
    highlights: ["Atal Tunnel Sissu", "Solang Snow Valley", "Old Manali Cafes", "Kasol Bonfire Tents"]
  },
  {
    id: "goa",
    slug: "goa",
    name: "Goa",
    tagline: "Secret waterfalls, sun-kissed shores & tropical soul.",
    description: "Experience Goa beyond the crowded beaches — discover pristine northern bays, heritage Portuguese quarters, secret jungle streams, and sunset catamaran cruises.",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
    featured: true,
    toursCount: 2,
    bestTimeToVisit: "October to April",
    highlights: ["Catamaran Sunset Cruise", "Fontainhas Walk", "Secret Waterfall Hike", "Boutique Pool Villa"]
  },
  {
    id: "rajasthan",
    slug: "rajasthan",
    name: "Rajasthan",
    tagline: "Golden dunes, royal havelis & starry desert nights.",
    description: "Immerse yourself in Jaipur's pink palaces, Jodhpur's blue alleys, and Jaisalmer's golden desert dune camping.",
    image: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1200&q=80",
    featured: false,
    toursCount: 3,
    bestTimeToVisit: "October to March",
    highlights: ["Sam Sand Dunes Camping", "Camel Safari", "Heritage Haveli Stay", "Mehrangarh Fort"]
  },
  {
    id: "spiti",
    slug: "spiti",
    name: "Spiti Valley",
    tagline: "Raw mountain passes & high-altitude moon lakes.",
    description: "The cold high-altitude desert of Himachal Pradesh home to ancient Tibetan monasteries, cosmic clear night skies, and turquoise Chandratal Lake.",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    featured: false,
    toursCount: 2,
    bestTimeToVisit: "June to September",
    highlights: ["Hikkim Highest Post Office", "Key Monastery", "Chandratal Lake", "Chicham Bridge"]
  },
  {
    id: "himachal",
    slug: "himachal",
    name: "Himachal Pradesh",
    tagline: "Valleys of green, snow-capped peaks & tranquil rivers.",
    description: "From Dharamshala Dalai Lama temple to Dalhousie pinewoods and Bir Billing paragliding sky adventures.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    featured: false,
    toursCount: 4,
    bestTimeToVisit: "Round the Year",
    highlights: ["Bir Paragliding", "McLeodganj Cafes", "Jibhi Waterfalls", "Tirthan River Stays"]
  },
  {
    id: "ladakh",
    slug: "ladakh",
    name: "Ladakh",
    tagline: "Land of high passes and endless horizon.",
    description: "Cross Khardung La pass, ride double-humped camels in Nubra Valley, and marvel at Pangong Tso Lake's changing shades of blue.",
    image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80",
    featured: false,
    toursCount: 2,
    bestTimeToVisit: "May to September",
    highlights: ["Pangong Tso Lake", "Nubra Valley Dunes", "Khardung La Pass", "Magnetic Hill"]
  }
];
