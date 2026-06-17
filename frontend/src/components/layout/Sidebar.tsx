"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  ClipboardCheck,
  BarChart3,
  Lightbulb,
  FlaskConical,
  FileText,
  Users,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
  Heart,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/tracking", icon: ClipboardCheck, label: "Daily Check-in" },
  { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/dashboard/insights", icon: Lightbulb, label: "AI Insights" },
  { href: "/dashboard/interventions", icon: FlaskConical, label: "Interventions" },
  { href: "/dashboard/reports", icon: FileText, label: "Reports" },
  { href: "/dashboard/community", icon: Users, label: "Community" },
];

const bottomItems = [
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-background transition-all duration-300 ${
        collapsed ? "w-[72px]" : "w-[240px]"
      }`}
    >
      <div className="flex h-16 items-center justify-between px-4">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand">
              <Heart className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-gradient-brand">Vindi</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/dashboard" className="mx-auto">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand">
              <Heart className="h-4 w-4 text-white" />
            </div>
          </Link>
        )}
      </div>

      <Separator />

      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant={isActive(item.href) ? "secondary" : "ghost"}
              className={`w-full justify-start gap-3 ${
                collapsed ? "px-3" : "px-3"
              } ${isActive(item.href) ? "bg-secondary font-medium" : ""}`}
            >
              <item.icon className={`h-4 w-4 shrink-0 ${isActive(item.href) ? "text-primary" : ""}`} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Button>
          </Link>
        ))}

        {user?.role === "admin" && (
          <>
            <Separator className="my-2" />
            <Link href="/dashboard/admin">
              <Button
                variant={isActive("/dashboard/admin") ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 ${collapsed ? "px-3" : "px-3"}`}
              >
                <Shield className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="truncate">Admin</span>}
              </Button>
            </Link>
          </>
        )}
      </nav>

      <Separator />

      <div className="p-2 space-y-1">
        {bottomItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant={isActive(item.href) ? "secondary" : "ghost"}
              className={`w-full justify-start gap-3 ${collapsed ? "px-3" : "px-3"}`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Button>
          </Link>
        ))}

        {!collapsed && user && (
          <div className="flex items-center gap-3 px-3 py-2 mt-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-brand-100 text-brand-700 text-xs">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.subscriptionTier || "Free"}</p>
            </div>
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className={`w-full justify-start gap-3 text-muted-foreground hover:text-destructive ${collapsed ? "px-3" : "px-3"}`}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Log out</span>}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className={`w-full justify-center mt-1 ${collapsed ? "px-0" : ""}`}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
    </aside>
  );
}
