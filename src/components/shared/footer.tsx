"use client";

import Link from "next/link";
import { Youtube, Instagram, FileText, Mail, ChevronUp } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { useT } from "@/lib/i18n";

export function Footer() {
  const t = useT();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#fafafa] pt-16 pb-6 border-t border-[#f0f0f0] mt-auto">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
          {/* Logo & Social */}
          <div className="md:col-span-1">
            <div className="mb-6">
              <Logo />
            </div>
            <p className="text-[13.5px] text-[#555] font-medium mb-6">
              {t("footer.tagline")}
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-[#888] hover:text-[#006e42] transition-colors">
                <Youtube className="w-[18px] h-[18px]" strokeWidth={2.5} />
              </a>
              <a href="#" className="text-[#888] hover:text-[#006e42] transition-colors">
                <Instagram className="w-[18px] h-[18px]" strokeWidth={2.5} />
              </a>
              <a href="#" className="text-[#888] hover:text-[#006e42] transition-colors">
                {/* Custom tiktok icon or fallback */}
                <svg
                  className="w-[18px] h-[18px] fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91.04.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.13-3.92-5.26-.23-1.03-.2-2.11-.05-3.14.24-1.58.98-3.05 2.1-4.14 1.67-1.58 4.09-2.32 6.36-1.89l-.02 4.09c-.83-.43-1.81-.59-2.73-.39-1.01.2-1.92.83-2.45 1.7-.58.94-.65 2.13-.19 3.12.44 1.05 1.48 1.83 2.64 1.99 1.4.2 2.82-.47 3.65-1.58.55-.72.82-1.63.81-2.55l-.04-13.06z" />
                </svg>
              </a>
              <a href="#" className="text-[#888] hover:text-[#006e42] transition-colors">
                <FileText className="w-[18px] h-[18px]" strokeWidth={2.5} />
              </a>
              <a href="#" className="text-[#888] hover:text-[#006e42] transition-colors">
                <Mail className="w-[18px] h-[18px]" strokeWidth={2.5} />
              </a>
            </div>
          </div>

          {/* Workers Articles */}
          <div className="md:col-span-1 border-l border-[#ebebeb] md:pl-10">
            <h3 className="text-[17px] font-bold text-[#111827] mb-5">
              {t("footer.workersArticles")}
            </h3>
            <ul className="space-y-4">
              <li>
                <Link href="#" className="text-[14px] font-medium text-[#777] hover:text-[#006e42] transition-colors">
                  {t("footer.workersFaq")}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[14px] font-medium text-[#777] hover:text-[#006e42] transition-colors">
                  {t("footer.howToBecomeVA")}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[14px] font-medium text-[#777] hover:text-[#006e42] transition-colors">
                  {t("footer.howDoIGetPaid")}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[14px] font-medium text-[#777] hover:text-[#006e42] transition-colors">
                  {t("footer.becomeChatter")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Employers Articles */}
          <div className="md:col-span-1 border-l border-[#ebebeb] md:pl-10">
            <h3 className="text-[17px] font-bold text-[#111827] mb-5">
              {t("footer.employersArticles")}
            </h3>
            <ul className="space-y-4">
              <li>
                <Link href="#" className="text-[14px] font-medium text-[#777] hover:text-[#006e42] transition-colors">
                  {t("footer.employersFaq")}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[14px] font-medium text-[#777] hover:text-[#006e42] transition-colors">
                  {t("footer.howToHireChatters")}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[14px] font-medium text-[#777] hover:text-[#006e42] transition-colors">
                  {t("footer.howToHireVA")}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[14px] font-medium text-[#777] hover:text-[#006e42] transition-colors">
                  {t("footer.isWingaLegit")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation */}
          <div className="md:col-span-1 border-l border-[#ebebeb] md:pl-10">
            <h3 className="text-[17px] font-bold text-[#111827] mb-5">
              {t("footer.navigation")}
            </h3>
            <ul className="space-y-4">
              <li>
                <Link href="/pricing" className="text-[14px] font-medium text-[#777] hover:text-[#006e42] transition-colors">
                  {t("nav.pricing")}
                </Link>
              </li>
              <li>
                <Link href="/find-workers" className="text-[14px] font-medium text-[#777] hover:text-[#006e42] transition-colors">
                  {t("nav.findWorkers")}
                </Link>
              </li>
              <li>
                <Link href="/find-jobs" className="text-[14px] font-medium text-[#777] hover:text-[#006e42] transition-colors">
                  {t("nav.findJobs")}
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-[14px] font-medium text-[#777] hover:text-[#006e42] transition-colors">
                  {t("common.signUp")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#ebebeb] flex flex-col md:flex-row items-center justify-between gap-4 relative">
          <p className="text-[13px] font-medium text-[#888]">
            © {new Date().getFullYear()} {t("footer.copyright")}
          </p>

          {/* Scroll to top button */}
          <button
            onClick={scrollToTop}
            className="absolute -top-12 md:-left-14 left-0 w-10 h-10 rounded-full bg-[#dfede8] flex items-center justify-center hover:bg-[#c8e2d4] transition-colors"
            aria-label={t("footer.scrollToTop")}
          >
            <ChevronUp className="w-5 h-5 text-[#006e42]" strokeWidth={2.5} />
          </button>

          <div className="flex gap-6">
            <Link href="/terms" className="text-[13px] font-medium text-[#888] hover:text-[#006e42] transition-colors">
              {t("footer.termsOfService")}
            </Link>
            <Link href="/privacy" className="text-[13px] font-medium text-[#888] hover:text-[#006e42] transition-colors">
              {t("footer.privacyPolicy")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
