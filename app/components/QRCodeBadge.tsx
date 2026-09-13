"use client";

import React from "react";
import Image from "next/image";

interface QRCodeBadgeProps {
  label?: string;
  qrImageSrc?: string;
  href?: string;
  size?: "sm" | "md" | "lg" | "3x";
  className?: string;
}

export default function QRCodeBadge({
  label = "SCAN TO FOLLOW",
  qrImageSrc = "/qrimage.png",
  href = "https://www.instagram.com/travel_withsonali",
  size = "3x",
  className = "",
}: QRCodeBadgeProps) {
  const containerSize =
    size === "3x"
      ? "w-56 h-56 sm:w-60 sm:h-60"
      : size === "lg"
      ? "w-44 h-44"
      : size === "sm"
      ? "w-20 h-20"
      : "w-32 h-32";

  const imageDim =
    size === "3x"
      ? 200
      : size === "lg"
      ? 144
      : size === "sm"
      ? 64
      : 96;

  const imageSizeClass =
    size === "3x"
      ? "w-44 h-44 sm:w-48 sm:h-48"
      : size === "lg"
      ? "w-36 h-36"
      : size === "sm"
      ? "w-16 h-16"
      : "w-24 h-24";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex flex-col items-center justify-center gap-3 group cursor-pointer ${className}`}
      title="Scan or click to visit @travel_withsonali on Instagram"
    >
      {/* Sleek Circular Black QR Container without any white/cream borders */}
      <div
        className={`relative ${containerSize} rounded-full bg-black border-2 border-[#8EB486] flex items-center justify-center shadow-2xl group-hover:scale-105 group-hover:border-[#7A9F73] transition-all duration-300 overflow-hidden`}
      >
        <Image
          src={qrImageSrc}
          alt="Instagram QR Code"
          width={imageDim}
          height={imageDim}
          className={`${imageSizeClass} object-contain`}
          priority
        />
      </div>

      {label && (
        <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-[#8EB486] group-hover:underline transition-colors text-center">
          {label}
        </span>
      )}
    </a>
  );
}
