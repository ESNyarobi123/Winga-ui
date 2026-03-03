import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import AdminButton from "./AdminButton";
import {
  LayoutDashboard,
  Briefcase,
  FileCheck,
  FileText,
  Users,
  FolderOpen,
  CreditCard,
  Package,
  AlertCircle,
  Settings,
  ShieldCheck,
  LogOut,
  PanelLeft,
  PanelLeftClose,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/jobs", label: "Jobs", icon: Briefcase },
  { to: "/moderation", label: "Moderation", icon: ShieldCheck },
  { to: "/applications", label: "Applications", icon: FileCheck },
  { to: "/contracts", label: "Contracts", icon: FileText },
  { to: "/users", label: "Users", icon: Users },
  { to: "/categories", label: "Categories", icon: FolderOpen },
  { to: "/payment-options", label: "Payment options", icon: CreditCard },
  { to: "/subscription-plans", label: "Subscription plans", icon: Package },
  { to: "/disputes", label: "Disputes", icon: AlertCircle },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const initial = user?.fullName?.charAt(0)?.toUpperCase() ?? "A";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen w-full bg-winga-muted">
      {/* Sidebar: hidden by default; toggle in header opens it */}
      <aside
        className={`fixed top-0 left-0 z-30 h-screen w-64 shrink-0 border-r border-winga-border bg-white flex flex-col shadow-lg transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0 lg:relative" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-winga-border/50">
          <div className="flex items-center gap-2">
            <ShieldCheck size={28} className="text-winga-primary drop-shadow-sm" strokeWidth={2.5} />
            <h2 className="font-extrabold text-xl tracking-tight text-foreground">Winga</h2>
          </div>
          <p className="text-[13px] font-medium text-winga-muted-foreground mt-1 ml-1">Admin Portal</p>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-semibold transition-all duration-300 relative ${isActive
                  ? "bg-winga-primary/10 text-winga-primary"
                  : "text-winga-muted-foreground hover:bg-gray-100 hover:text-foreground"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-winga-primary rounded-r-md"></div>}
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-winga-border/50 flex items-center gap-3 bg-gray-50/50">
          <div className="w-10 h-10 rounded-full bg-winga-primary/20 flex items-center justify-center text-winga-primary font-bold shadow-inner">
            {initial}
          </div>
          <div className="flex-1 flex flex-col overflow-hidden">
            <span className="text-sm font-bold truncate text-foreground">{user?.fullName ?? "Admin"}</span>
            <span className="text-xs truncate text-winga-muted-foreground">{user?.email ?? "—"}</span>
          </div>
          <AdminButton size="sm" variant="flat" isIconOnly aria-label="Logout" onPress={handleLogout} className="text-winga-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors rounded-xl">
            <LogOut size={18} strokeWidth={2.5} />
          </AdminButton>
        </div>
      </aside>

      {/* Backdrop on mobile when sidebar open */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-20 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex-1 overflow-auto bg-gray-50/50 flex flex-col min-w-0">
        {/* Top Navbar — toggle on the LEFT so it's visible */}
        <header className="h-16 bg-white border-b border-winga-border/50 flex items-center justify-between px-4 sm:px-6 shrink-0">
          <div className="flex items-center gap-2">
            <AdminButton
              isIconOnly
              variant="flat"
              size="md"
              aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
              onPress={() => setSidebarOpen((o) => !o)}
              className="text-winga-primary hover:bg-winga-primary/10 rounded-xl shrink-0"
            >
              {sidebarOpen ? (
                <PanelLeftClose size={22} strokeWidth={2} />
              ) : (
                <PanelLeft size={22} strokeWidth={2} />
              )}
            </AdminButton>
            <span className="text-sm font-medium text-winga-muted-foreground hidden sm:inline">
              {sidebarOpen ? "Funga menu" : "Fungua menu"}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <AdminButton isIconOnly variant="flat" className="relative text-winga-muted-foreground hover:text-foreground rounded-full">
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
            </AdminButton>
          </div>
        </header>

        <div className="p-6 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
