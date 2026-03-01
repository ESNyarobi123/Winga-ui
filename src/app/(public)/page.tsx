"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n";
import { AdSlot } from "@/components/shared/ad-slot";

const BANNERS = [
  { id: 1, titleKey: "home.benefit1", subKey: "home.benefits" },
  { id: 2, titleKey: "home.benefit2", subKey: "home.benefits" },
  { id: 3, titleKey: "home.benefit3", subKey: "home.benefits" },
];

const TESTIMONIALS = [
  { name: "Amina K.", role: "Mwajiri", quote: "Winga imenisaidia kupata wafanyakazi wazuri kwa haraka. Escrow inatuliza." },
  { name: "Juma M.", role: "Freelancer", quote: "Ninaipenda Winga — malipo yanakuja kwa wakati na kwa M-Pesa." },
  { name: "Grace L.", role: "Mwajiri", quote: "Mtandao rahisi na waaminifu. Ninapendekeza kwa kila mtu." },
];

export default function LandingPage() {
  const t = useT();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[75vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden bg-gradient-to-b from-[#F0FDF4] via-white to-[#F9FAFB]">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-80 h-40 rounded-full bg-primary/10 blur-3xl pointer-events-none" aria-hidden />
        <h1 className="text-4xl md:text-6xl font-extrabold mb-2 relative text-[#111827]">
          {t("home.title")}
          <span className="block mt-4 w-24 h-1 bg-primary rounded-full mx-auto" aria-hidden />
        </h1>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mt-4">
          {t("home.tagline")}
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/find-jobs"
            className="rounded-[50px] bg-primary px-8 py-3.5 text-primary-foreground font-semibold hover:opacity-90 transition-opacity shadow-lg"
          >
            {t("nav.browseJobs")}
          </Link>
          <Link
            href="/login"
            className="rounded-[50px] border-2 border-primary bg-white px-8 py-3.5 font-semibold text-primary hover:bg-primary/5 transition-colors"
          >
            {t("common.signIn")}
          </Link>
        </div>
      </section>

      {/* Banners / Slideshow - Core values & benefits */}
      <section className="py-16 px-4 bg-white border-y border-slate-100">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-[#111827] mb-12">
          {t("home.coreValues")}
        </h2>
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {BANNERS.map((b) => (
              <div
                key={b.id}
                className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <p className="text-[#111827] font-semibold text-lg leading-relaxed">
                  {t(b.titleKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-[#F9FAFB]">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-[#111827] mb-12">
          {t("home.testimonials")}
        </h2>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((c, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm"
            >
              <p className="text-slate-600 italic mb-4">&ldquo;{c.quote}&rdquo;</p>
              <p className="font-semibold text-[#111827]">{c.name}</p>
              <p className="text-sm text-slate-500">{c.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ad slot (Google AdSense when client ID is set) */}
      <section className="py-8 px-4 max-w-4xl mx-auto">
        <AdSlot showPlaceholder />
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center bg-primary/5">
        <p className="text-lg text-[#111827] font-medium mb-6">
          {t("home.tagline")}
        </p>
        <Link
          href="/find-jobs"
          className="inline-block rounded-[50px] bg-primary px-8 py-3.5 text-primary-foreground font-semibold hover:opacity-90"
        >
          {t("nav.browseJobs")}
        </Link>
      </section>
    </div>
  );
}
