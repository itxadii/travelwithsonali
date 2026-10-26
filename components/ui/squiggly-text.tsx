"use client";

import React, { useEffect, useId, useRef } from "react";
import { motion, useInView, useMotionValue, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface SquigglyTextProps {
  /**
   * The text (or any node) to wrap with the squiggly effect.
   */
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /**
   * Number of distinct displacement frames to cycle through.
   * Higher = smoother wobble, more SVG filters in the DOM.
   * @default 5
   */
  steps?: number;
  /**
   * Time between filter swaps, in milliseconds.
   * Lower = more frantic; higher = lazier wave.
   * @default 80
   */
  stepDuration?: number;
  /**
   * Maximum displacement in px. Bigger = more squiggly.
   * Pass a single number for a constant scale, or a tuple to alternate
   * between two values per step (matches the original Lucas Bebber demo).
   * @default [6, 8]
   */
  scale?: number | [number, number];
  /**
   * Turbulence base frequency. Lower values produce longer, smoother waves;
   * higher values produce tighter, jitterier noise.
   * @default 0.02
   */
  baseFrequency?: number;
  /**
   * Number of turbulence octaves. Higher = more detailed noise.
   * @default 3
   */
  numOctaves?: number;
  /**
   * Render the wrapper as this element type.
   * @default "span"
   */
  as?: "span" | "div";
}

export function SquigglyText({
  children,
  steps = 5,
  stepDuration = 80,
  scale = [6, 8],
  baseFrequency = 0.02,
  numOctaves = 3,
  as = "span",
  className,
  style,
}: SquigglyTextProps) {
  const reactId = useId();
  // useId can produce ":" / "_" which aren't valid in CSS url(#.) refs.
  const safeId = reactId.replace(/[:_]/g, "");
  const filterId = (i: number) => `squiggly-${safeId}-${i}`;

  const filters = React.useMemo(
    () => Array.from({ length: steps }, (_, i) => `url(#${filterId(i)})`),
    // filterId is stable per render
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [steps, safeId],
  );

  // Only animate while on screen: each swap re-rasterises the text through an SVG
  // turbulence filter, which is expensive on phones when many headings run at once.
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: "100px" });
  const reduceMotion = useReducedMotion();
  const filter = useMotionValue(filters[0]);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    let step = 0;
    const id = window.setInterval(() => {
      step = (step + 1) % filters.length;
      filter.set(filters[step]);
    }, stepDuration);
    return () => window.clearInterval(id);
  }, [inView, reduceMotion, filters, stepDuration, filter]);

  const scaleAt = (i: number) =>
    Array.isArray(scale) ? scale[i % scale.length] : scale;

  const Wrapper = as === "div" ? motion.div : motion.span;

  return (
    <Wrapper
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      style={{ filter, ...style }}
      className={cn("inline-block", className)}
    >
      <svg
        aria-hidden
        className="pointer-events-none absolute h-0 w-0 overflow-hidden"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {Array.from({ length: steps }).map((_, i) => (
            <filter id={filterId(i)} key={i}>
              <feTurbulence
                baseFrequency={baseFrequency}
                numOctaves={numOctaves}
                result="noise"
                seed={i}
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale={scaleAt(i)}
              />
            </filter>
          ))}
        </defs>
      </svg>
      {children}
    </Wrapper>
  );
}
