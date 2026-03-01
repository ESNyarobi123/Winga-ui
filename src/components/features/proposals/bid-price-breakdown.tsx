"use client";

import { useT } from "@/lib/i18n";

export type PriceBreakdown = {
  providerFee: number;
  platformCommission: number;
  totalToClient: number;
  commissionRatePercent?: number;
};

export function BidPriceBreakdown({ breakdown, currency = "TZS" }: { breakdown: PriceBreakdown; currency?: string }) {
  const t = useT();
  const fmt = (n: number) => `${n.toLocaleString()} ${currency}`;

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 space-y-2">
      <p className="text-sm font-medium text-[#111827]">{t("bid.yourBid")}</p>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{t("bid.serviceFee")}</span>
        <span className="font-medium">{fmt(breakdown.providerFee)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{t("bid.wingaCommission")}</span>
        <span className="font-medium">{fmt(breakdown.platformCommission)}</span>
      </div>
      <div className="border-t border-slate-200 pt-2 flex justify-between font-semibold">
        <span>{t("bid.totalToClient")}</span>
        <span>{fmt(breakdown.totalToClient)}</span>
      </div>
    </div>
  );
}
