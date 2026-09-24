"use client";

import React from "react";

interface WhatsAppFloatingButtonProps {
  tourName?: string;
  customMessage?: string;
  phoneNumber?: string;
}

export default function WhatsAppFloatingButton({
  tourName,
  customMessage,
  phoneNumber = "919152975552",
}: WhatsAppFloatingButtonProps) {
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, "");

  const defaultMsg = tourName
    ? `Hi Sonali! I am looking at the "${tourName}" tour on Travel With Sonali and would like to know more about the itinerary, dates, and booking details.`
    : `Hi Sonali! I am browsing the tours on Travel With Sonali and would like to know more details about upcoming trips.`;

  const finalMsg = customMessage || defaultMsg;
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(finalMsg)}`;

  return (
    <aside aria-label="WhatsApp quick contact" className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 lg:bottom-8 lg:right-8 z-50 flex items-center gap-3 pointer-events-auto">
      {/* Tooltip / Label */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp +91 9152975552"
        className="group relative flex items-center focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 rounded-full"
      >
        {/* Hover Pill on Desktop */}
        <span className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-sm text-[#473b37] border border-[#E8DCD5] shadow-lg text-xs font-semibold mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none whitespace-nowrap">
          <span>Chat on WhatsApp</span>
          <span className="text-[#25D366] font-bold">• Active</span>
        </span>

        {/* WhatsApp Round Floating Action Button */}
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300">
          <svg
            className="w-6 h-6 sm:w-7 sm:h-7 fill-current drop-shadow-xs"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
        </div>
      </a>
    </aside>
  );
}
