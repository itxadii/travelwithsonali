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
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Position & Gesture Tracking
  const translateXRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const directionLockedRef = useRef<"horizontal" | "vertical" | null>(null);
  const hasMovedRef = useRef<boolean>(false);
  const suppressClickRef = useRef<boolean>(false);

  const pointerStartXRef = useRef<number>(0);
  const pointerStartYRef = useRef<number>(0);
  const lastPointerXRef = useRef<number>(0);
  const pointerStartTimeRef = useRef<number>(0);
  const activePointerIdRef = useRef<number | null>(null);

  const scrollRafIdRef = useRef<number | null>(null);
  const momentumTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const wheelTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const suppressClickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const badge = data?.badge || "Social Community";
  const heading = data?.heading || "Follow Our Moments on Instagram";
  const subheading = (data?.subheading || "Tag @travel_withsonali to get featured in our stories.").replace(
    /@travelwithsonali/gi,
    "@travel_withsonali"
  );
  const instagramUrl =
    !data?.instagramUrl || data.instagramUrl.includes("travelwithsonali") || data.instagramUrl === "https://instagram.com"
      ? "https://www.instagram.com/travel_withsonali"
      : data.instagramUrl;
  const buttonText = (
    data?.buttonText || (data?.instagramHandle ? `Follow ${data.instagramHandle}` : "Follow @travel_withsonali")
  ).replace(/@travelwithsonali/gi, "@travel_withsonali");
  const moments = data?.moments && data.moments.length > 0 ? data.moments : FALLBACK_MOMENTS;

  const cleanUrl = (url?: string) => {
    if (!url || url === "https://instagram.com" || url === "https://www.instagram.com" || url.includes("travelwithsonali")) {
      return "https://www.instagram.com/travel_withsonali";
    }
    return url;
  };

  useEffect(() => {
    let ticking = false;

    // The page's vertical scroll position is the primary source of truth for
    // the horizontal track position when scrolling normally.
    const updateTrackFromScroll = () => {
      if (!sectionRef.current || !trackRef.current) return;

      // Do not overwrite position while the user is actively dragging the cards horizontally
      if (isDraggingRef.current) return;

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
      const maxTranslate = Math.max(0, track.scrollWidth - window.innerWidth + 80);
      if (maxTranslate > 0) {
        const targetX = progress * -maxTranslate;
        translateXRef.current = targetX;
        track.style.transform = `translate3d(${targetX}px, 0, 0)`;
      }
    };

    const updateScroll = () => {
      // Scheduler fix: reset ticking at the beginning of animation frame to prevent starvation
      ticking = false;
      scrollRafIdRef.current = null;
      updateTrackFromScroll();
    };

    const onScroll = () => {
      if (!ticking) {
        scrollRafIdRef.current = window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    const getSectionMetrics = () => {
      if (!sectionRef.current || !trackRef.current) return;
      const section = sectionRef.current;
      const track = trackRef.current;

      const rect = section.getBoundingClientRect();
      const windowH = window.innerHeight;
      const totalScrollable = section.offsetHeight - windowH;
      if (totalScrollable <= 0) return;

      const maxTranslate = Math.max(0, track.scrollWidth - window.innerWidth + 80);
      if (maxTranslate <= 0) return;

      const isActive = rect.top <= 10 && rect.top >= -totalScrollable - 10;
      if (!isActive) return;

      return { rect, totalScrollable, maxTranslate };
    };

    const applyHorizontalDelta = (deltaX: number) => {
      const metrics = getSectionMetrics();
      if (!metrics) return;

      const { rect, totalScrollable, maxTranslate } = metrics;
      const sectionDocTop = window.scrollY + rect.top;
      const currentScrolled = Math.max(0, Math.min(totalScrollable, -rect.top));

      const scrollDelta = deltaX * (totalScrollable / maxTranslate);
      const newScrolled = Math.max(0, Math.min(totalScrollable, currentScrolled + scrollDelta));

      const targetScrollY = Math.round(sectionDocTop + newScrolled);
      if (Math.abs(window.scrollY - targetScrollY) >= 1) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const lenis = (window as any).__lenis;
        if (lenis && typeof lenis.scrollTo === "function") {
          lenis.scrollTo(targetScrollY, { immediate: true });
        } else {
          window.scrollTo({
            top: targetScrollY,
            behavior: "instant" as ScrollBehavior,
          });
        }
      }

      // Sync transform and internal tracking position
      updateTrackFromScroll();
    };

    // Desktop trackpad horizontal wheel handler
    const onWheel = (e: WheelEvent) => {
      // A small vertical component is common in trackpad gestures. Require a
      // clear horizontal majority so ordinary wheel scrolling is untouched.
      const horizontalIntent = Math.abs(e.deltaX) > Math.abs(e.deltaY) * 1.15;
      if (!horizontalIntent || !getSectionMetrics()) return;

      if (e.cancelable) e.preventDefault();
      if (trackRef.current) trackRef.current.style.transition = "none";
      applyHorizontalDelta(e.deltaX);

      if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
      wheelTimeoutRef.current = setTimeout(() => {
        if (trackRef.current && !isDraggingRef.current) {
          trackRef.current.style.transition = "transform 0.1s linear";
        }
      }, 100);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", onWheel, { passive: false });
    }

    updateScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (container) {
        container.removeEventListener("wheel", onWheel);
      }
      if (scrollRafIdRef.current !== null) {
        window.cancelAnimationFrame(scrollRafIdRef.current);
        scrollRafIdRef.current = null;
      }
      if (momentumTimeoutRef.current) {
        clearTimeout(momentumTimeoutRef.current);
      }
      if (wheelTimeoutRef.current) {
        clearTimeout(wheelTimeoutRef.current);
      }
      if (suppressClickTimeoutRef.current) {
        clearTimeout(suppressClickTimeoutRef.current);
      }
    };
  }, []);

  // Direct Horizontal Swipe / Drag Handlers (Pointer Events)
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!e.isPrimary) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;

    if (momentumTimeoutRef.current) {
      clearTimeout(momentumTimeoutRef.current);
      momentumTimeoutRef.current = null;
    }

    pointerStartXRef.current = e.clientX;
    pointerStartYRef.current = e.clientY;
    lastPointerXRef.current = e.clientX;
    pointerStartTimeRef.current = performance.now();
    activePointerIdRef.current = e.pointerId;
    directionLockedRef.current = null;
    hasMovedRef.current = false;
    isDraggingRef.current = false;
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current !== e.pointerId) return;

    const diffX = e.clientX - pointerStartXRef.current;
    const diffY = e.clientY - pointerStartYRef.current;

    // Detect gesture intent once finger movement exceeds deadband
    if (!directionLockedRef.current) {
      if (Math.abs(diffX) < 8 && Math.abs(diffY) < 8) return;

      if (Math.abs(diffX) >= Math.abs(diffY)) {
        // Horizontal gesture locked: capture pointer and drive track translation
        directionLockedRef.current = "horizontal";
        isDraggingRef.current = true;
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
          // Pointer capture may not be supported on all targets; continue gracefully
        }
        if (trackRef.current) {
          trackRef.current.style.transition = "none";
        }
      } else {
        // Vertical gesture intent: let native page scroll handle it
        directionLockedRef.current = "vertical";
        return;
      }
    }

    if (directionLockedRef.current === "horizontal") {
      if (!trackRef.current || !sectionRef.current) return;
      hasMovedRef.current = true;

      const stepDeltaX = e.clientX - lastPointerXRef.current;
      lastPointerXRef.current = e.clientX;

      const maxTranslate = Math.max(0, trackRef.current.scrollWidth - window.innerWidth + 80);
      // Instant 1:1 finger tracking clamped within carousel boundaries
      translateXRef.current = Math.max(-maxTranslate, Math.min(0, translateXRef.current + stepDeltaX));
      trackRef.current.style.transform = `translate3d(${translateXRef.current}px, 0, 0)`;
    }
  };

  const handleDragCancel = () => {
    isDraggingRef.current = false;
    directionLockedRef.current = null;
    activePointerIdRef.current = null;

    if (trackRef.current) {
      trackRef.current.style.transition = "transform 0.1s linear";
    }

    // Suppress accidental card clicks if finger dragged
    if (hasMovedRef.current) {
      suppressClickRef.current = true;
      if (suppressClickTimeoutRef.current) clearTimeout(suppressClickTimeoutRef.current);
      suppressClickTimeoutRef.current = setTimeout(() => {
        suppressClickRef.current = false;
      }, 300);
    }
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current !== e.pointerId) return;
    activePointerIdRef.current = null;

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Capture already released
    }

    if (directionLockedRef.current === "horizontal") {
      isDraggingRef.current = false;
      directionLockedRef.current = null;

      const track = trackRef.current;
      const section = sectionRef.current;

      if (track && section) {
        const maxTranslate = Math.max(0, track.scrollWidth - window.innerWidth + 80);
        const elapsed = Math.max(1, performance.now() - pointerStartTimeRef.current);
        const totalDiffX = lastPointerXRef.current - pointerStartXRef.current;
        const velocityX = totalDiffX / elapsed;

        // Apply smooth momentum glide if user flicked with velocity
        if (Math.abs(velocityX) > 0.25 && maxTranslate > 0) {
          const momentumDistance = velocityX * 220;
          translateXRef.current = Math.max(-maxTranslate, Math.min(0, translateXRef.current + momentumDistance));
          track.style.transition = "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)";
          track.style.transform = `translate3d(${translateXRef.current}px, 0, 0)`;

          momentumTimeoutRef.current = setTimeout(() => {
            if (trackRef.current && !isDraggingRef.current) {
              trackRef.current.style.transition = "transform 0.1s linear";
            }
          }, 350);
        } else {
          track.style.transition = "transform 0.1s linear";
        }

        // When section is pinned, cleanly sync vertical page scroll position once gesture completes
        const rect = section.getBoundingClientRect();
        const windowH = window.innerHeight;
        const totalScrollable = section.offsetHeight - windowH;
        if (rect.top <= 10 && rect.top >= -totalScrollable - 10 && maxTranslate > 0 && totalScrollable > 0) {
          const progress = -translateXRef.current / maxTranslate;
          const sectionDocTop = window.scrollY + rect.top;
          const targetScrollY = Math.round(sectionDocTop + progress * totalScrollable);
          if (Math.abs(window.scrollY - targetScrollY) >= 2) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const lenis = (window as any).__lenis;
            if (lenis && typeof lenis.scrollTo === "function") {
              lenis.scrollTo(targetScrollY, { immediate: true });
            } else {
              window.scrollTo({
                top: targetScrollY,
                behavior: "instant" as ScrollBehavior,
              });
            }
          }
        }
      }

      // Suppress accidental card clicks if finger dragged
      if (hasMovedRef.current) {
        suppressClickRef.current = true;
        if (suppressClickTimeoutRef.current) clearTimeout(suppressClickTimeoutRef.current);
        suppressClickTimeoutRef.current = setTimeout(() => {
          suppressClickRef.current = false;
        }, 300);
      }
    } else {
      isDraggingRef.current = false;
      directionLockedRef.current = null;
    }
  };

  const onPointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current !== null && activePointerIdRef.current !== e.pointerId) return;

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Capture already released
    }

    handleDragCancel();
  };

  const onLostPointerCapture = (e: React.PointerEvent<HTMLDivElement>) => {
    // If activePointerIdRef is null and not dragging, pointerup already completed normally.
    // Safe, idempotent cleanup: do not interrupt completed-gesture synchronization or momentum.
    if (!isDraggingRef.current && activePointerIdRef.current === null) return;
    if (activePointerIdRef.current !== null && activePointerIdRef.current !== e.pointerId) return;

    handleDragCancel();
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[220vh] sm:h-[260vh] bg-[#FDF7F4] border-t border-[#E8DCD5]"
    >
      {/* Sticky Fullscreen Container with touch-action: pan-y and unified Pointer Events */}
      <div
        ref={containerRef}
        data-lenis-prevent-touch
        style={{ touchAction: "pan-y" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onLostPointerCapture={onLostPointerCapture}
        className="sticky top-0 h-screen w-full flex flex-col justify-between py-3 sm:py-5 lg:py-6 overflow-hidden select-none"
      >
        {/* Section Header */}
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

        {/* Horizontal Carousel Track */}
        <div className="w-full overflow-hidden my-auto py-2">
          <div
            ref={trackRef}
            style={{ touchAction: "pan-y", transition: "transform 0.1s linear" }}
            className="flex items-center gap-4 sm:gap-6 px-4 sm:px-8 will-change-transform"
          >
            {moments.map((moment, idx) => (
              <a
                key={moment.id || idx}
                href={cleanUrl(moment.postUrl) || cleanUrl(instagramUrl)}
                target="_blank"
                rel="noopener noreferrer"
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                onClick={(e) => {
                  if (suppressClickRef.current) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
                style={{ touchAction: "pan-y" }}
                className="group w-[320px] sm:w-[420px] md:w-[470px] lg:w-[510px] xl:w-[540px] h-[430px] sm:h-[510px] lg:h-[560px] rounded-[28px] sm:rounded-[36px] bg-[#F7EFEA] border border-[#E8DCD5] flex flex-col justify-between p-3.5 sm:p-5 shrink-0 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer select-none"
              >
                {/* Center Image */}
                <div className="relative w-full flex-1 min-h-0 rounded-2xl sm:rounded-[24px] overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.14)] mx-auto bg-stone-200">
                  <Image
                    src={moment.image}
                    alt={moment.title}
                    fill
                    draggable={false}
                    sizes="(max-width: 640px) 320px, (max-width: 1024px) 470px, 540px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out select-none pointer-events-none"
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
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#685752] text-white flex items-center justify-center shrink-0 shadow-sm overflow-hidden p-1.5">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </div>

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

        {/* Bottom CTA */}
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
