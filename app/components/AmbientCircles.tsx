"use client";

import React from "react";

interface AmbientCirclesProps {
  variant?: "1" | "2" | "3" | "4" | "5" | "minimal";
  className?: string;
}

export default function AmbientCircles({
  variant = "1",
  className = "",
}: AmbientCirclesProps) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none z-0 ${className}`}
      aria-hidden="true"
    >
      {/* VARIANT 1: Large top-right concentric ring + bottom-left glow + floating small rings */}
      {variant === "1" && (
        <>
          {/* Big Concentric Circles (Top-Right) */}
          <div className="absolute -top-24 -right-24 sm:-top-32 sm:-right-32 w-[340px] sm:w-[520px] h-[340px] sm:h-[520px] rounded-full border border-[#8EB486]/20 flex items-center justify-center animate-float-slow">
            <div className="w-[240px] sm:w-[380px] h-[240px] sm:h-[380px] rounded-full border border-dashed border-[#997C70]/20 flex items-center justify-center">
              <div className="w-[140px] sm:w-[220px] h-[140px] sm:h-[220px] rounded-full bg-[#8EB486]/5 border border-[#8EB486]/15" />
            </div>
            {/* Orbiting Satellite Dot */}
            <div className="absolute top-12 left-16 w-3.5 h-3.5 rounded-full bg-[#8EB486]/40 shadow-xs" />
          </div>

          {/* Medium Outlined Ring (Mid-Left) */}
          <div className="absolute top-1/3 -left-12 sm:-left-16 w-48 sm:w-64 h-48 sm:h-64 rounded-full border border-[#997C70]/18 flex items-center justify-center animate-float-reverse">
            <div className="w-24 sm:w-32 h-24 sm:h-32 rounded-full border border-dashed border-[#8EB486]/25" />
          </div>

          {/* Soft Gradient Ambient Circle (Bottom-Left) */}
          <div className="absolute -bottom-20 -left-16 sm:-bottom-28 sm:-left-24 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-gradient-to-tr from-[#8EB486]/10 via-[#997C70]/5 to-transparent blur-2xl animate-pulse-subtle" />

          {/* Small Scattered Circles & Dots */}
          <div className="absolute top-1/4 right-1/4 w-14 h-14 rounded-full border border-dashed border-[#8EB486]/25 animate-float-slow" />
          <div className="absolute bottom-1/3 right-12 sm:right-24 w-8 h-8 rounded-full bg-[#8EB486]/15 border border-[#8EB486]/30" />
          <div className="absolute top-2/3 left-1/3 w-3 h-3 rounded-full bg-[#997C70]/30" />
          <div className="absolute bottom-16 left-1/2 w-4 h-4 rounded-full border-2 border-[#8EB486]/30" />
          <div className="absolute top-12 left-1/4 w-2 h-2 rounded-full bg-[#8EB486]/40" />
        </>
      )}

      {/* VARIANT 2: Top-left dominant concentric ring + mid-right dashed + bottom-right orb */}
      {variant === "2" && (
        <>
          {/* Big Double Ring (Top-Left) */}
          <div className="absolute -top-28 -left-28 sm:-top-40 sm:-left-40 w-[380px] sm:w-[560px] h-[380px] sm:h-[560px] rounded-full border border-[#997C70]/18 flex items-center justify-center animate-float-slow">
            <div className="w-[260px] sm:w-[400px] h-[260px] sm:h-[400px] rounded-full border border-[#8EB486]/20 flex items-center justify-center">
              <div className="w-[160px] sm:w-[240px] h-[160px] sm:h-[240px] rounded-full border border-dashed border-[#997C70]/15" />
            </div>
            <div className="absolute bottom-16 right-20 w-4 h-4 rounded-full bg-[#8EB486]/35" />
          </div>

          {/* Mid-Right Dashed Circle */}
          <div className="absolute top-1/2 -right-16 sm:-right-20 -translate-y-1/2 w-56 sm:w-80 h-56 sm:h-80 rounded-full border border-dashed border-[#8EB486]/25 flex items-center justify-center animate-float-reverse">
            <div className="w-28 sm:w-40 h-28 sm:h-40 rounded-full bg-[#8EB486]/5 border border-[#8EB486]/20" />
          </div>

          {/* Bottom-Right Concentric Circles */}
          <div className="absolute -bottom-20 -right-20 sm:-bottom-28 sm:-right-28 w-64 sm:w-96 h-64 sm:h-96 rounded-full border border-[#997C70]/15 flex items-center justify-center animate-pulse-subtle">
            <div className="w-36 sm:w-56 h-36 sm:h-56 rounded-full border border-dashed border-[#8EB486]/25" />
          </div>

          {/* Floating Small Dots */}
          <div className="absolute top-16 right-1/3 w-10 h-10 rounded-full border border-[#8EB486]/30 bg-[#8EB486]/5 animate-float-slow" />
          <div className="absolute bottom-1/4 left-1/4 w-6 h-6 rounded-full bg-[#997C70]/20" />
          <div className="absolute top-2/3 right-1/4 w-3.5 h-3.5 rounded-full bg-[#8EB486]/40" />
          <div className="absolute bottom-10 left-1/2 w-2.5 h-2.5 rounded-full bg-[#685752]/20" />
        </>
      )}

      {/* VARIANT 3: Center-Right Arch Circle + Bottom-Left Nested Circles */}
      {variant === "3" && (
        <>
          {/* Large Center-Right Ring */}
          <div className="absolute top-1/4 -right-24 sm:-right-36 w-[360px] sm:w-[500px] h-[360px] sm:h-[500px] rounded-full border border-[#8EB486]/20 flex items-center justify-center animate-float-slow">
            <div className="w-[240px] sm:w-[340px] h-[240px] sm:h-[340px] rounded-full border border-dashed border-[#997C70]/20" />
            <div className="absolute top-20 left-12 w-3 h-3 rounded-full bg-[#8EB486]/40" />
          </div>

          {/* Bottom-Left Nested Circles */}
          <div className="absolute -bottom-24 -left-20 sm:-bottom-32 sm:-left-28 w-[320px] sm:w-[460px] h-[320px] sm:h-[460px] rounded-full border border-[#997C70]/18 flex items-center justify-center animate-float-reverse">
            <div className="w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] rounded-full bg-[#8EB486]/5 border border-[#8EB486]/15" />
          </div>

          {/* Medium Top-Center Floating Ring */}
          <div className="absolute top-8 left-1/3 w-32 sm:w-44 h-32 sm:h-44 rounded-full border border-dashed border-[#8EB486]/25 animate-pulse-subtle" />

          {/* Small Accents */}
          <div className="absolute top-1/2 left-16 sm:left-24 w-12 h-12 rounded-full border border-[#997C70]/25 bg-white/40" />
          <div className="absolute bottom-1/3 right-1/3 w-5 h-5 rounded-full bg-[#8EB486]/25" />
          <div className="absolute top-20 right-1/4 w-3 h-3 rounded-full bg-[#997C70]/30" />
          <div className="absolute bottom-12 right-12 w-4 h-4 rounded-full border border-[#8EB486]/35" />
        </>
      )}

      {/* VARIANT 4: Balanced Flanking Rings with Staggered Satellites */}
      {variant === "4" && (
        <>
          {/* Left Large Circle */}
          <div className="absolute top-1/2 -left-32 sm:-left-44 -translate-y-1/2 w-[340px] sm:w-[480px] h-[340px] sm:h-[480px] rounded-full border border-[#997C70]/20 flex items-center justify-center animate-float-slow">
            <div className="w-[220px] sm:w-[320px] h-[220px] sm:h-[320px] rounded-full border border-dashed border-[#8EB486]/25" />
          </div>

          {/* Right Large Circle */}
          <div className="absolute top-1/2 -right-32 sm:-right-44 -translate-y-1/2 w-[340px] sm:w-[480px] h-[340px] sm:h-[480px] rounded-full border border-[#8EB486]/20 flex items-center justify-center animate-float-reverse">
            <div className="w-[220px] sm:w-[320px] h-[220px] sm:h-[320px] rounded-full bg-[#8EB486]/5 border border-[#997C70]/15" />
          </div>

          {/* Top & Bottom Accent Rings */}
          <div className="absolute top-6 right-1/4 w-20 sm:w-28 h-20 sm:h-28 rounded-full border border-dashed border-[#997C70]/25 animate-pulse-subtle" />
          <div className="absolute bottom-8 left-1/3 w-16 sm:w-24 h-16 sm:h-24 rounded-full border border-[#8EB486]/30 bg-[#8EB486]/5" />

          {/* Delicate Constellation Dots */}
          <div className="absolute top-1/3 left-1/4 w-3.5 h-3.5 rounded-full bg-[#8EB486]/35" />
          <div className="absolute bottom-1/3 right-1/4 w-4 h-4 rounded-full border-2 border-[#997C70]/25" />
          <div className="absolute top-12 left-1/2 w-2 h-2 rounded-full bg-[#8EB486]/45" />
          <div className="absolute bottom-16 right-16 w-2.5 h-2.5 rounded-full bg-[#997C70]/30" />
        </>
      )}

      {/* VARIANT 5: Playful Scattered Big & Small Circles */}
      {variant === "5" && (
        <>
          {/* Giant Off-Screen Radial Wave */}
          <div className="absolute -bottom-36 left-1/2 -translate-x-1/2 w-[420px] sm:w-[640px] h-[420px] sm:h-[640px] rounded-full border border-[#8EB486]/18 flex items-center justify-center animate-pulse-subtle">
            <div className="w-[300px] sm:w-[460px] h-[300px] sm:h-[460px] rounded-full border border-dashed border-[#997C70]/18 flex items-center justify-center">
              <div className="w-[180px] sm:w-[280px] h-[180px] sm:h-[280px] rounded-full bg-[#8EB486]/5 border border-[#8EB486]/15" />
            </div>
          </div>

          {/* Top-Left Medium Double Ring */}
          <div className="absolute -top-16 -left-16 sm:-top-20 sm:-left-20 w-48 sm:w-72 h-48 sm:h-72 rounded-full border border-[#997C70]/18 flex items-center justify-center animate-float-slow">
            <div className="w-28 sm:w-44 h-28 sm:h-44 rounded-full border border-dashed border-[#8EB486]/25" />
          </div>

          {/* Top-Right Medium Floating Ring */}
          <div className="absolute top-10 right-8 sm:right-20 w-36 sm:w-52 h-36 sm:h-52 rounded-full border border-[#8EB486]/25 flex items-center justify-center animate-float-reverse">
            <div className="w-20 sm:w-28 h-20 sm:h-28 rounded-full bg-white/40" />
          </div>

          {/* Multiple Small Floating Accents */}
          <div className="absolute top-1/2 left-12 w-8 h-8 rounded-full border border-[#8EB486]/30 bg-[#8EB486]/10" />
          <div className="absolute top-1/3 right-1/3 w-12 h-12 rounded-full border border-dashed border-[#997C70]/30" />
          <div className="absolute bottom-1/4 right-16 w-5 h-5 rounded-full bg-[#8EB486]/30" />
          <div className="absolute top-24 left-1/3 w-3 h-3 rounded-full bg-[#997C70]/35" />
          <div className="absolute bottom-1/3 left-1/3 w-2.5 h-2.5 rounded-full bg-[#8EB486]/40" />
        </>
      )}

      {/* MINIMAL VARIANT: Subtle corner accents */}
      {variant === "minimal" && (
        <>
          <div className="absolute -top-20 -right-20 w-64 sm:w-80 h-64 sm:h-80 rounded-full border border-[#8EB486]/20 flex items-center justify-center animate-float-slow">
            <div className="w-36 sm:w-48 h-36 sm:h-48 rounded-full border border-dashed border-[#997C70]/18" />
          </div>
          <div className="absolute -bottom-20 -left-20 w-64 sm:w-80 h-64 sm:h-80 rounded-full border border-[#997C70]/18 flex items-center justify-center animate-float-reverse">
            <div className="w-36 sm:w-48 h-36 sm:h-48 rounded-full bg-[#8EB486]/5 border border-[#8EB486]/20" />
          </div>
          <div className="absolute top-1/2 right-12 w-4 h-4 rounded-full bg-[#8EB486]/30" />
          <div className="absolute bottom-1/3 left-16 w-3 h-3 rounded-full bg-[#997C70]/30" />
        </>
      )}
    </div>
  );
}
