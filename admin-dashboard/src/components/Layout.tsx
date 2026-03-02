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
          <div className="w-10 h-10 rounded-full bg-winga-primary/20 flex items-center justify-center text-winga-primary font-bold shadow-inner">A</div>
          <div className="flex-1 flex flex-col overflow-hidden">
            <span className="text-sm font-bold truncate text-foreground">Admin User</span>
            <span className="text-xs truncate text-winga-muted-foreground">admin@winga.co.tz</span>
          </div>
          <Button size="sm" variant="light" isIconOnly aria-label="Logout" onPress={handleLogout} className="text-winga-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors rounded-xl">
            <LogOut size={18} strokeWidth={2.5} />
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto bg-gray-50/50 flex flex-col">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-winga-border/50 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-2 text-winga-muted-foreground">
            {/* Can add breadcrumbs or page title here later */}
          </div>
          <div className="flex items-center gap-4">
            <Button isIconOnly variant="light" className="relative text-winga-muted-foreground hover:text-foreground rounded-full">
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
            </Button>
          </div>
        </header>

        <div className="p-6 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
