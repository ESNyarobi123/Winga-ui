import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@heroui/react";
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
  { to: "/disputes", label: "Disputes", icon: AlertCircle },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Layout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen w-full bg-winga-muted">
      <aside className="w-64 shrink-0 border-r border-winga-border bg-white flex flex-col shadow-winga-card">
        <div className="p-5 border-b border-winga-border">
          <h2 className="font-bold text-lg text-winga-primary">Winga Admin</h2>
          <p className="text-xs text-winga-muted-foreground">OFM Jobs</p>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-winga-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-winga-primary text-white shadow-sm"
                    : "text-winga-muted-foreground hover:bg-winga-primary-light hover:text-winga-primary-dark"
                }`
              }
            >
              <Icon size={20} strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-winga-border flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-winga-primary-light flex items-center justify-center text-winga-primary font-semibold text-sm">A</div>
          <span className="flex-1 text-sm truncate text-foreground">Admin</span>
          <Button size="sm" variant="light" isIconOnly aria-label="Logout" onPress={handleLogout} className="text-winga-muted-foreground hover:bg-winga-primary-light hover:text-winga-primary">
            <LogOut size={18} />
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-6 bg-winga-muted">
        <Outlet />
      </main>
    </div>
  );
}
