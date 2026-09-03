import {
  Calendar,
  CircleDollarSign,
  ShoppingCart,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const kpis = [
  {
    label: "Today's Sales",
    value: "₱28,450.50",
    hint: "+12.4% vs yesterday",
    icon: CircleDollarSign,
    iconBg: "bg-pos-green-soft",
    iconColor: "text-pos-primary",
  },
  {
    label: "Total Orders",
    value: "142 Completed",
    hint: "Avg ticket size: ₱200",
    icon: ShoppingCart,
    iconBg: "bg-pos-blue-soft",
    iconColor: "text-pos-blue",
  },
  {
    label: "Low Stock Alerts",
    value: "4 Items Left",
    hint: "Critical replenishments needed",
    icon: AlertTriangle,
    iconBg: "bg-pos-red-soft",
    iconColor: "text-pos-red",
  },
];

const weeklySales = [
  { day: "Mon", value: 120 },
  { day: "Tue", value: 145 },
  { day: "Wed", value: 110 },
  { day: "Thu", value: 165 },
  { day: "Fri", value: 190 },
  { day: "Sat", value: 240 },
  { day: "Sun", value: 180 },
];

const maxSales = Math.max(...weeklySales.map((d) => d.value));

const transactions = [
  {
    time: "Today, 10:42 AM",
    items: "Sinandomeng Rice 5kg, Alaska Milk, Gardenia",
    total: "₱462.00",
    status: "Completed",
  },
  {
    time: "Today, 10:35 AM",
    items: "Lucky Me (x5), Ligo Sardines (x2), Eggs",
    total: "₱153.00",
    status: "Completed",
  },
  {
    time: "Today, 10:11 AM",
    items: "Datu Puti Soy Sauce, Plump Tomatoes",
    total: "₱107.00",
    status: "Completed",
  },
];

export default function Index() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-extrabold text-pos-dark">
            Welcome back, Maria
          </h1>
          <p className="text-sm text-pos-muted">
            Here's the store health overview for today.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-pos-border bg-white px-4 py-2">
          <Calendar size={16} className="text-pos-muted" />
          <span className="text-sm font-semibold text-pos-dark">
            August 28, 2026
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {kpis.map(({ label, value, hint, icon: Icon, iconBg, iconColor }) => (
          <div
            key={label}
            className="flex items-center gap-4 rounded-xl border border-pos-border bg-white p-5 shadow-[0_4px_16px_rgba(0,0,0,0.05)]"
          >
            <div
              className={cn(
                "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl",
                iconBg,
              )}
            >
              <Icon size={22} className={iconColor} />
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <span className="text-[13px] font-medium text-pos-muted">
                {label}
              </span>
              <span className="font-roboto text-[22px] font-bold text-pos-dark">
                {value}
              </span>
              <span className="text-[11px] text-pos-subtle">{hint}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="flex flex-1 flex-col gap-4 rounded-xl border border-pos-border bg-white p-5 shadow-[0_4px_16px_rgba(0,0,0,0.05)]">
          <h2 className="text-base font-bold text-pos-dark">
            Weekly Sales Trends (₱ '000)
          </h2>
          <div className="flex h-[160px] items-end justify-center gap-4 pt-4 sm:gap-8">
            {weeklySales.map(({ day, value }) => (
              <div
                key={day}
                className="flex w-10 flex-col items-center gap-2"
              >
                <span className="font-roboto text-[11px] text-pos-muted">
                  ₱{value}k
                </span>
                <div
                  className="w-7 rounded-t-[4px] bg-pos-primary"
                  style={{ height: `${(value / maxSales) * 160}px` }}
                />
                <span className="text-xs font-semibold text-pos-muted">
                  {day}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start gap-4 rounded-xl border border-pos-border bg-white p-5 shadow-[0_4px_16px_rgba(0,0,0,0.05)]">
        <div className="flex w-full items-center justify-between">
          <h2 className="text-base font-bold text-pos-dark">
            Recent Transactions
          </h2>
          <button className="flex items-center gap-1 text-sm font-semibold text-pos-primary hover:underline">
            View All History
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="flex w-full flex-col">
          <div className="hidden rounded-md bg-[#F5F5F5] p-3 sm:flex">
            <span className="w-40 text-[13px] font-semibold text-pos-muted">
              Date & Time
            </span>
            <span className="flex-1 text-[13px] font-semibold text-pos-muted">
              Items Purchased
            </span>
            <span className="w-32 text-[13px] font-semibold text-pos-muted">
              Total
            </span>
            <span className="w-28 text-[13px] font-semibold text-pos-muted">
              Status
            </span>
          </div>

          {transactions.map((tx) => (
            <div
              key={tx.time}
              className="flex w-full flex-col gap-2 border-b border-pos-border p-3 sm:flex-row sm:items-center sm:gap-0"
            >
              <span className="w-40 flex-shrink-0 text-[13px] text-pos-muted">
                {tx.time}
              </span>
              <span className="flex-1 truncate text-[13px] text-pos-muted">
                {tx.items}
              </span>
              <span className="w-32 flex-shrink-0 font-roboto text-[13px] font-bold text-pos-dark">
                {tx.total}
              </span>
              <span className="w-28 flex-shrink-0">
                <span className="inline-flex items-center rounded-full bg-pos-green-soft px-2.5 py-1 text-[11px] font-semibold text-pos-primary">
                  {tx.status}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
