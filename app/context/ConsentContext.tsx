"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  CONSENT_COOKIE,
  parseConsent,
  type ConsentAction,
  type ConsentLanguage,
  type ConsentState,
} from "@/lib/consent/config";

interface ConsentContextType {
  /** null until the visitor has chosen for the current notice version */
  consent: ConsentState | null;
  /** false during SSR and the first client render, so nothing consent-gated flashes */
  ready: boolean;
  language: ConsentLanguage;
  setLanguage: (language: ConsentLanguage) => void;
  preferencesOpen: boolean;
  openPreferences: () => void;
  closePreferences: () => void;
  saveChoice: (action: ConsentAction, choice: { analytics: boolean; marketing: boolean }) => Promise<boolean>;
}

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

function readConsentCookie(): ConsentState | null {
  const match = document.cookie.split("; ").find((c) => c.startsWith(`${CONSENT_COOKIE}=`));
  return parseConsent(match?.slice(CONSENT_COOKIE.length + 1));
}

/** Removes cookies set by third-party tools so a withdrawal takes effect in this browser too. */
function clearThirdPartyCookies() {
  const host = window.location.hostname;
  const domains = ["", host, `.${host}`, `.${host.replace(/^www\./, "")}`];
  for (const cookie of document.cookie.split("; ")) {
    const name = cookie.split("=")[0];
    if (/^(_ga|_gid|_gat|_fbp|_fbc)/.test(name)) {
      for (const domain of domains) {
        document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ""}`;
      }
    }
  }
}

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<ConsentState | null>(null);
  const [ready, setReady] = useState(false);
  const [language, setLanguage] = useState<ConsentLanguage>("en");
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  useEffect(() => {
    // Cookies are only readable in the browser, so this has to run after mount
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConsent(readConsentCookie());
    setReady(true);
  }, []);

  const saveChoice = useCallback<ConsentContextType["saveChoice"]>(
    async (action, choice) => {
      try {
        const res = await fetch("/api/consent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, language, ...choice }),
        });
        if (!res.ok) return false;
        const data: { consent: ConsentState } = await res.json();

        const revoked =
          (consent?.analytics && !data.consent.analytics) || (consent?.marketing && !data.consent.marketing);
        setConsent(data.consent);
        setPreferencesOpen(false);

        if (revoked) {
          // Third-party scripts can't be unloaded, so clear their cookies and reload without them
          clearThirdPartyCookies();
          window.location.reload();
        }
        return true;
      } catch {
        return false;
      }
    },
    [consent, language]
  );

  const value = useMemo(
    () => ({
      consent,
      ready,
      language,
      setLanguage,
      preferencesOpen,
      openPreferences: () => setPreferencesOpen(true),
      closePreferences: () => setPreferencesOpen(false),
      saveChoice,
    }),
    [consent, ready, language, preferencesOpen, saveChoice]
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent() {
  const context = useContext(ConsentContext);
  if (!context) throw new Error("useConsent must be used within a ConsentProvider");
  return context;
}
