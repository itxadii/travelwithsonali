"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { InstagramSectionData } from "@/lib/sanity/types";
import { SquigglyText } from "@/components/ui/squiggly-text";

const FALLBACK_MOMENTS = [
  {
    id: 1,
    title: "Himachal High Pass",
    subtitle: "@travel_withsonali • Himachal Batch",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
    tag: "Group Batch",
    postUrl: "https://www.instagram.com/travel_withsonali",
  },
  {
    id: 2,
    title: "Manali Riverside Bliss",
    subtitle: "@travel_withsonali • Manali & Kasol",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    tag: "Mountain Retreat",
    postUrl: "https://www.instagram.com/travel_withsonali",
  },
  {
    id: 3,
    title: "Spiti Golden Sunsets",
    subtitle: "@travel_withsonali • Spiti Valley",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    tag: "Alpine Twilight",
    postUrl: "https://www.instagram.com/travel_withsonali",
  },
  {
    id: 4,
    title: "Kedarnath Divine Silence",
    subtitle: "@travel_withsonali • Sacred Trails",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    tag: "Himalayan Peace",
    postUrl: "https://www.instagram.com/travel_withsonali",
  },
  {
    id: 5,
    title: "Coastal Waves in Gokarna",
    subtitle: "@travel_withsonali • Ocean Journey",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
    tag: "Beach Sunshine",
    postUrl: "https://www.instagram.com/travel_withsonali",
  },
  {
    id: 6,
    title: "High Altitude Winter Trail",
    subtitle: "@travel_withsonali • Winter Trek",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80",
    tag: "Snow Adventure",
    postUrl: "https://www.instagram.com/travel_withsonali",
  },
  {
    id: 7,
    title: "Kasol Evening Campfire",
    subtitle: "@travel_withsonali • Community",
    image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80",
    tag: "Campfire Stories",
    postUrl: "https://www.instagram.com/travel_withsonali",
  },
];

interface InstagramRoundCarouselProps {
  data?: InstagramSectionData;
}

export default function InstagramRoundCarousel({ data }: InstagramRoundCarouselProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const badge = data?.badge || "Social Community";
  const heading = data?.heading || "Follow Our Moments on Instagram";
  const subheading = (data?.subheading || "Tag @travel_withsonali to get featured in our stories.").replace(/@travelwithsonali/gi, "@travel_withsonali");
  const instagramUrl = !data?.instagramUrl || data.instagramUrl.includes("travelwithsonali") || data.instagramUrl === "https://instagram.com"
    ? "https://www.instagram.com/travel_withsonali"
    : data.instagramUrl;
  const buttonText = (data?.buttonText || (data?.instagramHandle ? `Follow ${data.instagramHandle}` : "Follow @travel_withsonali")).replace(/@travelwithsonali/gi, "@travel_withsonali");
  const moments = data?.moments && data.moments.length > 0 ? data.moments : FALLBACK_MOMENTS;

  const cleanUrl = (url?: string) => {
    if (!url || url === "https://instagram.com" || url === "https://www.instagram.com" || url.includes("travelwithsonali")) {
      return "https://www.instagram.com/travel_withsonali";
    }
    return url;
  };

  useEffect(() => {
    let ticking = false;

    const updateScroll = () => {
      if (!sectionRef.current || !trackRef.current) return;
      const section = sectionRef.current;
      const track = trackRef.current;

      const rect = section.getBoundingClientRect();
      const windowH = window.innerHeight;
      const totalScrollable = section.offsetHeight - windowH;

      if (totalScrollable <= 0) return;

      // Calculate progress between 0 and 1 while section is pinned
      const currentScrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, currentScrolled / totalScrollable));

      // Max horizontal translation distance
      const maxTranslate = track.scrollWidth - window.innerWidth + 80;
      if (maxTranslate > 0) {
        const translateX = progress * -maxTranslate;
        track.style.transform = `translate3d(${translateX}px, 0, 0)`;
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    updateScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[220vh] sm:h-[260vh] bg-[#FDF7F4] border-t border-[#E8DCD5]"
    >
      {/* Sticky Fullscreen Container with Low Margins */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between py-3 sm:py-5 lg:py-6 overflow-hidden">
        
        {/* Section Header with Low Margin */}
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 text-center space-y-1 sm:space-y-1.5 shrink-0">
          <span className="text-[11px] sm:text-xs uppercase tracking-widest text-[#8EB486] font-bold">
            {badge}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-[#685752] tracking-tight">
            {heading.includes("Moments") || heading.includes("Movements") ? (
              <>
                Follow Our{" "}
                <SquigglyText
                  stepDuration={70}
                  scale={[4, 7]}
                  className="text-[#8EB486] font-serif-italic"
                >
                  Moments
                </SquigglyText>{" "}
                on Instagram
              </>
            ) : (
              <SquigglyText stepDuration={70} scale={[4, 7]}>
                {heading}
              </SquigglyText>
            )}
          </h2>
          <p className="text-xs sm:text-sm text-[#7A6862] max-w-lg mx-auto">
            {subheading}
          </p>
        </div>

        {/* Horizontal Carousel Track with Bigger Cards & Low Margins */}
        <div className="w-full overflow-hidden my-auto py-2">
          <div
            ref={trackRef}
            className="flex items-center gap-4 sm:gap-6 px-4 sm:px-8 will-change-transform"
            style={{
              transition: "transform 0.1s linear",
            }}
          >
            {moments.map((moment, idx) => (
              <a
                key={moment.id || idx}
                href={cleanUrl(moment.postUrl) || cleanUrl(instagramUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-[320px] sm:w-[420px] md:w-[470px] lg:w-[510px] xl:w-[540px] h-[430px] sm:h-[510px] lg:h-[560px] rounded-[28px] sm:rounded-[36px] bg-[#F7EFEA] border border-[#E8DCD5] flex flex-col justify-between p-3.5 sm:p-5 shrink-0 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer select-none"
              >
                {/* Expansive Center Image with Soft 3D Shadow */}
                <div className="relative w-full flex-1 min-h-0 rounded-2xl sm:rounded-[24px] overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.14)] mx-auto bg-stone-200">
                  <Image
                    src={moment.image}
                    alt={moment.title}
                    fill
                    sizes="(max-width: 640px) 320px, (max-width: 1024px) 470px, 540px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {/* Floating Tag Pill */}
                  {moment.tag && (
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
                      {moment.tag}
                    </div>
                  )}
                </div>

                {/* Bottom Card Footer: Icon + Title + Subtitle */}
                <div className="flex items-center gap-3 pt-3 sm:pt-4 shrink-0">
                  {/* Left Circle Icon */}
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#685752] text-white flex items-center justify-center shrink-0 shadow-sm overflow-hidden p-1.5">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="flex flex-col min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-[#685752] truncate group-hover:text-[#8EB486] transition-colors">
                      {moment.title}
                    </h3>
                    <p className="text-xs text-[#997C70] truncate">
                      {moment.subtitle?.replace(/@travelwithsonali/gi, "@travel_withsonali")}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Bottom CTA with Low Margins (Loading bar removed) */}
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 shrink-0 pb-2 sm:pb-3">
          <div className="flex items-center justify-center">
            <a
              href={cleanUrl(instagramUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-3 rounded-full border-2 border-[#8EB486] bg-white hover:bg-[#8EB486] hover:text-white text-[#8EB486] text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-300 shadow-sm hover:shadow-md active:scale-95"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <span>{buttonText}</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
