import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FolderOpen, Users, Shield, ChevronLeft, ChevronRight, LogOut, Home } from "lucide-react";
import { base44 } from "@/api/base44Client";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/catalog", label: "Catalog", icon: FolderOpen },
  { path: "/tiers", label: "Audience Tiers", icon: Users },
  { path: "/protection", label: "IP Protection", icon: Shield },
];

export default function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ${
      collapsed ? "w-[72px]" : "w-[240px]"
    }`}>
      {/* Logo */}
      <div className="p-4 flex items-center gap-3 border-b border-sidebar-border min-h-[64px]">
        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <span className="font-heading font-bold text-primary-foreground text-sm">HG</span>
        </div>
        {!collapsed && <span className="font-heading text-base font-bold text-sidebar-foreground">Heavens Gates</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-sidebar-border space-y-1">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
        >
          <Home className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Home</span>}
        </Link>
        <button
          onClick={() => base44.auth.logout()}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center py-2 rounded-lg text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
}