import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About Sonali & Our Team",
  description: "Meet Sonali Palekar and the team behind Travel With Sonali, and learn how we plan safe, small-group journeys across the Himalayas, Northeast India and Nepal.",
  path: "/about",
  image: "/images/sonali.jpg",
});

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
