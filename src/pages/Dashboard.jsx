import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { listProducts, listSales } from "@/lib/dataApi";
import { useAuth } from "@/lib/AuthContext";
import { formatPeso, getStockStatus } from "@/lib/constants";
import { Calendar, ShoppingBag, ShoppingCart, AlertTriangle, TrendingUp, ArrowRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function Dashboard() {
  const { user } = useAuth();
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [s, p] = await Promise.all([
          listSales("-transaction_date", 200),
          listProducts(),
        ]);
        setSales(s);
        setProducts(p);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const displayName = user?.display_name || user?.full_name || (user?.email ? user.email.split("@")[0].replace(/[._]/g, " ") : "Cashier");

  const todayStr = new Date().toDateString();
  const todaySales = sales.filter((s) => s.transaction_date && new Date(s.transaction_date).toDateString() === todayStr);
  const todayTotal = todaySales.reduce((sum, s) => sum + (s.total || 0), 0);
  const todayOrders = todaySales.length;
  const avgOrder = todayOrders > 0 ? todayTotal / todayOrders : 0;
  const lowStockCount = products.filter((p) => getStockStatus(p) !== "In Stock").length;

  // Weekly chart data (last 7 days)
  const weeklyData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString("en-US", { weekday: "short" });
      const total = sales
        .filter((s) => s.transaction_date && new Date(s.transaction_date).toDateString() === d.toDateString())
        .reduce((sum, s) => sum + (s.total || 0), 0);
      days.push({ name: label, sales: Math.round(total) });
    }
    return days;
  }, [sales]);

  const recent = sales.slice(0, 5);
  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-7">
      {/* Header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="text-2xl font-bold text-foreground capitalize">Welcome back, {displayName}</h1>
          <p className="text-sm text-muted-foreground mt-1">Here's the store health overview for today.</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-border rounded-lg px-3.5 py-2.5">
          <Calendar className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">{today}</span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-5 mb-7">
        <StatCard icon={ShoppingBag} label="Today's Sales" value={formatPeso(todayTotal)} sub="12.4% vs yesterday" tint="green" />
        <StatCard icon={ShoppingCart} label="Total Orders" value={`${todayOrders} Completed`} sub={`Avg: ${formatPeso(avgOrder)}/Order`} tint="blue" />
        <StatCard icon={AlertTriangle} label="Low Stock Alerts" value={`${lowStockCount} Items Left`} sub="Critical material needed to be headed" tint="amber" />
      </div>

      {/* Chart + recent */}
      <div className="grid grid-cols-3 gap-5">
        {/* Chart */}
        <div className="col-span-2 bg-white rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-foreground">Weekly Sales Trends</h2>
              <p className="text-xs text-muted-foreground">Revenue in Philippine Peso (₱)</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-md">
              <TrendingUp className="w-3.5 h-3.5" /> This Week
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={weeklyData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#707070" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#707070" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}K`} />
              <Tooltip
                cursor={{ fill: "#f5f7f9" }}
                formatter={(v) => [formatPeso(v), "Sales"]}
                contentStyle={{ borderRadius: 8, border: "1px solid #E0E0E0", fontSize: 12 }}
              />
              <Bar dataKey="sales" fill="#2E7D32" radius={[6, 6, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent transactions */}
        <div className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-foreground">Recent Transactions</h2>
            <Link to="/sales-history" className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {recent.length === 0 && <p className="text-sm text-muted-foreground py-6 text-center">No transactions yet.</p>}
            {recent.map((s) => (
              <div key={s.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {s.items?.map((i) => i.product_name).join(", ") || "Transaction"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {s.transaction_date ? new Date(s.transaction_date).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : ""}
                  </p>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <p className="text-sm font-bold text-foreground">{formatPeso(s.total)}</p>
                  <span className="text-[10px] font-medium text-green-700 bg-green-100 px-1.5 py-0.5 rounded">{s.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, tint }) {
  const tints = {
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-700",
    amber: "bg-amber-100 text-amber-700",
  };
  return (
    <div className="bg-white rounded-xl border border-border p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tints[tint]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{sub}</p>
    </div>
  );
}