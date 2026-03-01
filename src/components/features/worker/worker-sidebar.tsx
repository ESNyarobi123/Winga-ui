"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Briefcase,
    Bookmark,
    UserCheck,
    ClipboardList,
    Settings,
    User,
    LogOut,
} from "lucide-react";
import { Button } from "@heroui/button";
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    DropdownSection,
} from "@heroui/dropdown";
import { authService } from "@/services/auth.service";
import { useUserStore } from "@/store/use-user-store";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/worker/find-jobs", label: "Find Jobs", icon: Briefcase },
    { href: "/worker/saved-jobs", label: "Saved Jobs", icon: Bookmark },
    { href: "/worker/my-jobs", label: "My Jobs", icon: UserCheck },
    { href: "/worker/my-tests", label: "Tests", icon: ClipboardList },
];

export function WorkerSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const setUser = useUserStore((s) => s.setUser);

    function handleLogout() {
        authService.logout();
        setUser(null);
        router.push("/");
        router.refresh();
    }

    return (
        <aside className="w-[104px] min-h-full bg-default-50 border-r border-default-200 flex flex-col pt-3 pb-5 shrink-0 overflow-visible">
            <nav className="flex flex-col gap-1.5 flex-1 min-h-0 w-full px-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                        pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                        <Button
                            key={item.href}
                            as={Link}
                            href={item.href}
                            variant={isActive ? "solid" : "light"}
                            color="primary"
                            className={cn(
                                "flex flex-col items-center justify-center min-h-[72px] h-auto rounded-lg py-3 px-2 gap-2 font-medium text-[10px]",
                                isActive && "bg-primary text-primary-foreground"
                            )}
                        >
                            <Icon className="w-5 h-5 shrink-0" strokeWidth={isActive ? 2.5 : 2} />
                            <span className="leading-tight whitespace-nowrap">{item.label}</span>
                        </Button>
                    );
                })}
            </nav>

            <div className="w-full px-2 mt-auto pb-4 pt-4">
                <Dropdown placement="right-end" offset={8} radius="lg">
                    <DropdownTrigger>
                        <Button
                            variant="light"
                            color="primary"
                            className="w-full flex flex-col items-center justify-center min-h-[72px] h-auto rounded-lg py-3 px-2 gap-2 font-medium text-[10px]"
                        >
                            <Settings className="w-5 h-5 shrink-0" strokeWidth={2} />
                            <span className="leading-tight whitespace-nowrap">Settings</span>
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        aria-label="Settings menu"
                        className="min-w-[180px]"
                        onAction={(key) => {
                            if (key === "profile") router.push("/worker/profile");
                            if (key === "logout") handleLogout();
                        }}
                    >
                        <DropdownSection>
                            <DropdownItem
                                key="profile"
                                startContent={<User className="w-4 h-4" strokeWidth={2} />}
                            >
                                Profile
                            </DropdownItem>
                            <DropdownItem
                                key="logout"
                                color="danger"
                                startContent={<LogOut className="w-4 h-4" strokeWidth={2} />}
                            >
                                Logout
                            </DropdownItem>
                        </DropdownSection>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </aside>
    );
}
