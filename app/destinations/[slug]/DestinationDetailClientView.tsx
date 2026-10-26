"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import EnquireModal from "@/app/components/EnquireModal";
import LightboxModal from "@/app/components/LightboxModal";
import WhatsAppFloatingButton from "@/app/components/WhatsAppFloatingButton";
import { Destination } from "@/app/data/destinationsData";
import { Tour } from "@/app/data/toursData";

interface DestinationDetailClientViewProps {
  destination: Destination;
  tours: Tour[];
  relatedDestinations: Destination[];
}

const WHATSAPP_NUMBER = "919152975552";

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A7244] focus-visible:ring-offset-2";

function SectionHeading({ children, aside }: { children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 mb-8">
      <h2 className="text-2xl sm:text-3xl font-serif-italic font-bold text-[#685752]">{children}</h2>
      {aside}
    </div>
  );
}

export default function DestinationDetailClientView({
  destination,
  tours,
  relatedDestinations,
}: DestinationDetailClientViewProps) {
  const [enquireOpen, setEnquireOpen] = useState(false);
  const [enquirySubject, setEnquirySubject] = useState(`${destination.name} Tour`);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxTitle, setLightboxTitle] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleOpenEnquire = (subject: string) => {
    setEnquirySubject(subject);
    setEnquireOpen(true);
  };

  const handleOpenLightbox = (src: string, title: string) => {
    setLightboxSrc(src);
    setLightboxTitle(title);
  };

  const galleryImages = destination.gallery && destination.gallery.length > 0
    ? destination.gallery
    : [destination.image];

  const facts = [
    { label: "Best time", value: destination.bestTimeToVisit },
    { label: "Ideal duration", value: destination.idealDuration },
    { label: "Altitude", value: destination.altitude },
    { label: "Getting there", value: destination.nearestAirport },
    { label: "Nearest railway", value: destination.nearestRailway },
    { label: "Network", value: destination.networkConnectivity },
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact.value));

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi Sonali, I'd like to know about upcoming trips to ${destination.name}.`
  )}`;

  return (
    <div className="min-h-screen bg-[#FDF7F4] text-[#685752] flex flex-col font-sans selection:bg-[#8EB486]/30">
      <Navbar logoName="Travel With Sonali" />

      {/* Hero */}
      <section className="relative w-full h-[70vh] min-h-[440px] max-h-[720px] bg-[#2B2321] text-white overflow-hidden">
        <Image
          src={destination.image}
          alt={destination.name}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />

        <div className="relative h-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-10 sm:pb-14">
          <nav aria-label="Breadcrumb" className="text-sm text-white/80 mb-4">
            <Link href="/destinations" className={`hover:text-white underline-offset-4 hover:underline rounded ${focusRing}`}>
              Destinations
            </Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span className="text-white">{destination.name}</span>
          </nav>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
            {destination.name}
          </h1>
          <p className="mt-3 text-lg sm:text-2xl font-serif-italic text-white/90 max-w-2xl">
            {destination.tagline}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href="#tours"
              className={`px-6 py-3 rounded-full bg-white text-[#2B2321] font-semibold text-sm hover:bg-[#F7EFEA] transition-colors ${focusRing}`}
            >
              See tours
            </a>
            <button
              type="button"
              onClick={() => handleOpenEnquire(`${destination.name} Custom Inquiry`)}
              className={`px-6 py-3 rounded-full border border-white/60 text-white font-semibold text-sm hover:bg-white/10 transition-colors cursor-pointer ${focusRing}`}
            >
              Plan a custom trip
            </button>
          </div>
        </div>
      </section>

      <main className="flex-1">
        {/* Key facts */}
        {facts.length > 0 && (
          <section className="border-b border-[#E8DCD5]">
            <dl className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10">
              {facts.map((fact) => (
                <div key={fact.label} className="py-5 border-b border-[#E8DCD5] last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0 lg:[&:nth-last-child(-n+3)]:border-b-0">
                  <dt className="text-xs uppercase tracking-wider text-[#7A6862]">{fact.label}</dt>
                  <dd className="mt-1 text-sm sm:text-base text-[#685752] font-medium">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {/* About */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-2xl sm:text-3xl font-serif-italic font-bold text-[#685752]">About {destination.name}</h2>
              {destination.heroSubtitle && (
                <p className="text-lg text-[#685752] leading-relaxed">{destination.heroSubtitle}</p>
              )}
              <p className="text-base text-[#7A6862] leading-relaxed">{destination.description}</p>

              {destination.highlights.length > 0 && (
                <div className="pt-2">
                  <h3 className="text-sm font-semibold text-[#685752] mb-3">Highlights</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm text-[#7A6862]">
                    {destination.highlights.map((h) => (
                      <li key={h} className="flex gap-2.5">
                        <span className="text-[#4A7244]" aria-hidden="true">—</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <aside className="lg:col-span-5 lg:pl-10 lg:border-l border-[#E8DCD5]">
              <blockquote className="font-serif-italic text-lg sm:text-xl text-[#685752] leading-relaxed">
                &ldquo;{destination.curatorNote?.quote || `Exploring ${destination.name} with a small group is something special. We handle the logistics so you can simply be there.`}&rdquo;
              </blockquote>
              <div className="mt-6 flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0">
                  <Image src="/images/sonali.jpg" alt="" fill sizes="44px" className="object-cover" />
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-[#685752]">{destination.curatorNote?.author || "Sonali Palekar"}</p>
                  <p className="text-[#7A6862]">{destination.curatorNote?.role || "Founder, Travel With Sonali"}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleOpenEnquire(`Personal Query: ${destination.name}`)}
                className={`mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#4A7244] hover:underline underline-offset-4 cursor-pointer rounded ${focusRing}`}
              >
                Ask Sonali a question
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </aside>
          </div>
        </section>

        {/* Experiences */}
        {destination.experiences && destination.experiences.length > 0 && (
          <section className="border-t border-[#E8DCD5]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
              <SectionHeading>What you&apos;ll experience</SectionHeading>
              <ol className="divide-y divide-[#E8DCD5] border-y border-[#E8DCD5]">
                {destination.experiences.map((exp, index) => (
                  <li key={exp.title} className="grid grid-cols-[2.5rem_1fr] sm:grid-cols-[4rem_16rem_1fr] gap-x-4 sm:gap-x-8 gap-y-1 py-6">
                    <span className="font-serif-italic text-xl text-[#8EB486] tabular-nums row-span-2 sm:row-span-1">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-base sm:text-lg font-semibold text-[#685752]">{exp.title}</h3>
                    <p className="text-sm text-[#7A6862] leading-relaxed">{exp.description}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {/* Gallery */}
        <section className="border-t border-[#E8DCD5]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <SectionHeading>Photos</SectionHeading>
            <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[160px] sm:auto-rows-[200px] gap-3">
              {galleryImages.map((img, i) => (
                <button
                  key={img}
                  type="button"
                  aria-label={`Enlarge ${destination.name} photo ${i + 1}`}
                  onClick={() => handleOpenLightbox(img, `${destination.name} - View ${i + 1}`)}
                  className={`relative overflow-hidden rounded-xl cursor-zoom-in ${focusRing} ${i === 0 ? "col-span-2 row-span-2" : ""}`}
                >
                  <Image
                    src={img}
                    alt=""
                    fill
                    sizes={i === 0 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
                    className="object-cover hover:scale-[1.03] transition-transform duration-500"
                  />
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Seasons */}
        {destination.seasons && destination.seasons.length > 0 && (
          <section className="border-t border-[#E8DCD5] bg-[#F7EFEA]/50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
              <SectionHeading>When to go</SectionHeading>
              <div className="divide-y divide-[#E8DCD5] border-y border-[#E8DCD5]">
                {destination.seasons.map((season) => (
                  <div key={season.name} className="grid grid-cols-1 sm:grid-cols-[16rem_1fr] gap-x-8 gap-y-2 py-6">
                    <div>
                      <h3 className="text-base font-semibold text-[#685752]">{season.name}</h3>
                      <p className="text-sm text-[#7A6862]">
                        {season.months} · {season.temperature}
                      </p>
                      <p className="text-xs uppercase tracking-wider text-[#4A7244] mt-1">{season.tag}</p>
                    </div>
                    <p className="text-sm text-[#7A6862] leading-relaxed">{season.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Tours */}
        <section id="tours" className="border-t border-[#E8DCD5] scroll-mt-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <SectionHeading
              aside={
                <Link href="/tours" className={`text-sm font-semibold text-[#4A7244] hover:underline underline-offset-4 shrink-0 rounded ${focusRing}`}>
                  All tours
                </Link>
              }
            >
              Tours to {destination.name}
            </SectionHeading>

            {tours.length === 0 ? (
              <div className="py-10 border-y border-[#E8DCD5] max-w-2xl">
                <p className="text-base text-[#685752] font-medium">No group dates are open for {destination.name} right now.</p>
                <p className="mt-2 text-sm text-[#7A6862] leading-relaxed">
                  We&apos;re finalising the next batch. If you&apos;re travelling with friends, family or colleagues, we can plan a private trip on your dates.
                </p>
                <button
                  type="button"
                  onClick={() => handleOpenEnquire(`${destination.name} Custom Group Departure`)}
                  className={`mt-5 px-6 py-3 rounded-full bg-[#4A7244] hover:bg-[#3F6339] text-white text-sm font-semibold transition-colors cursor-pointer ${focusRing}`}
                >
                  Ask about dates
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                {tours.map((tour) => (
                  <article key={tour.id} className="group flex flex-col">
                    <Link href={`/tours/${tour.slug}`} className={`block relative aspect-[4/3] rounded-xl overflow-hidden ${focusRing}`}>
                      <Image
                        src={tour.image}
                        alt={tour.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    </Link>
                    <div className="pt-4 flex-1 flex flex-col">
                      <p className="text-xs text-[#7A6862]">
                        {tour.duration} · From {tour.startingPoint}
                      </p>
                      <h3 className="mt-1 text-lg font-semibold text-[#685752] leading-snug">
                        <Link href={`/tours/${tour.slug}`} className="hover:text-[#4A7244] transition-colors">
                          {tour.title}
                        </Link>
                      </h3>
                      <p className="mt-2 text-sm text-[#7A6862] line-clamp-2 leading-relaxed">{tour.description}</p>
                      <div className="mt-auto pt-4 flex items-center justify-between">
                        <p className="text-sm text-[#7A6862]">
                          From <span className="text-base font-semibold text-[#685752]">{tour.price}</span>
                        </p>
                        <button
                          type="button"
                          onClick={() => handleOpenEnquire(tour.title)}
                          className={`text-sm font-semibold text-[#4A7244] hover:underline underline-offset-4 cursor-pointer rounded ${focusRing}`}
                        >
                          Enquire
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Packing & tips */}
        {(destination.packingEssentials || destination.travelTips) && (
          <section className="border-t border-[#E8DCD5]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 grid grid-cols-1 md:grid-cols-2 gap-12">
              {destination.packingEssentials && (
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif-italic font-bold text-[#685752] mb-5">What to pack</h2>
                  <ul className="space-y-2.5 text-sm text-[#7A6862]">
                    {destination.packingEssentials.map((item) => (
                      <li key={item} className="flex gap-2.5">
                        <span className="text-[#4A7244]" aria-hidden="true">—</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {destination.travelTips && (
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif-italic font-bold text-[#685752] mb-5">Good to know</h2>
                  <ul className="space-y-2.5 text-sm text-[#7A6862]">
                    {destination.travelTips.map((tip) => (
                      <li key={tip} className="flex gap-2.5">
                        <span className="text-[#4A7244]" aria-hidden="true">—</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {/* FAQ */}
        {destination.faqs && destination.faqs.length > 0 && (
          <section className="border-t border-[#E8DCD5]">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
              <SectionHeading>Questions</SectionHeading>
              <div className="divide-y divide-[#E8DCD5] border-y border-[#E8DCD5]">
                {destination.faqs.map((faq, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div key={faq.question}>
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                        aria-expanded={isOpen}
                        className={`w-full py-5 text-left flex items-center justify-between gap-4 text-base font-medium text-[#685752] hover:text-[#4A7244] transition-colors cursor-pointer ${focusRing}`}
                      >
                        <span>{faq.question}</span>
                        <ChevronDown
                          className={`w-4 h-4 shrink-0 text-[#7A6862] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                          aria-hidden="true"
                        />
                      </button>
                      {isOpen && <p className="pb-5 text-sm text-[#7A6862] leading-relaxed">{faq.answer}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Closing CTA */}
        <section className="border-t border-[#E8DCD5] bg-[#F7EFEA]/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif-italic font-bold text-[#685752]">Thinking about {destination.name}?</h2>
              <p className="mt-2 text-sm text-[#7A6862] max-w-xl">
                Join an open group batch, or tell us your dates and we&apos;ll plan a private trip for your family or friends.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => handleOpenEnquire(`${destination.name} Custom Group`)}
                className={`px-6 py-3 rounded-full bg-[#4A7244] hover:bg-[#3F6339] text-white font-semibold text-sm transition-colors cursor-pointer ${focusRing}`}
              >
                Plan my trip
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-6 py-3 rounded-full border border-[#685752]/30 text-[#685752] font-semibold text-sm hover:bg-white transition-colors ${focusRing}`}
              >
                Message on WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* Related destinations */}
        {relatedDestinations.length > 0 && (
          <section className="border-t border-[#E8DCD5]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
              <SectionHeading
                aside={
                  <Link href="/destinations" className={`text-sm font-semibold text-[#4A7244] hover:underline underline-offset-4 shrink-0 rounded ${focusRing}`}>
                    All destinations
                  </Link>
                }
              >
                More places
              </SectionHeading>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {relatedDestinations.map((d) => (
                  <Link key={d.id} href={`/destinations/${d.slug}`} className={`group block rounded-xl ${focusRing}`}>
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                      <Image
                        src={d.image}
                        alt={d.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    </div>
                    <h3 className="mt-3 text-lg font-semibold text-[#685752] group-hover:text-[#4A7244] transition-colors">{d.name}</h3>
                    <p className="text-sm text-[#7A6862] line-clamp-1">{d.tagline}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />

      <LightboxModal
        isOpen={Boolean(lightboxSrc)}
        onClose={() => setLightboxSrc(null)}
        imageSrc={lightboxSrc || ""}
        title={lightboxTitle}
        location={destination.name}
      />

      <EnquireModal
        isOpen={enquireOpen}
        onClose={() => setEnquireOpen(false)}
        defaultTourName={enquirySubject}
      />

      <WhatsAppFloatingButton />
    </div>
  );
}
