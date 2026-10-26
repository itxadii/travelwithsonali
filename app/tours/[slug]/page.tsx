import React, { use } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import TourDetailClientView from "./TourDetailClientView";
import { getTourBySlug } from "@/lib/sanity/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);

  if (!tour) {
    return { title: "Tour Not Found | Travel With Sonali" };
  }

  const description = (tour.description || tour.overview || "").slice(0, 160);
  return {
    title: `${tour.title} - ${tour.duration} | Travel With Sonali`,
    description,
    openGraph: {
      title: `${tour.title} - Travel With Sonali`,
      description,
      images: tour.image ? [{ url: tour.image, width: 1200, height: 630, alt: tour.title }] : undefined,
    },
  };
}

export default function TourDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const tour = use(getTourBySlug(resolvedParams.slug));

  if (!tour) {
    notFound();
  }

  return <TourDetailClientView tour={tour} />;
}
