"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { subscriptionService } from "@/services/subscription.service";
import { useUserStore } from "@/store/use-user-store";
import { useT } from "@/lib/i18n";

export function SubscriptionBanner() {
  const t = useT();
  const user = useUserStore((s) => s.user);
  const [subscription, setSubscription] = useState<Awaited<ReturnType<typeof subscriptionService.getMySubscription>> | undefined>(undefined);

  useEffect(() => {
    if (user?.role !== "FREELANCER") return;
    subscriptionService.getMySubscription().then(setSubscription);
  }, [user?.role]);

  if (user?.role !== "FREELANCER" || subscription === undefined) return null;
  if (subscription?.active) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
      <p className="text-sm font-medium text-amber-900">
        {t("subscription.required")}
      </p>
      <Link
        href="/worker/subscribe"
        className="text-sm font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200 px-4 py-2 rounded-lg transition-colors"
      >
        {t("subscription.subscribe")}
      </Link>
    </div>
  );
}
