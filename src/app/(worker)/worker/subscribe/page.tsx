"use client";

import { useEffect, useState } from "react";
import { useT } from "@/lib/i18n";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { subscriptionService, type SubscriptionPlan } from "@/services/subscription.service";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Check } from "lucide-react";

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat("en-TZ", { style: "currency", currency: currency || "TZS" }).format(price);
}

export default function WorkerSubscribePage() {
  const t = useT();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    subscriptionService.getPlans().then((list) => {
      setPlans(list);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-foreground mb-2">{t("subscription.subscribe")}</h1>
      <p className="text-muted-foreground mb-6">{t("subscription.required")}</p>

      {loading ? (
        <div className="py-12 text-center text-muted-foreground">Loading plans…</div>
      ) : plans.length === 0 ? (
        <div className="rounded-xl border border-default-200 bg-default-50 p-8 text-center">
          <p className="text-muted-foreground mb-6">
            No subscription plans available at the moment. Payment via M-Pesa / Tigo / Airtel will be available soon.
          </p>
          <Link href="/worker/find-jobs">
            <Button variant="outline">{t("common.back")}</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {plans.map((plan) => (
            <Card key={plan.id} className="rounded-2xl border-2 border-default-200 hover:border-primary/50 transition-colors">
              <CardHeader className="pb-2 pt-6 px-6">
                <h2 className="text-xl font-bold text-foreground">{plan.name}</h2>
                {plan.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{plan.description}</p>
                )}
              </CardHeader>
              <CardBody className="pt-0 px-6 pb-6 flex flex-col">
                <div className="mb-4">
                  <span className="text-3xl font-extrabold text-foreground">{formatPrice(plan.price, plan.currency)}</span>
                  <span className="text-muted-foreground text-sm"> / {plan.durationDays} days</span>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  <li className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="h-4 w-4 text-primary shrink-0" strokeWidth={2.5} />
                    Submit proposals and get hired
                  </li>
                  <li className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="h-4 w-4 text-primary shrink-0" strokeWidth={2.5} />
                    Valid for {plan.durationDays} days
                  </li>
                </ul>
                <Button
                  as={Link}
                  href="/worker/find-jobs"
                  variant="outline"
                  className="w-full font-semibold rounded-xl"
                >
                  {t("subscription.subscribe")}
                </Button>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Payment via M-Pesa / Tigo / Airtel coming soon.
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <div className="flex justify-center">
        <Link href="/worker/find-jobs">
          <Button variant="ghost">{t("common.back")}</Button>
        </Link>
      </div>
    </div>
  );
}
