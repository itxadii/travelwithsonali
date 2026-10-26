"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useConsent } from "@/app/context/ConsentContext";
import { GA_MEASUREMENT_ID, META_PIXEL_ID } from "@/lib/consent/config";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const SESSION_KEY = "tws_session";

function getSessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

/**
 * Everything that tracks visitors lives here, and nothing renders or sends
 * until the visitor has opted in to the matching category.
 */
export default function ConsentedTracking() {
  const { consent } = useConsent();
  const pathname = usePathname();
  const isFirstView = useRef(true);

  const analytics = Boolean(consent?.analytics);
  const marketing = Boolean(consent?.marketing);
  // Back-office screens are never tracked
  const isAdmin = pathname.startsWith("/admin") || pathname.startsWith("/studio");

  useEffect(() => {
    if (!analytics || isAdmin) return;

    const params = new URLSearchParams(window.location.search);
    let referrerHost: string | null = null;
    if (isFirstView.current && document.referrer) {
      try {
        const host = new URL(document.referrer).host;
        if (host !== window.location.host) referrerHost = host;
      } catch {
        // ignore malformed referrers
      }
    }
    isFirstView.current = false;

    // Only the path is sent: query strings can hold tokens (e.g. password reset links)
    fetch("/api/analytics/collect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        path: pathname,
        sessionId: getSessionId(),
        referrerHost,
        utmSource: params.get("utm_source"),
        utmMedium: params.get("utm_medium"),
        utmCampaign: params.get("utm_campaign"),
      }),
    }).catch(() => {});
    // Google Analytics records its own page views: the first via `config`, later client-side
    // navigations via GA4 enhanced measurement ("page changes based on browser history events").
  }, [analytics, isAdmin, pathname]);

  useEffect(() => {
    if (marketing && !isAdmin) window.fbq?.("track", "PageView");
  }, [marketing, isAdmin, pathname]);

  if (isAdmin) return null;

  return (
    <>
      {analytics && GA_MEASUREMENT_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
          </Script>
        </>
      )}
      {marketing && META_PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');`}
        </Script>
      )}
    </>
  );
}
