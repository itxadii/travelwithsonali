import Image from "next/image";

/**
 * Shown instantly while the next page loads (Next.js wraps every route below in this
 * Suspense fallback), so a click on any link gets immediate feedback.
 */
export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[90] flex flex-col items-center justify-center gap-5 bg-[#FDF7F4]"
    >
      <div className="relative w-20 h-20">
        {/* Rotating sage arc around the logo */}
        <svg className="absolute inset-0 w-full h-full animate-spin [animation-duration:1.1s]" viewBox="0 0 80 80" aria-hidden="true">
          <circle cx="40" cy="40" r="37" fill="none" stroke="#E8DCD5" strokeWidth="3" />
          <circle
            cx="40"
            cy="40"
            r="37"
            fill="none"
            stroke="#4A7244"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="60 173"
          />
        </svg>
        <div className="absolute inset-2 rounded-full overflow-hidden bg-white border border-[#E8DCD5]">
          <Image src="/travelwithsonalilogo.jpg" alt="" width={64} height={64} className="w-full h-full object-cover" priority />
        </div>
      </div>
      <p className="font-serif-italic text-lg text-[#685752]">Packing your next page…</p>
      <span className="sr-only">Loading</span>
    </div>
  );
}
