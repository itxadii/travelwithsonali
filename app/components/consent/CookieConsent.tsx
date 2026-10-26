"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cookie, X, Check } from "lucide-react";
import { useConsent } from "@/app/context/ConsentContext";
import { useEscapeKey } from "@/lib/useEscapeKey";
import { CONSENT_COPY, type CategoryCopy } from "@/lib/consent/copy";
import {
  CONSENT_VERSION,
  DPB_COMPLAINT_URL,
  GA_MEASUREMENT_ID,
  GRIEVANCE_EMAIL,
  MARKETING_ENABLED,
  type ConsentAction,
  type ConsentLanguage,
} from "@/lib/consent/config";
import { cn } from "@/lib/utils";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A7244] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFFDF9]";

/** Accept and Reject share the same size and weight, so neither choice is nudged. */
const choiceButton = cn(
  "flex-1 min-h-11 px-5 py-2.5 rounded-full text-sm font-bold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
  focusRing
);

function LanguageToggle() {
  const { language, setLanguage } = useConsent();
  return (
    <div role="group" aria-label="Language / भाषा" className="inline-flex rounded-full border border-[#E8DCD5] bg-white p-0.5 text-xs font-semibold">
      {(Object.keys(CONSENT_COPY) as ConsentLanguage[]).map((lang) => (
        <button
          key={lang}
          type="button"
          lang={lang}
          aria-pressed={language === lang}
          onClick={() => setLanguage(lang)}
          className={cn(
            "min-h-8 px-3 rounded-full transition-colors cursor-pointer",
            focusRing,
            language === lang ? "bg-[#4A7244] text-white" : "text-[#685752] hover:bg-[#F7EFEA]"
          )}
        >
          {CONSENT_COPY[lang].languageLabel}
        </button>
      ))}
    </div>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors cursor-pointer",
        focusRing,
        checked ? "bg-[#4A7244]" : "bg-[#C9BAB3]"
      )}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  );
}

function CategoryCard({
  copy,
  labels,
  control,
}: {
  copy: CategoryCopy;
  labels: { data: string; retention: string; shared: string };
  control: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[#E8DCD5] bg-white p-4 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-[#685752]">{copy.title}</h3>
          <p className="text-sm text-[#7A6862] leading-relaxed mt-1">{copy.description}</p>
        </div>
        {control}
      </div>
      <details className="group text-sm text-[#7A6862]">
        <summary className={cn("cursor-pointer font-semibold text-[#4A7244] rounded", focusRing)}>{labels.data}</summary>
        <ul className="mt-2 ml-5 list-disc space-y-1">
          {copy.dataItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="mt-2">
          <span className="font-semibold text-[#685752]">{labels.retention}:</span> {copy.retention}
        </p>
        {copy.sharedWith && (
          <p className="mt-1">
            <span className="font-semibold text-[#685752]">{labels.shared}:</span> {copy.sharedWith}
          </p>
        )}
      </details>
    </section>
  );
}

function PreferencesDialog() {
  const { consent, language, closePreferences, saveChoice } = useConsent();
  const t = CONSENT_COPY[language];
  const [analytics, setAnalytics] = useState(consent?.analytics ?? false);
  const [marketing, setMarketing] = useState(consent?.marketing ?? false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEscapeKey(true, closePreferences);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => previouslyFocused?.focus?.();
  }, []);

  const submit = async (action: ConsentAction, choice: { analytics: boolean; marketing: boolean }) => {
    setSaving(true);
    setError(false);
    const ok = await saveChoice(action, choice);
    setSaving(false);
    if (!ok) setError(true);
  };

  const labels = { data: t.dataWeCollect, retention: t.retentionLabel, shared: t.sharedWithLabel };

  return (
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center sm:p-4">
      <div className="absolute inset-0 bg-black/50" onClick={closePreferences} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="consent-prefs-title"
        lang={language}
        className="relative w-full sm:max-w-lg max-h-[92dvh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-[#FFFDF9] shadow-2xl"
      >
        <div className="flex items-center justify-between gap-3 px-5 pt-5 pb-3 border-b border-[#E8DCD5]">
          <h2 id="consent-prefs-title" className="text-lg font-bold text-[#685752]">
            {t.preferencesTitle}
          </h2>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <button
              ref={closeRef}
              type="button"
              onClick={closePreferences}
              aria-label={t.close}
              className={cn("p-2.5 rounded-full text-[#7A6862] hover:bg-[#F7EFEA] cursor-pointer", focusRing)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto px-5 py-4 space-y-4">
          <p className="text-sm text-[#7A6862] leading-relaxed">{t.preferencesIntro}</p>

          <CategoryCard
            copy={t.essential}
            labels={labels}
            control={
              <span className="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-[#4A7244] bg-[#8EB486]/15 px-2.5 py-1 rounded-full">
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
                {t.alwaysOn}
              </span>
            }
          />
          <CategoryCard
            copy={t.analytics(Boolean(GA_MEASUREMENT_ID))}
            labels={labels}
            control={<Toggle checked={analytics} onChange={setAnalytics} label={t.analytics(false).title} />}
          />
          {MARKETING_ENABLED && (
            <CategoryCard
              copy={t.marketing}
              labels={labels}
              control={<Toggle checked={marketing} onChange={setMarketing} label={t.marketing.title} />}
            />
          )}

          <section className="space-y-2 text-sm text-[#7A6862]">
            <h3 className="text-base font-bold text-[#685752]">{t.rightsTitle}</h3>
            <ul className="ml-5 list-disc space-y-1">
              {t.rights(GRIEVANCE_EMAIL).map((right) => (
                <li key={right}>{right}</li>
              ))}
            </ul>
            <p>
              {t.complaint}{" "}
              <a href={DPB_COMPLAINT_URL} target="_blank" rel="noopener noreferrer" className={cn("font-semibold text-[#4A7244] underline rounded", focusRing)}>
                {t.complaintLink}
              </a>
              .
            </p>
            <p>{t.minors}</p>
            <p className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <Link href="/privacy-policy#cookies" onClick={closePreferences} className={cn("font-semibold text-[#4A7244] underline rounded", focusRing)}>
                {t.privacyPolicy}
              </Link>
              <span className="text-xs">
                {t.noticeVersion}: {CONSENT_VERSION}
              </span>
            </p>
          </section>
        </div>

        <div className="px-5 py-4 border-t border-[#E8DCD5] space-y-2">
          {error && (
            <p role="alert" className="text-sm text-rose-700">
              {t.saveError}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              disabled={saving}
              onClick={() => submit("reject_all", { analytics: false, marketing: false })}
              className={cn(choiceButton, "border-2 border-[#4A7244] text-[#4A7244] bg-white hover:bg-[#F7EFEA]")}
            >
              {t.rejectAll}
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => submit("custom", { analytics, marketing })}
              className={cn(choiceButton, "border-2 border-[#685752] text-[#685752] bg-white hover:bg-[#F7EFEA]")}
            >
              {saving ? t.saving : t.saveChoices}
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => submit("accept_all", { analytics: true, marketing: MARKETING_ENABLED })}
              className={cn(choiceButton, "border-2 border-[#4A7244] bg-[#4A7244] text-white hover:bg-[#3F6339]")}
            >
              {t.acceptAll}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** First-visit consent banner plus the preferences dialog (also opened from "Cookie settings" in the footer). */
export default function CookieConsent() {
  const { consent, ready, language, preferencesOpen, openPreferences, saveChoice } = useConsent();
  const t = CONSENT_COPY[language];
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);
  const isStudio = usePathname().startsWith("/studio");

  if (!ready || isStudio) return null;
  if (preferencesOpen) return <PreferencesDialog />;
  if (consent) return null;

  const submit = async (action: ConsentAction, choice: { analytics: boolean; marketing: boolean }) => {
    setSaving(true);
    setError(false);
    const ok = await saveChoice(action, choice);
    setSaving(false);
    if (!ok) setError(true);
  };

  return (
    <div
      role="region"
      aria-label={t.bannerTitle}
      lang={language}
      className="fixed z-[100] inset-x-0 bottom-0 sm:inset-x-auto sm:left-6 sm:bottom-6 sm:max-w-md p-3 sm:p-0"
    >
      <div className="rounded-3xl border border-[#E8DCD5] bg-[#FFFDF9] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.35)] p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <h2 className="flex items-center gap-2 text-base font-bold text-[#685752]">
            <Cookie className="w-5 h-5 text-[#4A7244]" aria-hidden="true" />
            {t.bannerTitle}
          </h2>
          <LanguageToggle />
        </div>
        <p className="text-sm text-[#7A6862] leading-relaxed">
          {t.bannerBody}{" "}
          <Link href="/privacy-policy#cookies" className={cn("font-semibold text-[#4A7244] underline rounded", focusRing)}>
            {t.privacyPolicy}
          </Link>
        </p>
        {error && (
          <p role="alert" className="text-sm text-rose-700">
            {t.saveError}
          </p>
        )}
        <div className="flex gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={() => submit("reject_all", { analytics: false, marketing: false })}
            className={cn(choiceButton, "border-2 border-[#4A7244] text-[#4A7244] bg-white hover:bg-[#F7EFEA]")}
          >
            {t.rejectAll}
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => submit("accept_all", { analytics: true, marketing: MARKETING_ENABLED })}
            className={cn(choiceButton, "border-2 border-[#4A7244] bg-[#4A7244] text-white hover:bg-[#3F6339]")}
          >
            {t.acceptAll}
          </button>
        </div>
        <button
          type="button"
          onClick={openPreferences}
          className={cn("w-full min-h-11 text-sm font-semibold text-[#685752] underline underline-offset-4 hover:text-[#4A7244] rounded-full cursor-pointer", focusRing)}
        >
          {t.managePreferences}
        </button>
      </div>
    </div>
  );
}
