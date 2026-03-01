"use client";

import { HeroUIProvider } from "@heroui/react";
import { LocaleProvider } from "@/lib/i18n";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <LocaleProvider>{children}</LocaleProvider>
    </HeroUIProvider>
  );
}
