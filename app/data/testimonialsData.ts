export interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatar: string;
  trip: string;
  rating: number;
  date: string;
  quote: string;
  featured?: boolean;
}

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: "1",
    name: "Rohan & Priya Mehta",
    location: "Mumbai",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    trip: "Kedarnath Yatra",
    rating: 5,
    date: "June 2026",
    quote: "The entire trip felt like travelling with a group of close friends rather than joining a rigid tour. Sonali and her team took care of every single stay, pony booking, and hot meal. Unforgettable experience!",
    featured: true
  },
  {
    id: "2",
    name: "Ananya Deshmukh",
    location: "Pune",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    trip: "Kashmir Paradise",
    rating: 5,
    date: "May 2026",
    quote: "As a solo female traveler, safety and comfort were my biggest priorities. Travel With Sonali exceeded my expectations in every way. The houseboat stay in Srinagar was magical!",
    featured: true
  },
  {
    id: "3",
    name: "Varun Malhotra",
    location: "Delhi NCR",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    trip: "Manali & Kasol",
    rating: 5,
    date: "April 2026",
    quote: "From late-night bonfires in Kasol to driving through the Atal Tunnel, the itinerary was perfectly paced. Not a single moment felt rushed or corporate.",
    featured: true
  },
  {
    id: "4",
    name: "Dr. Kavita & Group",
    location: "Bengaluru",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    trip: "Rajasthan Heritage",
    rating: 5,
    date: "March 2026",
    quote: "The sand dunes night in Jaisalmer under stargazing skies was out of this world! Transparent pricing with zero hidden charges.",
    featured: false
  },
  {
    id: "5",
    name: "Siddharth Rao",
    location: "Hyderabad",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    trip: "Goa Tropical Escape",
    rating: 5,
    date: "November 2025",
    quote: "The secret waterfall hike in North Goa and the sunset catamaran party were highlights of my year. Super fun group crowd!",
    featured: false
  },
  {
    id: "6",
    name: "Meera & Shreya",
    location: "Ahmedabad",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    trip: "Spiti Valley Expedition",
    rating: 5,
    date: "July 2025",
    quote: "Sending postcards from world's highest post office in Hikkim with this amazing travel crew was surreal. Sonali is an incredible host!",
    featured: false
  }
];
