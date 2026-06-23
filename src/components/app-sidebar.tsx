import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard, Radar, BarChart3, LineChart, FileText,
  CalendarDays, CalendarRange, Sparkles, UserCog, TrendingUp,
  Settings, ScrollText, ClipboardList, Home, ChevronLeft, ChevronRight,
  LogOut, User as UserIcon,
} from "lucide-react";
import { useState } from "react";
import { useApp } from "@/lib/app-context";
import { cn } from "@/lib/utils";

type Item = { title: string; url: string; icon: React.ComponentType<{ className?: string }> };

const ADMIN_NAV: { label: string; items: Item[] }[] = [
  { label: "Overview", items: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  ]},
  { label: "Analytics", items: [
    { title: "CFR Analytics", url: "/cfr-analytics", icon: BarChart3 },
    { title: "LR Analytics", url: "/lr-analytics", icon: LineChart },
    
  ]},
  { label: "Reports", items: [
    { title: "Team Daily Reports", url: "/team-daily-reports", icon: FileText },
    { title: "Daily Summary", url: "/daily-summary", icon: ClipboardList },
    { title: "Weekly Reports", url: "/weekly-reports", icon: CalendarDays },
    { title: "Monthly Reports", url: "/monthly-reports", icon: CalendarRange },
  ]},
  { label: "Admin", items: [
    { title: "User Management", url: "/users", icon: UserCog },
    { title: "Audit Logs", url: "/audit-logs", icon: ScrollText },
    { title: "Settings", url: "/settings", icon: Settings },
  ]},
];

const USER_NAV: { label: string; items: Item[] }[] = [
  { label: "Workspace", items: [
    { title: "My Dashboard", url: "/my-dashboard", icon: Home },
    { title: "Daily Report", url: "/daily-report", icon: ClipboardList },
  ]},
];

export function AppSidebar() {
  const { user, setUser } = useApp();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const nav = user?.role === "admin" ? ADMIN_NAV : USER_NAV;

  const initials = (user?.name ?? "U")
    .split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

  const handleLogout = () => {
    setUser(null);
    navigate({ to: "/login", replace: true });
  };

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-300",
        collapsed ? "w-[72px]" : "w-[260px]",
      )}
    >
      {/* Brand */}
      <div className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border px-4">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg" style={{ background: "var(--gradient-primary)" }}>
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="truncate text-sm font-bold">TPI Platform</div>
            <div className="truncate text-[10px] uppercase tracking-wider text-muted-foreground">
              Team Intelligence
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="flex flex-col gap-4">
          {nav.map((group) => (
            <div key={group.label}>
              {!collapsed && (
                <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.label}
                </div>
              )}
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const active = pathname === item.url;
                  return (
                    <li key={item.url}>
                      <Link
                        to={item.url}
                        className={cn(
                          "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                          active
                            ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                        )}
                        title={collapsed ? item.title : undefined}
                      >
                        <item.icon className={cn("h-4 w-4 shrink-0", active && "text-primary")} />
                        {!collapsed && <span className="truncate">{item.title}</span>}
                        {!collapsed && active && (
                          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      {/* User profile card */}
      <div className="shrink-0 border-t border-sidebar-border p-3">
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-sidebar-accent text-xs font-bold text-sidebar-accent-foreground">
                {initials}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-sidebar" />
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/40 p-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-sidebar-accent text-sm font-bold text-sidebar-accent-foreground">
                  {initials}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-sidebar" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{user?.name}</div>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span className="capitalize">{user?.role}</span>
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Online
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-1.5">
              <Link
                to="/settings"
                className="inline-flex items-center justify-center gap-1.5 rounded-md border border-sidebar-border bg-sidebar px-2 py-1.5 text-[11px] font-medium text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
              >
                <UserIcon className="h-3.5 w-3.5" />
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-1.5 rounded-md border border-sidebar-border bg-sidebar px-2 py-1.5 text-[11px] font-medium text-sidebar-foreground/80 hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Collapse */}
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="flex h-12 shrink-0 w-full items-center justify-center gap-2 border-t border-sidebar-border text-xs text-muted-foreground hover:bg-sidebar-accent/60"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : (
          <><ChevronLeft className="h-4 w-4" /> Collapse Sidebar</>
        )}
      </button>
    </aside>
  );
}
