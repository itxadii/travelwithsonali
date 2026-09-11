import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-serif-playfair",
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Travel With Sonali - Group Experiences & Unforgettable Journeys",
  description: "Curated group tours, soulful Himalayan treks, and unforgettable travel experiences with Travel With Sonali.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#FAF6F0] text-[#1C1917]">
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
