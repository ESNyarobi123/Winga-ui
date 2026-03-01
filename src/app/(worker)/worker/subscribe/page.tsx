"use client";

import { useT } from "@/lib/i18n";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function WorkerSubscribePage() {
  const t = useT();

  return (
    <div className="max-w-lg mx-auto px-4 py-12 text-center">
      <h1 className="text-2xl font-bold text-foreground mb-2">{t("subscription.subscribe")}</h1>
      <p className="text-muted-foreground mb-6">{t("subscription.required")}</p>
      <p className="text-sm text-muted-foreground mb-8">
        Monthly subscription allows you to bid on client jobs. Payment via M-Pesa / Tigo / Airtel will be available soon.
      </p>
      <Link href="/worker/find-jobs">
        <Button variant="outline">{t("common.back")}</Button>
      </Link>
    </div>
  );
}
