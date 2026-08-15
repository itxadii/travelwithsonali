"use client";

import React from "react";
import Image from "next/image";

interface QRCodeBadgeProps {
  label?: string;
  qrImageSrc?: string;
  size?: "md" | "lg";
}

export default function QRCodeBadge({
  label = "SCAN TO FOLLOW",
  qrImageSrc = "/qrimage.png",
  size = "lg",
}: QRCodeBadgeProps) {
  const innerSize = size === "lg" ? "w-28 h-28 sm:w-36 sm:h-36" : "w-24 h-24 sm:w-28 sm:h-28";
  const imageDim = size === "lg" ? 140 : 100;

  return (
    <a
      href={qrImageSrc}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center gap-2.5 group cursor-pointer"
      title="Scan or click to view Instagram QR code"
    >
      {/* Outer concentric circular pattern */}
      <div className="p-3 rounded-full border-2 border-[#E05328] bg-[#FAF6F0] shadow-md group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
        <div className="p-1 rounded-full border border-[#E8E1D7] bg-[#F4EFEA]">
          {/* Inner Circle with sleek black background */}
          <div className={`relative ${innerSize} rounded-full bg-black flex items-center justify-center p-2.5 sm:p-3 shadow-md overflow-hidden`}>
            <Image
              src={qrImageSrc}
              alt="Instagram QR Code"
              width={imageDim}
              height={imageDim}
              className="w-full h-full object-contain"
              priority
            />
          </div>
        </div>
      </div>

      {label && (
        <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-[#E05328] group-hover:underline transition-colors">
          {label}
        </span>
      )}
    </a>
  );
}
