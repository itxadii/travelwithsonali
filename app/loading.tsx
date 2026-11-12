import { CompassLoader } from "@/components/ui/compass-loader";

/**
 * Shown instantly while the next page loads (Next.js wraps every route below in this
 * Suspense fallback), so a click on any link gets immediate feedback.
 */
export default function Loading() {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#FDF7F4]">
      <CompassLoader size={150} label="Packing your next page…" showLabel />
    </div>
  );
}
