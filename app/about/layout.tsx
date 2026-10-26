import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Sonali & Our Team | Travel With Sonali",
  description: "Meet Sonali and the team behind Travel With Sonali, and learn how we plan safe, soulful group journeys.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
