import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studio | Travel With Sonali",
  robots: { index: false, follow: false },
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
