import { CompassLoader } from "@/components/ui/compass-loader";

/** Loading state inside the customer portal shell. */
export default function PortalLoading() {
  return <CompassLoader size={110} label="Loading…" className="min-h-[60vh]" />;
}
