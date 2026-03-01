"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/shared/logo";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const clientNavItems = [
  { href: "/client", label: "Client Home" },
  { href: "/client/post-job", label: "Post Job" },
  { href: "/chat", label: "Chat" },
];

const freelancerNavItems = [
  { href: "/worker/find-jobs", label: "Find Jobs" },
  { href: "/freelancer/earnings", label: "Earnings" },
  { href: "/chat", label: "Chat" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems =
    user?.role === "CLIENT"
      ? clientNavItems
      : user?.role === "FREELANCER"
        ? freelancerNavItems
        : [...clientNavItems, ...freelancerNavItems];

  return (
    <aside className="w-56 border-r bg-muted/30 p-4">
      <div className="mb-6">
        <Logo />
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
