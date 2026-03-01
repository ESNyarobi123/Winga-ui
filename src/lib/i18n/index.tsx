"use client";

import { createContext, useContext, useCallback, useState, useEffect, ReactNode } from "react";
import swMessages from "./messages/sw.json";
import enMessages from "./messages/en.json";

const LOCALE_KEY = "winga_locale";
export type Locale = "sw" | "en";

const messages: Record<Locale, Record<string, unknown>> = {
  sw: swMessages as Record<string, unknown>,
  en: enMessages as Record<string, unknown>,
};

type LocaleContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function getStoredLocale(): Locale {
  if (typeof window === "undefined") return "sw";
  const stored = localStorage.getItem(LOCALE_KEY) as Locale | null;
  return stored === "en" || stored === "sw" ? stored : "sw";
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("sw");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLocaleState(getStoredLocale());
    setMounted(true);
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    if (typeof window !== "undefined") localStorage.setItem(LOCALE_KEY, l);
    if (typeof document !== "undefined") document.documentElement.lang = l;
  }, []);

  useEffect(() => {
    if (mounted) document.documentElement.lang = locale;
  }, [locale, mounted]);

  const t = useCallback(
    (key: string): string => {
      const parts = key.split(".");
      let obj: unknown = messages[locale];
      for (const p of parts) {
        if (obj && typeof obj === "object" && p in obj) {
          obj = (obj as Record<string, unknown>)[p];
        } else {
          return key;
        }
      }
      return typeof obj === "string" ? obj : key;
    },
    [locale]
  );

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}

export function useT() {
  return useLocale().t;
}
