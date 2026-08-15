export interface GalleryItem {
  id: string;
  title: string;
  location: string;
  category: "Mountains" | "Spiritual" | "Beaches" | "Group Trips" | "Road Trips" | "People";
  image: string;
  aspectRatio?: "square" | "tall" | "wide";
}

export const GALLERY_DATA: GalleryItem[] = [
  {
    id: "g1",
    title: "Kedarnath Temple Sunrise",
    location: "Uttarakhand",
    category: "Spiritual",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
    aspectRatio: "tall"
  },
  {
    id: "g2",
    title: "Dal Lake Shikara Moments",
    location: "Srinagar, Kashmir",
    category: "Mountains",
    image: "https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1200&q=80",
    aspectRatio: "wide"
  },
  {
    id: "g3",
    title: "Old Manali Cafe Vibes",
    location: "Himachal Pradesh",
    category: "Group Trips",
    image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80",
    aspectRatio: "square"
  },
  {
    id: "g4",
    title: "Catamaran Sunset Cruise",
    location: "Anjuna, Goa",
    category: "Beaches",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
    aspectRatio: "tall"
  },
  {
    id: "g5",
    title: "Thar Desert Campfire Night",
    location: "Jaisalmer, Rajasthan",
    category: "Road Trips",
    image: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1200&q=80",
    aspectRatio: "wide"
  },
  {
    id: "g6",
    title: "Group Laughs at Solang Snow Valley",
    location: "Manali",
    category: "People",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
    aspectRatio: "square"
  },
  {
    id: "g7",
    title: "Hikkim Postcard Post Office",
    location: "Spiti Valley",
    category: "Road Trips",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    aspectRatio: "tall"
  },
  {
    id: "g8",
    title: "Chopta Tungnath Trek Trail",
    location: "Uttarakhand",
    category: "Mountains",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    aspectRatio: "wide"
  },
  {
    id: "g9",
    title: "Fontainhas Colorful Alleys",
    location: "Panjim, Goa",
    category: "Beaches",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    aspectRatio: "square"
  }
];
