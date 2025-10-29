import type { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  icon: ReactNode;
  href: string;
  active?: boolean;
}

interface DashboardLayoutProps {
  children: ReactNode;
  navItems: NavItem[];
  title: string;
  subtitle?: string;
}

export function DashboardLayout({ children, navItems, title, subtitle }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#013936] via-[#024a46] to-[#013936]">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-[#012826] border-r border-[#C7E196]/20 transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-[#C7E196]/20">
            <div className="flex items-center justify-between">
              <img src="/growvia-logo.png" alt="Growvia" width={120} height={40} className="h-8 w-auto" />
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-white hover:bg-white/10"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.href || location.pathname?.startsWith(item.href + "/");
            return (
              <Button
                key={index}
                variant="ghost"
                className={cn(
                  "w-full h-11 text-white/70 hover:text-white hover:bg-[#013936]/50 flex items-center justify-start",
                  isActive && "bg-[#b5e385] !text-[#012826] hover:bg-[#013936]/90 hover:text-[#013936] font-semibold"
                )}
                onClick={() => {
                  navigate(item.href);
                  setSidebarOpen(false);
                }}
              >
                <div className="flex items-center gap-3 w-full">
                  {item.icon}
                  <span className="text-left">{item.label}</span>
                </div>
              </Button>
            )
          })}
        </nav>

          {/* User section */}
          <div className="p-4 border-t border-[#C7E196]/20">
            <div className="flex items-center gap-3 mb-3 p-3 bg-[#013936]/50 rounded-lg">
              <div className="w-10 h-10 bg-[#C7E196] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-[#013936]">
                  {user?.name && user.name !== user.email
                    ? user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                    : user?.email?.substring(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.name || user?.email}
                </p>
                <p className="text-xs text-[#C7E196] capitalize">{user?.role}</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start gap-3 text-white/70 hover:text-white hover:bg-[#013936]/50"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-[#012826]/80 border-b border-[#C7E196]/20 backdrop-blur-sm">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-white hover:bg-white/10"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-white">{title}</h1>
                {subtitle && <p className="text-sm text-white/60">{subtitle}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-sm text-white/60">
                {new Date().toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}