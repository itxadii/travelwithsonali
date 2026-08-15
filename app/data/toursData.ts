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
    id: "kedarnath-yatra",
    slug: "kedarnath-yatra",
    title: "Kedarnath Yatra & Himalayan Serenity",
    destination: "Kedarnath",
    duration: "7 Days / 6 Nights",
    departureDate: "12 June 2027",
    price: "₹18,999",
    numericPrice: 18999,
    originalPrice: "₹22,500",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Trek to the holy shrine of Kedarnath nestled among snow-clad Himalayan peaks with an awesome group of fellow souls.",
    overview: "Experience a soulful pilgrimage and mountain adventure combined into one unforgettable 7-day journey. Travel with a close-knit group of like-minded travelers, led by experienced trek leaders, comfortably arranged transfers, and handpicked cozy stays.",
    groupSize: "12 - 16 Travellers",
    startingPoint: "Haridwar / Rishikesh",
    transport: "Tempo Traveller / Private Volvo",
    accommodation: "3 Star Hotels & Deluxe Camps",
    meals: "Breakfast & Dinner Included",
    featured: true,
    category: "Spiritual",
    itinerary: [
      {
        day: "Day 01",
        title: "Reporting at Haridwar & Drive to Guptkashi",
        description: "Assemble at Haridwar railway station early morning. Scenic drive along Mandakini & Alaknanda rivers stopping at Devprayag confluence.",
        meals: "Dinner Included",
        stay: "Hotel in Guptkashi"
      },
      {
        day: "Day 02",
        title: "Guptkashi to Gaurikund & Trek to Kedarnath Base",
        description: "Early morning drive to Gaurikund. Begin the spiritual 16km trek to Kedarnath Dham. Witness majestic valley views and waterfalls along the path.",
        meals: "Breakfast & Dinner",
        stay: "Deluxe Guest House near Kedarnath Temple"
      },
      {
        day: "Day 03",
        title: "Morning Darshan & Trek Down to Sonprayag",
        description: "Attend the morning Aarti at Kedarnath Temple surrounded by snow peaks. After breakfast, trek down to Gaurikund and drive to Sonprayag/Guptkashi.",
        meals: "Breakfast & Dinner",
        stay: "Resort in Guptkashi"
      },
      {
        day: "Day 04",
        title: "Guptkashi to Chopta & Tungnath Trek",
        description: "Drive to the 'Mini Switzerland of India' - Chopta. Easy 3.5km trek to Tungnath, the highest Shiva temple in the world, and Chandrashila Peak.",
        meals: "Breakfast & Dinner",
        stay: "Alpine Camps in Chopta"
      },
      {
        day: "Day 05",
        title: "Chopta to Rishikesh via Devprayag",
        description: "Drive back towards Rishikesh. Evening Ganga Aarti at Triveni Ghat and group dinner to share memories.",
        meals: "Breakfast & Dinner",
        stay: "Boutique Stay in Rishikesh"
      },
      {
        day: "Day 06",
        title: "Rishikesh River Rafting & Cafe Exploration",
        description: "Experience 16km river rafting on the Ganges, visit Lakshman Jhula, and spend a chill evening at iconic riverside cafes.",
        meals: "Breakfast Included",
        stay: "Boutique Stay in Rishikesh"
      },
      {
        day: "Day 07",
        title: "Bid Farewell at Haridwar",
        description: "After breakfast, transfer to Haridwar station with unforgettable memories and a tight-knit travel family.",
        meals: "Breakfast Included"
      }
    ],
    inclusions: [
      "Tempo Traveller / Bus transfers for all days",
      "6 Nights accommodation on twin/triple sharing",
      "12 Meals (6 Breakfasts + 6 Dinners)",
      "Kedarnath Trek Leader & Support Staff",
      "Medical kit & Oxy-canister backup",
      "All tolls, driver allowances, state taxes",
      "River Rafting activity in Rishikesh"
    ],
    exclusions: [
      "Train/Flight tickets to Haridwar",
      "Personal expenses (Pony/Helicopter/Mule charges)",
      "Lunch during travel days",
      "Anything not mentioned in inclusions"
    ],
    importantInfo: [
      {
        title: "Fitness & Preparation",
        details: [
          "The Kedarnath trek involves a 16 km uphill climb. Moderate fitness with regular walking is recommended.",
          "Temperatures at Kedarnath can drop below 5°C even in summer, pack thermal layers."
        ]
      },
      {
        title: "Things to Carry",
        details: [
          "Warm thermal wear, down jacket, rain poncho/umbrella",
          "Trekking shoes with good ankle support & extra woolen socks",
          "Government ID proof (Aadhaar Card / Voter ID)",
          "Personal medication & reusable water bottle"
        ]
      }
    ]
  },
  {
    id: "kashmir-paradise",
    slug: "kashmir-paradise",
    title: "Kashmir: Heaven on Earth Group Experience",
    destination: "Kashmir",
    duration: "6 Days / 5 Nights",
    departureDate: "18 May 2027",
    price: "₹24,999",
    numericPrice: 24999,
    originalPrice: "₹29,000",
    image: "https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Shikara rides on Dal Lake, snow views in Gulmarg, pine forests of Pahalgam, and starry nights in houseboats.",
    overview: "Kashmir is meant to be felt, not just seen. From sipping Kahwa on a floating wooden houseboat to riding the famous Gondola cable car in Gulmarg, this curated journey brings you the true essence of Kashmiri hospitality.",
    groupSize: "10 - 15 Travellers",
    startingPoint: "Srinagar Airport",
    transport: "Private Tempo Traveller",
    accommodation: "Luxury Houseboat & 4 Star Hotels",
    meals: "Breakfast & Dinner Included",
    featured: true,
    category: "Mountains",
    itinerary: [
      {
        day: "Day 01",
        title: "Welcome to Srinagar & Houseboat Stay",
        description: "Pickup from Srinagar airport. Check-in to a luxury Dal Lake houseboat. Enjoy a sunset Shikara ride across floating vegetable markets.",
        meals: "Dinner Included",
        stay: "Heritage Houseboat, Srinagar"
      },
      {
        day: "Day 02",
        title: "Srinagar to Gulmarg Meadow of Flowers",
        description: "Drive to Gulmarg. Experience the Asia's highest Gondola cable car ride up to Phase 2 snow point.",
        meals: "Breakfast & Dinner",
        stay: "Hotel in Gulmarg"
      },
      {
        day: "Day 03",
        title: "Gulmarg to Pahalgam Valley of Shepherds",
        description: "Drive through saffron fields and Avantipura ruins to Pahalgam. Stroll along the gushing Lidder River.",
        meals: "Breakfast & Dinner",
        stay: "Riverside Resort in Pahalgam"
      },
      {
        day: "Day 04",
        title: "Pahalgam Valleys & Betaab Valley Exploration",
        description: "Visit Aru Valley, Chandanwari, and Betaab Valley. Group bonfire and local music night.",
        meals: "Breakfast & Dinner",
        stay: "Riverside Resort in Pahalgam"
      },
      {
        day: "Day 05",
        title: "Sonamarg Meadow of Gold & Return to Srinagar",
        description: "Day excursion to Sonamarg glacier view point. Return to Srinagar for shopping in Lal Chowk.",
        meals: "Breakfast & Dinner",
        stay: "Hotel in Srinagar"
      },
      {
        day: "Day 06",
        title: "Departure from Srinagar",
        description: "Breakfast and morning visit to Mughal Gardens before airport drop.",
        meals: "Breakfast Included"
      }
    ],
    inclusions: [
      "Srinagar airport pickup & drop",
      "5 Nights accommodation (1 night Houseboat + 4 nights Hotels)",
      "10 Meals (Breakfast + Dinner)",
      "Shikara Ride on Dal Lake",
      "Group trip captain throughout",
      "All vehicle permits and taxes"
    ],
    exclusions: [
      "Airfare to/from Srinagar",
      "Gondola Phase 1 & 2 tickets (can be pre-booked)",
      "Pony/Sledge charges if taken",
      "Personal expenses"
    ],
    importantInfo: [
      {
        title: "Weather & Documents",
        details: [
          "Prepaid SIM cards do not work in J&K. Please carry a Postpaid SIM (Jio/Airtel works best).",
          "Carry valid photo ID proof (Aadhaar Card)."
        ]
      }
    ]
  },
  {
    id: "manali-solang-kasol",
    slug: "manali-solang-kasol",
    title: "Manali, Solang Valley & Kasol Backpacking",
    destination: "Manali",
    duration: "5 Days / 4 Nights",
    departureDate: "25 May 2027",
    price: "₹12,499",
    numericPrice: 12499,
    originalPrice: "₹15,000",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Pine forest walks, cafe hopping in Old Manali, Atal Tunnel snow view, Manikaran Sahib & riverside chill in Kasol.",
    overview: "The ultimate Himalayan road trip for young souls. Escape city noise, breathe alpine mountain air, explore cozy cafes, and dance under starry nights.",
    groupSize: "12 - 18 Travellers",
    startingPoint: "Delhi (Volvo AC Bus)",
    transport: "AC Volvo Bus & Local Traveller",
    accommodation: "Boutique Cottages & Kasol Camps",
    meals: "Breakfast & Dinner Included",
    featured: true,
    category: "Mountains",
    itinerary: [
      {
        day: "Day 01",
        title: "Overnight Bus Drive from Delhi to Manali",
        description: "Meet your travel crew at Majnu ka Tilla, Delhi at 6:00 PM. Board luxury AC Volvo bus for overnight journey to Manali.",
        meals: "Self",
        stay: "Overnight Volvo Bus"
      },
      {
        day: "Day 02",
        title: "Manali Arrival & Old Manali Cafe Hopping",
        description: "Check-in to Manali hotel. Visit Hadimba Temple, Jogini Waterfall trek, and chill at famous Old Manali cafes in the evening.",
        meals: "Dinner Included",
        stay: "Cottage in Old Manali"
      },
      {
        day: "Day 03",
        title: "Solang Valley, Atal Tunnel & Sissu Valley",
        description: "Drive through the engineering marvel - Atal Tunnel into Lahaul Valley (Sissu). Enjoy snow sports at Solang Valley.",
        meals: "Breakfast & Dinner",
        stay: "Cottage in Old Manali"
      },
      {
        day: "Day 04",
        title: "Manali to Kasol & Manikaran Sahib",
        description: "Drive along Parvati River to Kasol. Visit hot water springs at Manikaran Sahib. Riverside camp check-in & bonfire night.",
        meals: "Breakfast & Dinner",
        stay: "Riverside Camp in Kasol"
      },
      {
        day: "Day 05",
        title: "Chalal Village Trek & Return Journey",
        description: "Short hike to Chalal village through pine woods. Evening departure from Kasol back to Delhi.",
        meals: "Breakfast Included"
      }
    ],
    inclusions: [
      "Delhi to Delhi AC Volvo Volvo Bus tickets",
      "3 Nights stay (2 Nights Manali + 1 Night Kasol Camps)",
      "6 Meals (Breakfast + Dinner)",
      "Local sightseeing in Tempo Traveller",
      "Bonfire & Music night in Kasol"
    ],
    exclusions: [
      "Adventure sports activities (Paragliding/Zipline)",
      "Lunch & snacks",
      "Personal shopping & tips"
    ],
    importantInfo: [
      {
        title: "Essential Tips",
        details: [
          "Pack comfortable sneakers for light hikes.",
          "Keep warm jacket handy for Solang/Sissu."
        ]
      }
    ]
  },
  {
    id: "goa-tropical-escape",
    slug: "goa-tropical-escape",
    title: "Goa: Tropical Sunset & Coastal Vibe Group Trip",
    destination: "Goa",
    duration: "4 Days / 3 Nights",
    departureDate: "10 November 2027",
    price: "₹14,999",
    numericPrice: 14999,
    originalPrice: "₹18,000",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "North Goa beach hops, secret waterfall trek, catamaran sunset cruise, Latin Quarter heritage walk, and seaside parties.",
    overview: "Ditch the cliché tourist traps. Experience Goa the Sonali way — secret beaches, cozy beach shacks, sunset catamaran sailing, and unforgettable group chemistry.",
    groupSize: "10 - 16 Travellers",
    startingPoint: "Goa Airport / Thivim Station",
    transport: "Private AC Vehicle / Scooters",
    accommodation: "Boutique Pool Resort in Anjuna",
    meals: "Breakfast Included",
    featured: true,
    category: "Beaches",
    itinerary: [
      {
        day: "Day 01",
        title: "Arrival in Goa & Anjuna Sunset Meetup",
        description: "Pickup from Goa airport/railway station. Check in to our boutique resort. Sunset drinks and group icebreakers at Vagator beach cliff.",
        meals: "Welcome Drinks & Snacks",
        stay: "Boutique Pool Resort, Anjuna"
      },
      {
        day: "Day 02",
        title: "Fontainhas Heritage Walk & Sunset Catamaran Cruise",
        description: "Explore the colorful Portuguese quarters of Fontainhas in Panjim. Evening catamaran boat party with music and sunset views.",
        meals: "Breakfast Included",
        stay: "Boutique Pool Resort, Anjuna"
      },
      {
        day: "Day 03",
        title: "Hidden Waterfall Hike & Secret Beach Chill",
        description: "Morning trek into lush jungle waterfall. Relax at Arambol & Mandrem quiet beaches.",
        meals: "Breakfast Included",
        stay: "Boutique Pool Resort, Anjuna"
      },
      {
        day: "Day 04",
        title: "Brunch & Goodbye Goa",
        description: "Lazy morning brunch by the pool, souvenir shopping, and airport drop.",
        meals: "Breakfast Included"
      }
    ],
    inclusions: [
      "Airport transfers (Airport/Railway)",
      "3 Nights stay in Boutique Pool Villa/Resort",
      "Daily breakfast",
      "Private Catamaran Sunset Cruise ticket",
      "Guided Fontainhas walking tour"
    ],
    exclusions: [
      "Flight/Train fare to Goa",
      "Lunch & Dinner (Explore Goa's best cafes!)",
      "Water sports activities"
    ],
    importantInfo: [
      {
        title: "Packing List",
        details: [
          "Beachwear, sunglasses, sunscreen, flip flops.",
          "Valid Driving License if you want to rent scooters."
        ]
      }
    ]
  },
  {
    id: "rajasthan-royal-heritage",
    slug: "rajasthan-royal-heritage",
    title: "Rajasthan: Forts, Palaces & Desert Nights",
    destination: "Rajasthan",
    duration: "6 Days / 5 Nights",
    departureDate: "15 October 2027",
    price: "₹21,500",
    numericPrice: 21500,
    originalPrice: "₹25,000",
    image: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Explore Jaipur pink palaces, Jodhpur blue city streets, Sam Sand Dunes desert camping in Jaisalmer under stargazing skies.",
    overview: "Royal heritage meets golden desert magic. Experience camel safaris, folk dances around desert campfires, and majestic forts of Rajasthan.",
    groupSize: "12 - 16 Travellers",
    startingPoint: "Jaipur Airport / Station",
    transport: "AC Tempo Traveller",
    accommodation: "Heritage Haveli & Luxury Desert Camps",
    meals: "Breakfast & Dinner Included",
    featured: false,
    category: "Cultural",
    itinerary: [
      {
        day: "Day 01",
        title: "Jaipur Pink City Heritage Walk",
        description: "Pickup from Jaipur. Visit Hawa Mahal, Amer Fort, and City Palace. Evening rooftop dinner with fort view.",
        meals: "Dinner Included",
        stay: "Heritage Haveli, Jaipur"
      },
      {
        day: "Day 02",
        title: "Jaipur to Jodhpur Blue City",
        description: "Drive to Jodhpur. Explore Mehrangarh Fort towering above blue houses of the old town.",
        meals: "Breakfast & Dinner",
        stay: "Boutique Hotel, Jodhpur"
      },
      {
        day: "Day 03",
        title: "Jodhpur to Golden City Jaisalmer",
        description: "Drive across Thar desert to Jaisalmer fort. Evening walk inside the living fort.",
        meals: "Breakfast & Dinner",
        stay: "Haveli, Jaisalmer"
      },
      {
        day: "Day 04",
        title: "Sam Sand Dunes Camel Safari & Camp Night",
        description: "Sunset camel ride into dunes, Rajasthani Kalbeliya folk dance performance, and stargazing in luxury desert tents.",
        meals: "Breakfast & Dinner",
        stay: "Swiss Tents, Sam Sand Dunes"
      },
      {
        day: "Day 05",
        title: "Jaisalmer Fort & Longewala Border Post",
        description: "Visit historic Longewala border post and War Memorial.",
        meals: "Breakfast & Dinner",
        stay: "Swiss Tents, Jaisalmer"
      },
      {
        day: "Day 06",
        title: "Jodhpur / Jaipur Departure",
        description: "Transfer to airport/railway station.",
        meals: "Breakfast Included"
      }
    ],
    inclusions: [
      "AC Vehicle transfers throughout",
      "5 Nights accommodation (4 Nights Haveli + 1 Night Desert Camp)",
      "10 Meals (Breakfast + Dinner)",
      "Camel Safari & Desert Cultural Show",
      "Tour Leader support"
    ],
    exclusions: [
      "Monument entry fees & camera permits",
      "Personal expenses & shopping"
    ],
    importantInfo: [
      {
        title: "Weather Note",
        details: [
          "October to March offers pleasant day temperatures and chilly desert nights."
        ]
      }
    ]
  },
  {
    id: "spiti-valley-expedition",
    slug: "spiti-valley-expedition",
    title: "Spiti Valley: The Middle Land Offbeat Roadtrip",
    destination: "Spiti Valley",
    duration: "8 Days / 7 Nights",
    departureDate: "05 July 2027",
    price: "₹28,999",
    numericPrice: 28999,
    originalPrice: "₹34,000",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "High altitude monasteries, Key Monastery, Hikkim highest post office, Keylong & Chandratal Lake camping.",
    overview: "Traverse raw mountain passes, ancient Tibetan monasteries, cosmic clear night skies, and the turquoise blue moon lake - Chandratal.",
    groupSize: "10 - 14 Travellers",
    startingPoint: "Shimla / Manali",
    transport: "Force Traveler 4x4 / SUV",
    accommodation: "Homestays & Alpine Lake Camps",
    meals: "Breakfast & Dinner Included",
    featured: false,
    category: "Road Trips",
    itinerary: [
      {
        day: "Day 01",
        title: "Shimla to Kalpa Valley",
        description: "Drive through Kinnaur valley with views of Kinnaur Kailash peaks.",
        meals: "Dinner Included",
        stay: "Hotel in Kalpa"
      },
      {
        day: "Day 02",
        title: "Kalpa to Kaza via Nako & Tabo Monastery",
        description: "Cross high desert landscape, visit 1000-year-old Tabo Monastery.",
        meals: "Breakfast & Dinner",
        stay: "Homestay in Kaza"
      },
      {
        day: "Day 03",
        title: "Kaza Local Villages: Key, Kibber, Hikkim, Komic",
        description: "Send postcards from Hikkim - world's highest post office. Visit iconic Key Monastery.",
        meals: "Breakfast & Dinner",
        stay: "Homestay in Kaza"
      },
      {
        day: "Day 04",
        title: "Chicham Bridge & Pin Valley",
        description: "Cross Asia's highest suspension bridge Chicham and explore Pin Valley Mudh village.",
        meals: "Breakfast & Dinner",
        stay: "Homestay in Kaza"
      },
      {
        day: "Day 05",
        title: "Kaza to Chandratal Lake Camping",
        description: "Drive over Kunzum Pass to turquoise Chandratal Lake. Stargazing near lake camps.",
        meals: "Breakfast & Dinner",
        stay: "Dome Tents, Chandratal"
      },
      {
        day: "Day 06",
        title: "Chandratal to Manali via Atal Tunnel",
        description: "Drive through Batal, Rohtang pass route into lush green Manali.",
        meals: "Breakfast & Dinner",
        stay: "Hotel in Manali"
      },
      {
        day: "Day 07",
        title: "Manali Chill Day & Farewell",
        description: "Souvenir shopping and evening departure for onward journey.",
        meals: "Breakfast Included"
      }
    ],
    inclusions: [
      "4x4 / Tempo Traveller throughout Spiti loop",
      "7 Nights stay (Homestays + Camps)",
      "All meals mentioned",
      "Inner line permits & trip captain"
    ],
    exclusions: [
      "Travel to Shimla / from Manali",
      "Personal emergency expenses"
    ],
    importantInfo: [
      {
        title: "AMS & High Altitude",
        details: [
          "Spiti is above 12,000 ft. Hydrate well and avoid heavy physical strain on day 1."
        ]
      }
    ]
  }
];
