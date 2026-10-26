import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import JsonLd from "./components/JsonLd";
import { DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE, INSTAGRAM_URL, SITE_NAME, SITE_URL } from "@/lib/seo";
import SmoothScroll from "./components/SmoothScroll";
import { AudioProvider } from "./context/AudioContext";
import { ConsentProvider } from "./context/ConsentContext";
import CookieConsent from "./components/consent/CookieConsent";
import ConsentedTracking from "./components/consent/ConsentedTracking";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans-jakarta",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-serif-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Group Tours, Himalayan Treks & Yatras`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "group tours India",
    "Himalayan treks",
    "Kedarnath yatra",
    "Spiti Valley tour",
    "Manali Kasol trip",
    "Meghalaya tour",
    "Nepal Muktinath tour",
    "women friendly group travel",
    "Travel With Sonali",
  ],
  openGraph: {
    title: `${SITE_NAME} | Group Tours, Himalayan Treks & Yatras`,
    description: DEFAULT_DESCRIPTION,
    siteName: SITE_NAME,
    locale: "en_IN",
    type: "website",
    images: [{ url: DEFAULT_OG_IMAGE, width: 2560, height: 1707, alt: "Travel With Sonali group trip in the mountains" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Group Tours, Himalayan Treks & Yatras`,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: { index: true, follow: true },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/travelwithsonalilogo.jpg`,
  image: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
  description: DEFAULT_DESCRIPTION,
  telephone: "+91-9152975552",
  email: "travelwithsonaliinfo@gmail.com",
  founder: { "@type": "Person", name: "Sonali Palekar" },
  address: { "@type": "PostalAddress", addressLocality: "Mumbai", addressRegion: "Maharashtra", addressCountry: "IN" },
  areaServed: ["IN", "NP"],
  sameAs: [INSTAGRAM_URL],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-IN"
      className={`${plusJakartaSans.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#FDF7F4] text-[#685752]">
        <JsonLd data={organizationJsonLd} />
        <ConsentProvider>
          <AudioProvider>
            <SmoothScroll>
              {children}
            </SmoothScroll>
          </AudioProvider>
          <CookieConsent />
          <ConsentedTracking />
        </ConsentProvider>
      </body>
    </html>
  );
}
