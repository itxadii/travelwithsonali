import React, { use } from "react";
import { notFound } from "next/navigation";
import TourDetailClientView from "./TourDetailClientView";
import { getTourBySlug } from "@/lib/sanity/queries";

export default function TourDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const tour = use(getTourBySlug(resolvedParams.slug));

  if (!tour) {
    notFound();
  }

  return <TourDetailClientView tour={tour} />;
}
