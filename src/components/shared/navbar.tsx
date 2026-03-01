"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { LanguageSwitch } from "./language-switch";
import { useUserStore } from "@/store/use-user-store";
import { authService } from "@/services/auth.service";
import { roleCookie } from "@/lib/cookies";
import { useT } from "@/lib/i18n";

export function Navbar() {
  const router = useRouter();
  const t = useT();
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);

  // Hydrate user from token on load (e.g. after refresh)
  useEffect(() => {
    if (user || typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (!token) return;
    authService
      .me()
      .then((me) => {
        setUser(me);
        if (me.role) roleCookie.set(me.role);
      })
      .catch(() => {
        localStorage.removeItem("token");
        roleCookie.remove();
      });
  }, [user, setUser]);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      <div className="container mx-auto px-4 flex h-[84px] items-center justify-between">
        <Logo />

        {/* Center Links */}
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          <Link href="/find-jobs" className="text-[17px] font-semibold text-primary hover:opacity-80 transition-opacity">
            {t("nav.findJobs")}
          </Link>
          <Link href="/find-workers" className="text-[17px] font-semibold text-[#111827] hover:text-primary transition-colors">
            {t("nav.findWorkers")}
          </Link>
          <Link href="/results" className="text-[17px] font-semibold text-[#111827] hover:text-primary transition-colors">
            {t("nav.realResults")}
          </Link>
          <Link href="/pricing" className="text-[17px] font-semibold text-[#111827] hover:text-primary transition-colors">
            {t("nav.pricing")}
          </Link>
          <Link href="/resources" className="text-[17px] font-semibold text-[#111827] hover:text-primary transition-colors">
            {t("nav.resources")}
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3 z-10">
          <LanguageSwitch />
          {user ? (
            <>
              {user.role === "CLIENT" && (
                <Link href="/client/post-job">
                  <Button className="rounded-full px-6 font-semibold h-11">{t("job.postJob")}</Button>
                </Link>
              )}
              {user.role === "FREELANCER" && (
                <Link href="/worker/find-jobs">
                  <Button className="rounded-full px-6 font-semibold h-11">{t("dashboard.findWork")}</Button>
                </Link>
              )}
              {user.role === "ADMIN" && (
                <Link href="/admin" className="text-[15px] font-semibold text-[#111827] hover:text-primary transition-colors">
                  Admin
                </Link>
              )}
              <Button variant="ghost" className="rounded-full font-semibold h-11" onClick={handleLogout}>
                {t("common.logout")}
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button className="rounded-full px-7 font-semibold h-11 text-[15px] hover:-translate-y-0.5 transition-transform duration-200 shadow-md">
                {t("common.signIn")} / {t("common.signUp")}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
