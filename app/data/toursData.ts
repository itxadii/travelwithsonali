export interface Tour {
  id: string;
  slug: string;
  title: string;
  destination: string;
  duration: string;
  departureDate: string;
  price: string;
  numericPrice: number;
  originalPrice?: string;
  image: string;
  gallery: string[];
  description: string;
  overview: string;
  groupSize: string;
  startingPoint: string;
  transport: string;
  accommodation: string;
  meals: string;
  featured?: boolean;
  category: "Mountains" | "Spiritual" | "Beaches" | "Road Trips" | "Cultural";
  itinerary: {
    day: string;
    title: string;
    description: string;
    meals?: string;
    stay?: string;
  }[];
  inclusions: string[];
  exclusions: string[];
  importantInfo: {
    title: string;
    details: string[];
  }[];
}

export const TOURS_DATA: Tour[] = [
  {
    id: "manali-kasol",
    slug: "manali-kasol",
    title: "Manali & Kasol Group Trip",
    destination: "Manali & Kasol",
    duration: "5 Nights / 6 Days",
    departureDate: "Multiple Monthly Batches",
    price: "₹11,999",
    numericPrice: 11999,
    originalPrice: "₹14,999",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Himachal's perfect mix of mountains, rivers, cafés, adventure and unforgettable group experiences.",
    overview: "Explore Kasol, Manali, Kullu, Solang Valley, Sissu, Atal Tunnel, Old Manali, Manikaran, Chalal, and Jogini Waterfall with a close-knit group of fellow travelers.",
    groupSize: "10 - 15 Travellers",
    startingPoint: "Mumbai / Delhi",
    transport: "AC Semi-Sleeper Volvo & Local Vehicle",
    accommodation: "1N Riverside Stay in Kasol + 2N 3-Star Manali Hotel",
    meals: "3 Breakfasts & 3 Dinners Included",
    featured: true,
    category: "Mountains",
    itinerary: [
      {
        day: "Day 0",
        title: "Journey to Kasol from Delhi",
        description: "Pickup from Delhi in the evening. Meet fellow travelers and enjoy an overnight Volvo journey towards Parvati Valley with group games and icebreakers.",
        meals: "Self",
        stay: "Overnight Volvo Bus"
      },
      {
        day: "Day 1",
        title: "Kasol Arrival & Parvati Valley Exploration",
        description: "Check in to Kasol stay. Walk across Chalal Bridge, chill along Parvati River, visit local cafes and Manikaran Sahib hot springs. Enjoy a cozy bonfire night.",
        meals: "Dinner Included",
        stay: "Riverside / Hippie Stay in Kasol"
      },
      {
        day: "Day 2",
        title: "Kasol to Manali & Old Manali Culture",
        description: "Post breakfast, transfer to Manali. Taste local Siddu, visit Hadimba Temple, Buddhist Monastery, Mall Road, and famous Old Manali cafes.",
        meals: "Breakfast & Dinner",
        stay: "3-Star Hotel in Manali"
      },
      {
        day: "Day 3",
        title: "Solang Valley, Atal Tunnel & Sissu",
        description: "Short hike to Jogini Waterfall. Drive through the iconic Atal Tunnel into Lahaul's Sissu Valley. Enjoy ATV rides, zorbing and snow sports in Solang Valley.",
        meals: "Breakfast & Dinner",
        stay: "3-Star Hotel in Manali"
      },
      {
        day: "Day 4",
        title: "Kullu Adventure & Return Journey",
        description: "Drive along Beas River to Kullu. Experience white water river rafting and paragliding. Evening departure towards Delhi in AC Volvo.",
        meals: "Breakfast Included",
        stay: "Overnight Volvo Bus"
      },
      {
        day: "Day 5/6",
        title: "Reach Delhi / Mumbai",
        description: "Arrival in Delhi early morning. Continue onward train/flight travel to Mumbai with lifelong trip memories.",
        meals: "Self"
      }
    ],
    inclusions: [
      "1 Night Riverside / Hippie Stay in Kasol",
      "2 Nights in 3-star Valley View Manali Hotel",
      "AC Semi-Sleeper Volvo Bus between Delhi and Manali",
      "Internal transfers by Ertiga / Tempo Traveller",
      "Kasol bonfire & music night",
      "3 Breakfasts and 3 Dinners",
      "Trip Coordinator throughout"
    ],
    exclusions: [
      "Lunch & snacks",
      "Paragliding, ATV rides, River rafting fees",
      "Monument & park entry fees",
      "Room heater charges",
      "Personal expenses & mineral water"
    ],
    importantInfo: [
      {
        title: "Preparation Notes",
        details: [
          "Sleeper / AC / Double Sharing package options available.",
          "Pack warm clothes for evening temperatures in Kasol and Manali."
        ]
      }
    ]
  },
  {
    id: "char-dham-yatra",
    slug: "char-dham-yatra",
    title: "Char Dham Yatra (Yamunotri, Gangotri, Kedarnath, Badrinath)",
    destination: "Uttarakhand",
    duration: "11 Nights / 12 Days",
    departureDate: "Upcoming Seasonal Departures",
    price: "₹26,999",
    numericPrice: 26999,
    originalPrice: "₹32,000",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "A sacred Himalayan pilgrimage covering Yamunotri, Gangotri, Kedarnath and Badrinath.",
    overview: "Journey across the holy shrines of Uttarakhand: Yamunotri, Gangotri, Kedarnath, and Badrinath, passing through Mussoorie, Barkot, Uttarkashi, Guptkashi, Pipalkoti, Joshimath, and Mana Village.",
    groupSize: "12 - 18 Travellers",
    startingPoint: "Mumbai / Haridwar",
    transport: "Tempo Traveller / Deluxe Vehicle",
    accommodation: "Standard Hotels & Guest Houses across pilgrim hubs",
    meals: "8 Breakfasts & 8 Dinners (Pure Veg)",
    featured: true,
    category: "Spiritual",
    itinerary: [
      {
        day: "Day 01",
        title: "Mumbai → Haridwar → Barkot",
        description: "Pickup from Haridwar. Scenic drive to Barkot via Mussoorie and Kempty Falls. Hotel check-in and group dinner.",
        meals: "Dinner Included",
        stay: "Hotel in Barkot"
      },
      {
        day: "Day 02",
        title: "Yamunotri Darshan",
        description: "Drive to Janki Chatti. 5 km trek each way to Yamunotri Temple and Jamnabai Kund. Return to Barkot.",
        meals: "Breakfast & Dinner",
        stay: "Hotel in Barkot"
      },
      {
        day: "Day 03",
        title: "Barkot → Uttarkashi",
        description: "Visit Prakateshwar Mahadev Temple and Kashi Vishwanath Temple in Uttarkashi.",
        meals: "Breakfast & Dinner",
        stay: "Hotel in Uttarkashi"
      },
      {
        day: "Day 04",
        title: "Gangotri Darshan",
        description: "Excursion to Gangotri Temple along the holy Bhagirathi River. Darshan and return to Uttarkashi.",
        meals: "Breakfast & Dinner",
        stay: "Hotel in Uttarkashi"
      },
      {
        day: "Day 05",
        title: "Uttarkashi → Guptkashi",
        description: "Himalayan drive to Guptkashi. Visit Vishwanath & Ardhanarishwar temples.",
        meals: "Breakfast & Dinner",
        stay: "Hotel in Guptkashi"
      },
      {
        day: "Day 06",
        title: "Guptkashi → Kedarnath Trek",
        description: "Drive to Sitapur/Sonprayag. Begin 22 km trek to Kedarnath Dham. Evening Aarti at Kedarnath Temple.",
        meals: "Breakfast & Dinner",
        stay: "Guest House in Kedarnath"
      },
      {
        day: "Day 07",
        title: "Kedarnath → Guptkashi",
        description: "Morning Darshan at Kedarnath. Trek down to Sonprayag and drive back to Guptkashi.",
        meals: "Breakfast & Dinner",
        stay: "Hotel in Guptkashi"
      },
      {
        day: "Day 08",
        title: "Guptkashi → Pipalkoti / Joshimath",
        description: "Scenic mountain drive towards Pipalkoti/Joshimath with Chopta views.",
        meals: "Breakfast & Dinner",
        stay: "Hotel in Pipalkoti / Joshimath"
      },
      {
        day: "Day 09",
        title: "Badrinath & Mana Village",
        description: "Darshan at Badrinath Temple and Tapt Kund. Visit Mana - the last Indian village, Vyas Gufa, Bhim Pul & Saraswati River origin.",
        meals: "Breakfast & Dinner",
        stay: "Hotel in Pipalkoti / Joshimath"
      },
      {
        day: "Day 10-12",
        title: "Pipalkoti → Haridwar → Departure",
        description: "Visit Devprayag Sangam and Rishikesh en route to Haridwar for onward return to Mumbai.",
        meals: "Breakfast Included"
      }
    ],
    inclusions: [
      "Transfers from Haridwar in Tempo Traveller / Private Vehicle",
      "11 Nights Accommodation (Barkot, Uttarkashi, Guptkashi, Kedarnath, Pipalkoti, Haridwar)",
      "8 Breakfasts & 8 Dinners (Pure Veg)",
      "Travel Manager & Temple Darshan assistance",
      "Tolls, parking, driver allowance and fuel"
    ],
    exclusions: [
      "5% GST",
      "Pony, Doli, or Helicopter charges",
      "Personal expenses & medical insurance",
      "Natural calamity evacuation costs"
    ],
    importantInfo: [
      {
        title: "Medical & Permits",
        details: [
          "Mandatory biometric registration for Char Dham Yatra.",
          "Carry physical Aadhaar card and required personal medications."
        ]
      }
    ]
  },
  {
    id: "spiti-valley-explorer",
    slug: "spiti-valley-explorer",
    title: "Spiti Valley Explorer Road Trip",
    destination: "Spiti Valley",
    duration: "9 Nights / 10 Days",
    departureDate: "Seasonal Departure Batches",
    price: "₹22,500",
    numericPrice: 22500,
    originalPrice: "₹27,500",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "High passes, ancient monasteries, remote Himalayan villages and unforgettable off-road adventures.",
    overview: "Traverse high passes, ancient monasteries, remote Himalayan villages, and Chandratal Lake. Route: Shimla → Kalpa → Sangla → Chitkul → Nako → Gue → Tabo → Dhankar → Kaza → Kibber → Chicham → Key Monastery → Langza → Komic → Hikkim → Kunzum Pass → Chandratal → Manali.",
    groupSize: "10 - 15 Travellers",
    startingPoint: "Mumbai / Delhi",
    transport: "Delhi-Shimla & Manali-Delhi Volvo + Tempo Traveller",
    accommodation: "Standard Hotels, Kinnaur Homestays & Chandratal Camps",
    meals: "6 Breakfasts & 6 Dinners",
    featured: true,
    category: "Road Trips",
    itinerary: [
      {
        day: "Day 01",
        title: "Delhi to Shimla Drive",
        description: "Pickup from Delhi/Chandigarh and transfer to Shimla. Check in to Shimla hotel.",
        meals: "Dinner Included",
        stay: "Hotel in Shimla"
      },
      {
        day: "Day 02",
        title: "Shimla → Narkanda → Kalpa",
        description: "Drive along Hindustan-Tibet Highway through Narkanda apple orchards with views of Kinnaur Kailash.",
        meals: "Breakfast & Dinner",
        stay: "Rudra Inn Homestay in Kalpa"
      },
      {
        day: "Day 03",
        title: "Sangla & Chitkul Day Trip",
        description: "Excursion to Sangla Valley and Chitkul - India's last village on the Tibet border. Return to Kalpa.",
        meals: "Breakfast & Dinner",
        stay: "Homestay in Kalpa"
      },
      {
        day: "Day 04",
        title: "Kalpa → Nako → Gue → Tabo → Dhankar",
        description: "Visit Nako Lake, 500-year-old Gue Mummy Monastery, Tabo Monastery, and Dhankar Fort.",
        meals: "Breakfast & Dinner",
        stay: "Pema Homestay in Dhankar / Tabo"
      },
      {
        day: "Day 05",
        title: "Kaza, Key Monastery & Chicham Bridge",
        description: "Explore Kaza town, iconic Key Monastery, Kibber village, and cross Chicham Bridge.",
        meals: "Breakfast & Dinner",
        stay: "Sakya Camp / Hotel in Kaza"
      },
      {
        day: "Day 06",
        title: "Langza, Komic & Hikkim Post Office",
        description: "Visit fossil village Langza, world's highest village Komic, and mail postcards from Hikkim highest post office.",
        meals: "Breakfast & Dinner",
        stay: "Hotel in Kaza"
      },
      {
        day: "Day 07",
        title: "Kaza → Kunzum Pass → Chandratal Lake",
        description: "Off-road drive over Kunzum Pass to turquoise Chandratal Lake. Night camping and stargazing.",
        meals: "Breakfast & Dinner",
        stay: "Alpine Tents at Chandratal"
      },
      {
        day: "Day 08",
        title: "Chandratal → Atal Tunnel → Manali → Delhi",
        description: "Drive through Atal Tunnel to Manali. Evening Volvo departure for Delhi.",
        meals: "Breakfast Included",
        stay: "Overnight Volvo Bus"
      },
      {
        day: "Day 09-10",
        title: "Reach Delhi / Onward to Mumbai",
        description: "Arrive in Delhi and board onward flight/train to Mumbai.",
        meals: "Self"
      }
    ],
    inclusions: [
      "Delhi-Chandigarh and Manali-Delhi Volvo/bus",
      "Tempo Traveller for entire Spiti circuit",
      "9 Nights stay (Shimla, Kalpa, Tabo, Kaza, Chandratal camp, Manali)",
      "6 Breakfasts and 6 Dinners",
      "Inner line permits & Trip Captain guidance"
    ],
    exclusions: [
      "Lunch & mineral water",
      "Monuments & monastery entry fees",
      "Personal expenses & room heaters",
      "Unforeseen roadblock evacuation costs"
    ],
    importantInfo: [
      {
        title: "Altitude & Conditions",
        details: [
          "Spiti is a high altitude cold desert (above 12,000 ft). Hydration is crucial.",
          "Mobile connectivity is mostly BSNL / Jio in Kaza."
        ]
      }
    ]
  },
  {
    id: "nepal-muktinath",
    slug: "nepal-muktinath",
    title: "Nepal with Muktinath Spiritual & Scenic Tour",
    destination: "Nepal",
    duration: "8 Nights / 9 Days",
    departureDate: "Regular Monthly Dates",
    price: "₹24,999",
    numericPrice: 24999,
    originalPrice: "₹29,999",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "A spiritual and scenic Nepal journey covering Pokhara, Muktinath and Kathmandu.",
    overview: "Explore Nepal's most sacred temples and natural wonders: Pashupatinath, Muktinath Dham, Guheshwari, Boudhanath, Phewa Lake, Devi's Falls, Gupteshwor Cave, and Jomsom.",
    groupSize: "10 - 16 Travellers",
    startingPoint: "Mumbai / Gorakhpur",
    transport: "AC 17-Seater Tempo Traveller & Scorpio 4x4",
    accommodation: "3-Star Hotels in Kathmandu, Pokhara & Jomsom",
    meals: "Breakfast & Dinner Included",
    featured: true,
    category: "Cultural",
    itinerary: [
      {
        day: "Day 01",
        title: "Mumbai to Gorakhpur Train Journey",
        description: "Board train from Mumbai towards Gorakhpur.",
        meals: "Self",
        stay: "Overnight Train"
      },
      {
        day: "Day 02",
        title: "Gorakhpur to Pokhara Drive",
        description: "Pickup from Gorakhpur. Cross Nepal border and drive to scenic Pokhara town. Check in to hotel.",
        meals: "Dinner Included",
        stay: "Hotel Snow Peak / Similar in Pokhara"
      },
      {
        day: "Day 03",
        title: "Pokhara → Jomsom → Muktinath",
        description: "Transfer to Jomsom and drive to Muktinath Temple. Holy dip in 108 Kunda waters and temple Darshan.",
        meals: "Breakfast & Dinner",
        stay: "Hotel Saligram / Similar in Jomsom"
      },
      {
        day: "Day 04",
        title: "Jomsom to Pokhara & Sightseeing",
        description: "Return to Pokhara. Visit Gupteshwor Cave, Devi's Falls, Bindhyabasini Temple, and Phewa Lake boating.",
        meals: "Breakfast & Dinner",
        stay: "Hotel in Pokhara"
      },
      {
        day: "Day 05",
        title: "Pokhara to Kathmandu",
        description: "Drive to Kathmandu. En route optional Manakamana Temple cable car ride. Check in to Kathmandu hotel.",
        meals: "Breakfast & Dinner",
        stay: "Hotel Rudra View / Similar in Kathmandu"
      },
      {
        day: "Day 06",
        title: "Kathmandu Pilgrimage & City Tour",
        description: "Visit Pashupatinath Temple, Guheshwari Temple, Boudhanath Stupa, Budhanilkantha, and Swayambhunath Stupa.",
        meals: "Breakfast & Dinner",
        stay: "Hotel in Kathmandu"
      },
      {
        day: "Day 07-09",
        title: "Kathmandu → Gorakhpur → Mumbai",
        description: "Drive back to Gorakhpur station for return train journey to Mumbai.",
        meals: "Breakfast Included"
      }
    ],
    inclusions: [
      "Hotel Stays (2N Kathmandu, 2N Pokhara, 1N Jomsom)",
      "Breakfast and Dinner daily",
      "AC 17-Seater Tempo Traveller for Nepal transfers",
      "Pokhara–Muktinath–Pokhara Scorpio vehicle",
      "Point-to-point sightseeing & Muktinath permit"
    ],
    exclusions: [
      "Train/Flight tickets to Gorakhpur",
      "Manakamana Cable Car tickets",
      "Temple entry fees & guide tips",
      "Personal laundry & insurance"
    ],
    importantInfo: [
      {
        title: "ID Requirements",
        details: [
          "Indian citizens must carry original Voter ID card or Passport for Nepal border entry."
        ]
      }
    ]
  },
  {
    id: "mystic-meghalaya",
    slug: "mystic-meghalaya",
    title: "Mystic Meghalaya Waterfall & Cave Expedition",
    destination: "Meghalaya",
    duration: "5 Nights / 6 Days",
    departureDate: "Fixed Group Batches",
    price: "₹20,499",
    numericPrice: 20499,
    originalPrice: "₹24,500",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Cloudy mountains, crystal-clear rivers, waterfalls, caves and unforgettable Northeast adventures.",
    overview: "Explore Guwahati, Umiam Lake, Shillong, Police Bazaar, Laitlum Grand Canyon, Phe Phe Falls, Krang Suri Falls, Dawki Umngot River, Mawlynnong, Cherrapunjee, Mawsmai & Arwah Caves, Nohkalikai Falls, and the iconic Double Decker Living Root Bridge.",
    groupSize: "10 - 15 Travellers",
    startingPoint: "Guwahati Airport (12:00 PM reporting)",
    transport: "Private Vehicle Guwahati-to-Guwahati",
    accommodation: "2N Shillong Guest House + 2N Cherrapunjee + 1N Dawki Riverside Camping",
    meals: "5 Breakfasts Included",
    featured: true,
    category: "Mountains",
    itinerary: [
      {
        day: "Day 01",
        title: "Guwahati Airport → Umiam Lake → Shillong",
        description: "Pickup from Guwahati Airport at 12:00 PM. Drive along Khasi Hills stopping at Umiam Lake. Evening cafe hopping at Shillong Police Bazaar.",
        meals: "Self",
        stay: "HN Guest House, Shillong"
      },
      {
        day: "Day 02",
        title: "Shillong → Laitlum Canyon → Krang Suri → Dawki",
        description: "Visit Laitlum Grand Canyon, Phe Phe Falls & Krang Suri turquoise waterfalls. Drive to Dawki riverside camping by Bangladesh border. Evening bonfire.",
        meals: "Breakfast Included",
        stay: "Private Beachside Tents in Dawki"
      },
      {
        day: "Day 03",
        title: "Dawki Umngot River → Mawlynnong → Cherrapunjee",
        description: "Boating & kayaking on crystal clear Umngot River. Visit Mawlynnong clean village and head to rain capital Cherrapunjee.",
        meals: "Breakfast Included",
        stay: "Hilltop Homestay in Cherrapunjee"
      },
      {
        day: "Day 04",
        title: "Cherrapunjee Caves & Waterfalls Exploration",
        description: "Explore Mawsmai Cave, Arwah Cave, Wei Sawdong Falls, Nohkalikai Falls, and Seven Sisters Falls.",
        meals: "Breakfast Included",
        stay: "Cherrapunjee Homestay"
      },
      {
        day: "Day 05",
        title: "Double Decker Living Root Bridge Trek",
        description: "Trek down Tyrna to famous Double Decker Living Root Bridge, natural pools, Rainbow Falls & Blue Lagoon.",
        meals: "Breakfast Included",
        stay: "Shillong Guest House"
      },
      {
        day: "Day 06",
        title: "Kamakhya Temple & Departure from Guwahati",
        description: "Morning visit to Kamakhya Temple. Drop at Guwahati Airport by 4:00 PM for flights after 5:00 PM.",
        meals: "Breakfast Included"
      }
    ],
    inclusions: [
      "Twin/Triple/Quad sharing accommodation (2N Shillong, 2N Cherrapunjee, 1N Dawki Tents)",
      "5 Breakfasts included",
      "Private vehicle transfers Guwahati-to-Guwahati",
      "Dawki riverside bonfire night",
      "Trip Captain guidance for group departures"
    ],
    exclusions: [
      "Airfare to/from Guwahati",
      "Lunch & Dinners",
      "Entry fees to waterfalls, caves & living root bridge",
      "Boating / Kayaking charges at Dawki"
    ],
    importantInfo: [
      {
        title: "Flight Timing",
        details: [
          "Book arrival flight before 12:00 PM on Day 1 and return flight after 5:00 PM on Day 6."
        ]
      }
    ]
  },
  {
    id: "do-dham-yatra",
    slug: "do-dham-yatra",
    title: "Do Dham Yatra (Kedarnath & Badrinath)",
    destination: "Uttarakhand",
    duration: "7 Nights / 8 Days",
    departureDate: "Regular Group Dates",
    price: "₹17,999",
    numericPrice: 17999,
    originalPrice: "₹21,500",
    image: "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "A sacred Himalayan pilgrimage to Kedarnath and Badrinath.",
    overview: "Visit 12 Jyotirlinga Kedarnath and holy Badrinath. Route: Haridwar → Guptkashi → Kedarnath → Guptkashi → Pipalkoti/Joshimath → Badrinath → Haridwar.",
    groupSize: "12 - 16 Travellers",
    startingPoint: "Mumbai / Haridwar",
    transport: "Tempo Traveller / Private Vehicle",
    accommodation: "Standard Hotels & Pilgrim Guest Houses",
    meals: "Pure Vegetarian Meals Included",
    featured: false,
    category: "Spiritual",
    itinerary: [
      {
        day: "Day 01",
        title: "Haridwar Arrival & Ganga Aarti",
        description: "Pickup from Haridwar/Delhi. Ganga Aarti at Har Ki Pauri. Overnight stay in Haridwar.",
        meals: "Dinner Included",
        stay: "Hotel in Haridwar"
      },
      {
        day: "Day 02",
        title: "Haridwar → Guptkashi",
        description: "Drive via Devprayag Sangam, Rudraprayag, and Dhari Devi Temple to Guptkashi.",
        meals: "Breakfast & Dinner",
        stay: "Hotel in Guptkashi"
      },
      {
        day: "Day 03",
        title: "Guptkashi → Sonprayag → Kedarnath Trek",
        description: "Jeep to Gaurikund. 22 km trek to Kedarnath Dham. Evening Aarti at temple.",
        meals: "Breakfast & Dinner",
        stay: "Guest House in Kedarnath"
      },
      {
        day: "Day 04",
        title: "Kedarnath → Guptkashi",
        description: "Morning Darshan and trek down to Sonprayag. Return drive to Guptkashi.",
        meals: "Breakfast & Dinner",
        stay: "Hotel in Guptkashi"
      },
      {
        day: "Day 05",
        title: "Guptkashi → Pipalkoti / Joshimath",
        description: "Drive to Pipalkoti/Joshimath with optional Chopta view.",
        meals: "Breakfast & Dinner",
        stay: "Hotel in Pipalkoti / Joshimath"
      },
      {
        day: "Day 06",
        title: "Badrinath Temple & Mana Village",
        description: "Badrinath Temple Darshan, Tapt Kund, and Mana Village exploration.",
        meals: "Breakfast & Dinner",
        stay: "Hotel in Pipalkoti"
      },
      {
        day: "Day 07-08",
        title: "Pipalkoti → Haridwar → Departure",
        description: "Drive back to Haridwar for return journey to Mumbai.",
        meals: "Breakfast Included"
      }
    ],
    inclusions: [
      "Haridwar transfers in Tempo Traveller / Private Vehicle",
      "7 Nights Accommodation (Haridwar, Guptkashi, Kedarnath, Pipalkoti)",
      "Pure vegetarian meals as per itinerary",
      "Tour manager & Darshan assistance",
      "Tolls, parking, driver allowance"
    ],
    exclusions: [
      "5% GST",
      "Pony, Doli, or Helicopter charges",
      "VIP Darshan & personal pujas",
      "Personal expenses & insurance"
    ],
    importantInfo: [
      {
        title: "Important Rules",
        details: [
          "Yatra registration mandatory.",
          "Carry physical photo ID card."
        ]
      }
    ]
  },
  {
    id: "kedarnath-dham-yatra",
    slug: "kedarnath-dham-yatra",
    title: "Kedarnath Dham Spiritual Yatra",
    destination: "Kedarnath",
    duration: "6 Nights / 7 Days",
    departureDate: "Weekly Departure Batches",
    price: "₹12,999",
    numericPrice: 12999,
    originalPrice: "₹15,999",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "A spiritual Himalayan journey to the sacred Kedarnath Dham.",
    overview: "Dedicated 7-day pilgrimage journey to Kedarnath Temple covering Haridwar Ganga Aarti, Devprayag, Dhari Devi, Sonprayag, Gaurikund, and Kedarnath Darshan.",
    groupSize: "12 - 16 Travellers",
    startingPoint: "Mumbai / Haridwar",
    transport: "Train / AC Bus & Local Traveller",
    accommodation: "Hotels in Haridwar, Guptkashi & Kedarnath Stay",
    meals: "Breakfast & Dinner Included",
    featured: false,
    category: "Spiritual",
    itinerary: [
      {
        day: "Day 01",
        title: "Mumbai → Delhi → Haridwar",
        description: "Train journey from Mumbai to Delhi. Pickup and transfer to Haridwar. Evening Har Ki Pauri Ganga Aarti.",
        meals: "Dinner Included",
        stay: "Hotel in Haridwar"
      },
      {
        day: "Day 02",
        title: "Haridwar → Guptkashi",
        description: "Drive through Devprayag and Dhari Devi temple to Guptkashi.",
        meals: "Breakfast & Dinner",
        stay: "Hotel in Guptkashi"
      },
      {
        day: "Day 03",
        title: "Guptkashi → Sonprayag → Kedarnath",
        description: "Jeep to Gaurikund and begin 16 km trek to Kedarnath Temple. Attend evening Aarti.",
        meals: "Breakfast & Dinner",
        stay: "Guest House in Kedarnath"
      },
      {
        day: "Day 04",
        title: "Kedarnath → Guptkashi",
        description: "Morning Darshan at temple. Trek down to Gaurikund and return to Guptkashi.",
        meals: "Breakfast & Dinner",
        stay: "Hotel in Guptkashi"
      },
      {
        day: "Day 05-07",
        title: "Guptkashi → Delhi → Mumbai",
        description: "Drive back to Delhi railway station for train journey to Mumbai.",
        meals: "Breakfast Included"
      }
    ],
    inclusions: [
      "Haridwar/Delhi transport & local sightseeing",
      "6 Nights Stays (Haridwar, Guptkashi, Kedarnath)",
      "Breakfasts & Dinners",
      "Group coordinator & trek assistance"
    ],
    exclusions: [
      "Pony / Palki / Helicopter charges",
      "Personal expenses & VIP Darshan fees"
    ],
    importantInfo: [
      {
        title: "Packing Advice",
        details: [
          "Pack rain coat, thermal innerwear, and sturdy walking shoes."
        ]
      }
    ]
  },
  {
    id: "tirupati-balaji-yatra",
    slug: "tirupati-balaji-yatra",
    title: "Tirupati Balaji Sacred Yatra",
    destination: "Tirupati",
    duration: "4 Nights / 5 Days",
    departureDate: "Weekly Departure Batches",
    price: "₹7,499",
    numericPrice: 7499,
    originalPrice: "₹9,999",
    image: "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "A spiritual South India journey for Balaji Darshan and sacred temple experiences.",
    overview: "Explore Sri Venkateswara Temple Tirumala, Shri Kalahasti Temple, Shri Padmavathi Mata Temple, and ISKCON Temple Tirupati with seamless transfers and AC hotel stay.",
    groupSize: "12 - 20 Travellers",
    startingPoint: "Mumbai / Pune",
    transport: "Train (Sleeper/3AC) & AC Local Vehicle",
    accommodation: "Treebo Sripadhaa Residency / Similar AC Hotel",
    meals: "Breakfast & Dinner Included",
    featured: false,
    category: "Cultural",
    itinerary: [
      {
        day: "Day 01",
        title: "Mumbai / Pune → Tirupati Train Journey",
        description: "Board Train No. 12163 LTT-MAS Express at 18:40 from LTT Mumbai. Overnight train journey.",
        meals: "Self",
        stay: "Overnight Train"
      },
      {
        day: "Day 02",
        title: "Tirupati Arrival & Balaji Darshan",
        description: "Arrive at Renigunta (13:33). Hotel transfer. Sri Venkateswara Temple Tirumala Balaji Darshan.",
        meals: "Dinner Included",
        stay: "Treebo Sripadhaa Residency / Similar"
      },
      {
        day: "Day 03",
        title: "Sacred Temple Circuit",
        description: "Visit Shri Kalahasti Temple, Shri Padmavathi Mata Temple, and ISKCON Temple Tirupati.",
        meals: "Breakfast & Dinner",
        stay: "Hotel in Tirupati"
      },
      {
        day: "Day 04",
        title: "Shopping & Return Train Journey",
        description: "Morning local market shopping. Transfer to Renigunta station for Train No. 12164 departure at 20:50.",
        meals: "Breakfast Included",
        stay: "Overnight Train"
      },
      {
        day: "Day 05",
        title: "Arrival in Mumbai",
        description: "Reach LTT Mumbai around 15:55. Tour ends with divine memories.",
        meals: "Self"
      }
    ],
    inclusions: [
      "Sleeper / 3AC Class Train tickets (as per option selected)",
      "Sharing AC Vehicle for transfers & sightseeing",
      "Hotel accommodation in Tirupati",
      "Breakfast and Dinner daily",
      "Travel Insurance"
    ],
    exclusions: [
      "Darshan pass charges",
      "Personal temple puja charges & prasadam",
      "Train meals & beverages",
      "Laundry & personal tips"
    ],
    importantInfo: [
      {
        title: "Temple Rules",
        details: [
          "Original photo ID proof mandatory for temple entry.",
          "Strict traditional Indian dress code required for Tirumala Darshan."
        ]
      }
    ]
  }
];
