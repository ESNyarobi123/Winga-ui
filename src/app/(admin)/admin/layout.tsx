"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/features/admin/admin-sidebar";
import { authService } from "@/services/auth.service";
import { useUserStore } from "@/store/use-user-store";
import { Button } from "@heroui/button";
import { PanelLeftClose, PanelLeft } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // After refresh: restore user from /auth/me if token exists
  useEffect(() => {
    if (isLogin) return;
    if (user) return;
    if (typeof window === "undefined") return;
    if (!localStorage.getItem("token")) return;
    authService
      .me()
      .then(setUser)
      .catch(() => {});
  }, [isLogin, user, setUser]);

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen w-full bg-muted/30">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-20 bg-black/20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <main className="flex-1 overflow-auto flex flex-col min-w-0">
        <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 sm:px-6 shrink-0">
          <Button
            isIconOnly
            variant="light"
            size="sm"
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            onPress={() => setSidebarOpen((o) => !o)}
            className="shrink-0"
          >
            {sidebarOpen ? (
              <PanelLeftClose className="h-5 w-5 text-muted-foreground" />
            ) : (
              <PanelLeft className="h-5 w-5 text-muted-foreground" />
            )}
          </Button>
          <div className="flex-1" />
        </header>
        <div className="p-6 flex-1">{children}</div>
      </main>
    </div>
  );
}
