"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { MotionConfig } from "motion/react";
import "lenis/dist/lenis.css";

interface SmoothScrollProps {
  children: React.ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  // Sanity Studio scrolls inside its own panes; Lenis would hijack the wheel there
  const isStudio = usePathname().startsWith("/studio");

  useEffect(() => {
    if (isStudio) return;
    // Respect the OS "reduce motion" setting: keep native scrolling
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      (window as unknown as { __lenis?: Lenis }).__lenis = undefined;
    };
  }, [isStudio]);

  // reducedMotion="user" makes every motion/react animation follow the OS setting
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
