"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  FileCheck,
  FileText,
  Users,
  FolderOpen,
  CreditCard,
  AlertCircle,
  Settings,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { Button } from "@heroui/button";
import { authService } from "@/services/auth.service";
import { useUserStore } from "@/store/use-user-store";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/jobs", label: "Jobs", icon: Briefcase },
  { href: "/admin/moderation", label: "Moderation", icon: ShieldCheck },
  { href: "/admin/applications", label: "Applications", icon: FileCheck },
  { href: "/admin/contracts", label: "Contracts", icon: FileText },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/categories", label: "Categories", icon: FolderOpen },
  { href: "/admin/payment-options", label: "Payment options", icon: CreditCard },
  { href: "/admin/disputes", label: "Disputes", icon: AlertCircle },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

interface AdminSidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ open = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useUserStore((s) => s.user);

  const handleLogout = () => {
    authService.logout();
    useUserStore.getState().logout();
    router.replace("/admin/login");
  };

  return (
    <aside
      className={cn(
        "top-0 left-0 z-30 h-screen w-64 shrink-0 border-r border-border bg-card flex flex-col shadow-lg transition-transform duration-300 ease-in-out",
        open
          ? "translate-x-0 fixed lg:relative"
          : "fixed -translate-x-full"
      )}
    >
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-2">
          <ShieldCheck size={28} className="text-primary" strokeWidth={2.5} />
          <h2 className="font-bold text-xl tracking-tight text-foreground">Winga</h2>
        </div>
        <p className="text-[13px] font-medium text-muted-foreground mt-1 ml-1">Admin Portal</p>
      </div>
      <nav className="flex-1 p-3 space-y-0.5">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={() => onClose?.()}
            className={cn(
              "group flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-semibold transition-all duration-300 relative",
              pathname === href
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {pathname === href && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-primary rounded-r-md" />
            )}
            <Icon size={20} strokeWidth={pathname === href ? 2.5 : 2} className="shrink-0" />
            {label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-border/50 flex items-center gap-3 bg-muted/30">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">
          {user?.fullName?.charAt(0)?.toUpperCase() ?? "A"}
        </div>
        <div className="flex-1 min-w-0 flex flex-col">
          <span className="text-sm font-bold truncate text-foreground">{user?.fullName ?? "Admin"}</span>
          <span className="text-xs truncate text-muted-foreground">{user?.email ?? "—"}</span>
        </div>
        <Button
          size="sm"
          variant="light"
          isIconOnly
          aria-label="Logout"
          onPress={handleLogout}
          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-xl shrink-0"
        >
          <LogOut size={18} strokeWidth={2.5} />
        </Button>
      </div>
    </aside>
  );
}
