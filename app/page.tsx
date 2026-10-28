import React, { use } from "react";
import type { Metadata } from "next";
import HomeClientView from "./HomeClientView";
import { DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE, SITE_NAME } from "@/lib/seo";
import { getFeaturedTours, getInstagramSection } from "@/lib/sanity/queries";
import { getHomepageTestimonials } from "@/lib/reviews";

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
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: "A trekker resting on a Himalayan ridge at sunrise" }],
  },
};

export default function Home() {
  const tours = use(getFeaturedTours());
  const instagramData = use(getInstagramSection());
  const testimonials = use(getHomepageTestimonials());

  return <HomeClientView tours={tours} instagramData={instagramData} testimonials={testimonials} />;
}
