"use client";

import { useConsent } from "@/app/context/ConsentContext";

/** Opens the cookie preferences dialog, so consent can be changed or withdrawn from anywhere. */
export default function CookieSettingsButton({ className }: { className?: string }) {
  const { openPreferences } = useConsent();
  return (
    <button type="button" onClick={openPreferences} className={className}>
      Open cookie settings
    </button>
  );
}
