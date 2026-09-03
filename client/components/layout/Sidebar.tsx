import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Archive,
  History,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "POS", to: "/pos", icon: ShoppingCart },
  { label: "Inventory", to: "/inventory", icon: Archive },
  { label: "Sales History", to: "/sales-history", icon: History },
  { label: "Settings", to: "/settings", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="flex w-full flex-shrink-0 flex-col gap-8 bg-pos-sidebar py-8 lg:w-[260px]">
      <div className="flex items-center gap-3 px-6">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-pos-primary">
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.7501 19.2493V14.6659C13.7501 14.4228 13.6535 14.1897 13.4816 14.0178C13.3097 13.8458 13.0765 13.7493 12.8334 13.7493H9.16675C8.92363 13.7493 8.69048 13.8458 8.51857 14.0178C8.34666 14.1897 8.25008 14.4228 8.25008 14.6659V19.2493M16.2929 9.4501C16.1018 9.26717 15.8475 9.16506 15.5829 9.16506C15.3184 9.16506 15.064 9.26717 14.873 9.4501C14.4467 9.85666 13.8803 10.0835 13.2912 10.0835C12.7022 10.0835 12.1358 9.85666 11.7095 9.4501C11.5185 9.26744 11.2644 9.1655 11 9.1655C10.7357 9.1655 10.4816 9.26744 10.2905 9.4501C9.86425 9.85693 9.29763 10.0839 8.70837 10.0839C8.11911 10.0839 7.55249 9.85693 7.1262 9.4501C6.93511 9.26717 6.68078 9.16506 6.41625 9.16506C6.15171 9.16506 5.89738 9.26717 5.70629 9.4501C5.29456 9.843 4.75137 10.0686 4.18245 10.0831C3.61352 10.0976 3.05956 9.89983 2.6284 9.52837C2.19724 9.1569 1.91972 8.6383 1.84986 8.07349C1.78 7.50869 1.92279 6.93809 2.25045 6.47277L4.8987 2.63744C5.06674 2.38949 5.29296 2.18649 5.55758 2.04618C5.82221 1.90588 6.11718 1.83255 6.4167 1.8326H15.5834C15.882 1.83249 16.1762 1.90533 16.4402 2.0448C16.7043 2.18427 16.9303 2.38614 17.0986 2.63285L19.7524 6.47552C20.0801 6.94121 20.2227 7.51224 20.1524 8.07734C20.0821 8.64244 19.804 9.16112 19.3721 9.53232C18.9403 9.90352 18.3857 10.1006 17.8164 10.0853C17.2472 10.0699 16.7041 9.84315 16.2929 9.44919M3.66675 10.0369V17.4161C3.66675 17.9023 3.8599 18.3687 4.20372 18.7125C4.54754 19.0563 5.01385 19.2494 5.50008 19.2494H16.5001C16.9863 19.2494 17.4526 19.0563 17.7964 18.7125C18.1403 18.3687 18.3334 17.9023 18.3334 17.4161V10.0369"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="flex flex-1 flex-col gap-0.5">
          <span className="text-base font-bold leading-none text-white">
            Charing's
          </span>
          <span className="text-[11px] font-medium uppercase tracking-[1px] text-pos-subtle">
            Grocery POS
          </span>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1.5 px-3">
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-pos-primary font-semibold text-white"
                  : "text-pos-subtle hover:bg-white/5",
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className="flex-shrink-0" />
                <span
                  className={cn(
                    "flex-1",
                    !isActive && "text-[#ECEFF1]",
                  )}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="flex flex-col gap-3 px-6">
        <div className="flex items-center gap-2.5 rounded-[10px] bg-pos-sidebar-foot p-3">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/c71ee9b2683837f2d2b460fce05c996564864bcd?width=64"
            alt="Maria Santos"
            className="h-8 w-8 flex-shrink-0 rounded-full object-cover"
          />
          <div className="flex flex-1 flex-col gap-0.5">
            <span className="text-[13px] font-semibold leading-none text-white">
              Maria Santos
            </span>
            <span className="text-[11px] leading-none text-pos-subtle">
              Active Cashier
            </span>
          </div>
        </div>
        <button className="flex items-center gap-2 text-[13px] font-medium text-pos-subtle transition-colors hover:text-white">
          <LogOut size={16} />
          Log Out
        </button>
      </div>
    </aside>
  );
}
