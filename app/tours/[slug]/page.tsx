import { use } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import TourDetailClientView from "./TourDetailClientView";
import JsonLd from "@/app/components/JsonLd";
import { getTourBySlug } from "@/lib/sanity/queries";
import { SITE_URL, absoluteUrl, clampDescription, pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);

  if (!tour) {
    return { title: "Tour Not Found", robots: { index: false } };
  }

  return pageMetadata({
    title: `${tour.title} (${tour.duration})`,
    description: `${tour.description || tour.overview} From ${tour.price} per person.`,
    path: `/tours/${tour.slug}`,
    image: tour.image,
    imageAlt: tour.title,
  });
}

export default function TourDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const tour = use(getTourBySlug(resolvedParams.slug));

  if (!tour) {
    notFound();
  }

  const url = absoluteUrl(`/tours/${tour.slug}`);
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "TouristTrip",
      name: tour.title,
      description: clampDescription(tour.description || tour.overview, 300),
      url,
      image: absoluteUrl(tour.image),
      touristType: "Group travellers",
      provider: { "@id": `${SITE_URL}/#organization` },
      ...(tour.itinerary.length > 0 && {
        itinerary: {
          "@type": "ItemList",
          itemListElement: tour.itinerary.map((day, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: `${day.day}: ${day.title}`,
          })),
        },
      }),
      offers: {
        "@type": "Offer",
        price: tour.numericPrice,
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        url,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Tours", item: absoluteUrl("/tours") },
        { "@type": "ListItem", position: 3, name: tour.title, item: url },
      ],
    },
  ];

  return (
    <>
      <JsonLd data={structuredData} />
      <TourDetailClientView tour={tour} />
    </>
  );
}
