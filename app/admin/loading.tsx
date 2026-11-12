import { CompassLoader } from "@/components/ui/compass-loader";

/** Loading state inside the admin shell, so the sidebar stays put while a page loads. */
export default function AdminLoading() {
  return <CompassLoader size={110} label="Loading…" className="min-h-[60vh]" />;
}
