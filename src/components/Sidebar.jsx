import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";

import BrandLogo from "@/components/BrandLogo";
import { LayoutDashboard, ShoppingCart, Package, Receipt, Settings, LogOut } from "lucide-react";
import { isDemoMode } from "@/lib/dataApi";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/pos", label: "POS", icon: ShoppingCart },
  { to: "/inventory", label: "Inventory", icon: Package },
  { to: "/sales-history", label: "Sales History", icon: Receipt },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const displayName = user?.display_name || user?.full_name || user?.email?.split("@")[0] || "Cashier";
  const demo = isDemoMode();

  return (
    <aside className="w-[240px] shrink-0 bg-sidebar text-sidebar-foreground flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-2.5">
          <BrandLogo size={38} />
          <div className="leading-tight">
            <div className="font-bold text-[15px] text-white">Charing's</div>
            <div className="text-[10px] tracking-[0.15em] text-sidebar-muted font-medium">GROCERY POS</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sidebar-active text-white"
                    : "text-sidebar-muted hover:bg-sidebar-hover hover:text-white"
                }`
              }
            >
              <Icon className="w-[18px] h-[18px]" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* User profile + logout */}
      <div className="p-3 space-y-3">
        <div className="bg-sidebar-hover rounded-lg p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-sm font-semibold shrink-0">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="leading-tight min-w-0">
            <div className="text-sm font-semibold text-white truncate capitalize">
              {displayName.replace(/[._]/g, " ")}
            </div>
            <div className="text-[11px] text-sidebar-muted flex items-center gap-1.5">
              Active Cashier
              {demo && <span className="bg-amber-400 text-amber-900 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">Demo</span>}
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-sidebar-muted hover:bg-sidebar-hover hover:text-white transition-colors"
        >
          <LogOut className="w-[18px] h-[18px]" />
          Log Out
        </button>
      </div>
    </aside>
  );
}