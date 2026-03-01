"use client";

import { useLocale } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

/** Kiswahili = Tanzania flag; English = GB flag. Default locale is Swahili (sw). */
const SW_LABEL = "Kiswahili";
const EN_LABEL = "English";

export function LanguageSwitch() {
  const { locale, setLocale } = useLocale();
  return (
    <div className="flex items-center gap-0.5 rounded-full border border-slate-200 bg-slate-50 dark:bg-slate-800 dark:border-slate-600 p-0.5">
      <Button
        variant={locale === "sw" ? "default" : "ghost"}
        className={`rounded-full h-9 px-3 text-sm gap-1.5 min-w-[72px] ${locale === "sw" ? "shadow-sm" : ""}`}
        onClick={() => setLocale("sw")}
        title={SW_LABEL}
        aria-label={SW_LABEL}
      >
        <span className="text-base leading-none" aria-hidden>🇹🇿</span>
        <span className="hidden sm:inline">SW</span>
      </Button>
      <Button
        variant={locale === "en" ? "default" : "ghost"}
        className={`rounded-full h-9 px-3 text-sm gap-1.5 min-w-[72px] ${locale === "en" ? "shadow-sm" : ""}`}
        onClick={() => setLocale("en")}
        title={EN_LABEL}
        aria-label={EN_LABEL}
      >
        <span className="text-base leading-none" aria-hidden>🇬🇧</span>
        <span className="hidden sm:inline">EN</span>
      </Button>
    </div>
  );
}
