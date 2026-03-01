"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";
import {
    Users,
    Briefcase,
    Share2,
    Megaphone,
    TrendingUp,
    Settings,
    User,
    CreditCard,
    LogOut,
} from "lucide-react";
import { authService } from "@/services/auth.service";
import { useUserStore } from "@/store/use-user-store";

const navItems = [
    {
        href: "/client/workers",
        label: "Workers",
        icon: Users,
    },
    {
        href: "/client/jobs",
        label: "Jobs",
        icon: Briefcase,
    },
    {
        href: "/client/affiliates",
        label: "Affiliates",
        icon: Share2,
    },
    {
        href: "/client/marketing",
        label: "Marketing",
        icon: Megaphone,
    },
];

export function ClientSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const setUser = useUserStore((s) => s.setUser);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const settingsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
                setSettingsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function handleLogout() {
        authService.logout();
        setUser(null);
        setSettingsOpen(false);
        router.push("/");
        router.refresh();
    }

    const linkStyle = (
        isActive: boolean,
        extra?: string
    ) =>
        cn(
            "w-full flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-lg text-center transition-all duration-200 select-none focus:outline-none",
            isActive
                ? "bg-[#006e42] text-white shadow-sm"
                : "text-[#6b7280] hover:bg-[#006e42]/80 hover:text-white hover:shadow-sm",
            extra
        );

    return (
        <aside className="fixed left-0 top-0 z-30 w-[72px] h-screen bg-white border-r border-[#f0f0f0] flex flex-col items-center pt-4 pb-5 overflow-visible shrink-0">
            {/* Logo - juu */}
            <div className="mb-3 flex items-center justify-center w-full px-2">
                <div className="w-10 h-10 flex items-center justify-center">
                    <Logo />
                </div>
            </div>

            {/* Nav Items */}
            <nav className="flex flex-col gap-1.5 flex-1 w-full px-2 min-h-0">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                        pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            title={item.label}
                            className={linkStyle(isActive)}
                        >
                            <Icon className="w-5 h-5 shrink-0" strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[11px] font-semibold leading-tight">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Chini kabisa: mstari + Upgrade + Settings (kama image); overflow-visible ili dropdown ionekane juu ya content */}
            <div className="w-full px-2 flex flex-col gap-1.5 mt-auto pt-4 pb-5 border-t border-[#f0f0f0] relative overflow-visible">
                <Link
                    href="/client/upgrade"
                    title="Upgrade"
                    className={linkStyle(pathname.startsWith("/client/upgrade"))}
                >
                    <TrendingUp className="w-5 h-5 shrink-0" strokeWidth={2} />
                    <span className="text-[11px] font-semibold leading-tight">Upgrade</span>
                </Link>
                <div className="relative w-full" ref={settingsRef}>
                    <button
                        type="button"
                        onClick={() => setSettingsOpen((o) => !o)}
                        title="Settings"
                        className={linkStyle(settingsOpen)}
                    >
                        <Settings className="w-5 h-5 shrink-0" strokeWidth={settingsOpen ? 2.5 : 2} />
                        <span className="text-[11px] font-semibold leading-tight">Settings</span>
                    </button>
                    {settingsOpen && (
                        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-[180px] bg-white rounded-xl shadow-lg border border-[#e5e7eb] overflow-hidden z-[200]">
                            <Link
                                href="/client/profile"
                                onClick={() => setSettingsOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 text-[14px] font-medium text-[#374151] hover:bg-[#f9fafb] transition-colors border-b border-[#f0f0f0]"
                            >
                                <User className="w-4 h-4 text-[#6b7280]" strokeWidth={2} />
                                Profile
                            </Link>
                            <Link
                                href="/client/billing"
                                onClick={() => setSettingsOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 text-[14px] font-medium text-[#374151] hover:bg-[#f9fafb] transition-colors border-b border-[#f0f0f0]"
                            >
                                <CreditCard className="w-4 h-4 text-[#6b7280]" strokeWidth={2} />
                                Billing
                            </Link>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 text-[14px] font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                            >
                                <LogOut className="w-4 h-4 shrink-0" strokeWidth={2} />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}
