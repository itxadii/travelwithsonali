import { use } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import DestinationDetailClientView from "./DestinationDetailClientView";
import JsonLd from "@/app/components/JsonLd";
import { SITE_URL, absoluteUrl, clampDescription, pageMetadata } from "@/lib/seo";
import { getDestinationBySlug, getToursByDestination, getDestinations } from "@/lib/sanity/queries";
import { DESTINATIONS_DATA } from "@/app/data/destinationsData";

// Pre-render every destination at build time and refresh from Sanity at most once a minute
export const revalidate = 60;

export async function generateStaticParams() {
  const destinations = await getDestinations();
  const slugs = new Set([...destinations.map((d) => d.slug), ...DESTINATIONS_DATA.map((d) => d.slug)]);
  return Array.from(slugs, (slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);

  if (!destination) {
    return { title: "Destination Not Found", robots: { index: false } };
  }

  return pageMetadata({
    title: `${destination.name} Travel Guide & Group Tours`,
    description: `${destination.tagline.replace(/[.!?]+$/, "")}. Best time to visit, highlights, travel tips and upcoming group tours to ${destination.name}.`,
    path: `/destinations/${destination.slug}`,
    image: destination.image,
    imageAlt: destination.name,
  });
}

export default function DestinationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const { slug } = resolvedParams;

  const destination = use(getDestinationBySlug(slug));
  const tours = use(getToursByDestination(slug));
  const allDestinations = use(getDestinations());

  if (!destination) {
    notFound();
  }

  const relatedDestinations = allDestinations.filter((d) => d.slug !== slug).slice(0, 3);

  const url = absoluteUrl(`/destinations/${destination.slug}`);
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "TouristDestination",
      name: destination.name,
      description: clampDescription(destination.description, 300),
      url,
      image: absoluteUrl(destination.image),
      ...(destination.highlights.length > 0 && {
        includesAttraction: destination.highlights.map((h) => ({ "@type": "TouristAttraction", name: h })),
      }),
    },
    ...(destination.faqs && destination.faqs.length > 0
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: destination.faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
          },
        ]
      : []),
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Destinations", item: absoluteUrl("/destinations") },
        { "@type": "ListItem", position: 3, name: destination.name, item: url },
      ],
    },
  ];

  return (
    <>
      <JsonLd data={structuredData} />
      <DestinationDetailClientView
        destination={destination}
        tours={tours}
        relatedDestinations={relatedDestinations}
      />
    </>
  );
}
