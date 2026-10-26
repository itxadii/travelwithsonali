import React, { use } from "react";
import type { Metadata } from "next";
import HomeClientView from "./HomeClientView";
import { DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE, SITE_NAME } from "@/lib/seo";
import { getFeaturedTours, getInstagramSection } from "@/lib/sanity/queries";

const homeTitle = `${SITE_NAME} | Group Tours, Himalayan Treks & Yatras`;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    title: homeTitle,
    description: DEFAULT_DESCRIPTION,
    url: "/",
    siteName: SITE_NAME,
    locale: "en_IN",
    type: "website",
    images: [{ url: DEFAULT_OG_IMAGE, width: 2560, height: 1707, alt: "Travel With Sonali group trip in the mountains" }],
  },
};

export default function Home() {
  const tours = use(getFeaturedTours());
  const instagramData = use(getInstagramSection());

  return <HomeClientView tours={tours} instagramData={instagramData} />;
}
