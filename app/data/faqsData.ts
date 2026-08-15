export interface FAQItem {
  question: string;
  answer: string;
  category: "General" | "Tours" | "Bookings" | "Payments" | "Documents" | "Accommodation" | "Transportation" | "Cancellation";
}

export const FAQS_DATA: FAQItem[] = [
  {
    category: "Bookings",
    question: "How do I book a trip with Travel With Sonali?",
    answer: "Booking is simple and personal! Browse our upcoming tours, select your trip, and click 'Enquire Now' or 'Chat on WhatsApp'. Our team will share batch availability, itinerary PDF, seat confirmation link, and guide you step-by-step."
  },
  {
    category: "General",
    question: "Are these group tours suitable for solo travelers?",
    answer: "Yes, absolutely! Over 60% of our travelers join as solo individuals. We create a welcoming, friendly, and inclusive group dynamic from Day 1 so you'll feel like you're traveling with friends."
  },
  {
    category: "Tours",
    question: "What is included in the tour packages?",
    answer: "Our packages typically include stay in handpicked boutique hotels/camps/houseboats, private group transportation (Tempo Traveller / AC Volvo / 4x4), breakfasts & dinners, trip coordinator support, permits, and key activities like river rafting or boat cruises."
  },
  {
    category: "General",
    question: "Can I book a private or custom group trip for my friends/family?",
    answer: "Yes! If you have a group of 6+ people, we can customize a private departure on your preferred dates with your customized itinerary requirements."
  },
  {
    category: "Documents",
    question: "What documents are required for travel?",
    answer: "For domestic trips within India (Kedarnath, Kashmir, Goa, Himachal, Rajasthan), you need a valid Government Photo ID (Aadhaar Card, Passport, or Driving License). For restricted border areas like Spiti or Ladakh, we handle the required inner line permits."
  },
  {
    category: "Payments",
    question: "What is the payment schedule?",
    answer: "To lock your seat, you only pay a nominal booking advance (usually ₹3,000 to ₹5,000 per person depending on the trip). The remaining balance is paid 7 days before departure or upon arrival at the base location."
  },
  {
    category: "Cancellation",
    question: "What is the cancellation & refund policy?",
    answer: "We offer transparent cancellation policies: Cancellations made 30+ days prior to departure receive a 90% refund or 100% trip voucher for future trips. Cancellations between 15-30 days receive a 50% refund. Please check our full Cancellation Policy page for complete details."
  },
  {
    category: "Accommodation",
    question: "What kind of hotels and stays do you provide?",
    answer: "We carefully select boutique stays, riverside resorts, Swiss alpine camps, and heritage havelis that offer clean hygiene, hot water, cozy blankets, and warm hospitality. Double and triple sharing options are available."
  },
  {
    category: "Transportation",
    question: "What mode of transport is used during the trips?",
    answer: "We use modern, well-maintained AC Tempo Travellers, luxury Volvo buses, or 4x4 SUVs with experienced hill drivers who prioritize safety and smooth riding."
  }
];
