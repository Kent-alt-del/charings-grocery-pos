import React, { useEffect, useState, useMemo } from "react";
import { listSales } from "@/lib/dataApi";
import { formatPeso } from "@/lib/constants";
import { Calendar, DollarSign, Receipt, TrendingUp, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";

export default function SalesHistory() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const pageSize = 8;

  useEffect(() => {
    (async () => {
      try {
        const s = await listSales("-transaction_date", 500);
        setSales(s);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    return sales.filter((s) => {
      if (!s.transaction_date) return true;
      const d = new Date(s.transaction_date);
      if (fromDate && d < new Date(fromDate)) return false;
      if (toDate && d > new Date(toDate + "T23:59:59")) return false;
      return true;
    });
  }, [sales, fromDate, toDate]);

  const completed = filtered.filter((s) => s.status === "Completed");
  const revenue = completed.reduce((sum, s) => sum + (s.total || 0), 0);
  const txnCount = completed.length;
  const avgOrder = txnCount > 0 ? revenue / txnCount : 0;

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const fmtDate = (d) => {
    if (!d) return "";
    const date = new Date(d);
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (date.toDateString() === today) return "Today, " + date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    if (date.toDateString() === yesterday) return "Yesterday, " + date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    return date.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  };

  const exportCSV = () => {
    const headers = ["Date & Time", "Cashier", "Items Count", "Payment Method", "Total", "Status"];
    const rows = filtered.map((s) => [
      s.transaction_date ? new Date(s.transaction_date).toISOString() : "",
      s.cashier_name || "",
      s.items_count || 0,
      s.payment_method || "",
      s.total || 0,
      s.status || "",
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sales-history.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-7">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Sales History Log</h1>
        <p className="text-sm text-muted-foreground mt-1">Review customer transactions, cash flows, and generated invoices.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-5 mb-6">
        <SummaryCard icon={DollarSign} tint="green" value={formatPeso(revenue)} label="Selected Period Revenue" sub="Calculated from active filter date" />
        <SummaryCard icon={Receipt} tint="blue" value={`${txnCount} Completed`} label="Total Transactions" sub="0 Voided / 0 Refunds processed" />
        <SummaryCard icon={TrendingUp} tint="amber" value={formatPeso(avgOrder)} label="Average Order Value" sub="Avg 4.2 products per cart" />
      </div>

      {/* Filter toolbar */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">From:</span>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input type="date" value={fromDate} onChange={(e) => { setFromDate(e.target.value); setPage(1); }} className="h-10 pl-9 w-[170px] border-border" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">To:</span>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input type="date" value={toDate} onChange={(e) => { setToDate(e.target.value); setPage(1); }} className="h-10 pl-9 w-[170px] border-border" />
          </div>
        </div>
        <div className="flex-1" />
        <Button onClick={exportCSV} variant="outline" className="h-10 px-4 border-border text-foreground font-medium">
          <Download className="w-4 h-4 mr-1.5" /> Export CSV
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              {["Date & Time", "Cashier", "Items Count", "Payment Method", "Total (₱)", "Invoices"].map((h) => (
                <th key={h} className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-12"><div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" /></td></tr>
            ) : paged.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-sm text-muted-foreground">No transactions found.</td></tr>
            ) : paged.map((s) => (
              <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-5 py-3 text-sm text-foreground">{fmtDate(s.transaction_date)}</td>
                <td className="px-5 py-3 text-sm text-foreground capitalize">{s.cashier_name || "—"}</td>
                <td className="px-5 py-3 text-sm text-foreground">{s.items_count || 0} items</td>
                <td className="px-5 py-3 text-sm text-foreground">{s.payment_method || "—"}</td>
                <td className="px-5 py-3 text-sm font-semibold text-foreground">{formatPeso(s.total)}</td>
                <td className="px-5 py-3">
                  <button onClick={() => setSelected(s)} className="text-sm font-medium text-[#2E7D32] hover:underline flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-5">
        <p className="text-sm text-muted-foreground">Showing {filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} Completed Transactions</p>
        <div className="flex gap-1">
          <Button variant="outline" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)} className="h-9 px-3 text-sm border-border">Previous</Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button key={n} onClick={() => setPage(n)} className={`w-9 h-9 rounded-md text-sm font-medium border ${n === currentPage ? "bg-[#2E7D32] text-white border-[#2E7D32]" : "border-border text-foreground hover:bg-muted"}`}>{n}</button>
          ))}
          <Button variant="outline" disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)} className="h-9 px-3 text-sm border-border">Next</Button>
        </div>
      </div>

      {/* Details dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>Full breakdown of this transaction.</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="border border-border rounded-lg p-4 space-y-2">
                {selected.items?.map((i, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-foreground">{i.qty}x {i.product_name}</span>
                    <span className="font-medium">{formatPeso(i.total)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Date & Time</span><span className="font-medium">{new Date(selected.transaction_date).toLocaleString("en-US")}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Cashier</span><span className="font-medium capitalize">{selected.cashier_name}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Payment Method</span><span className="font-medium">{selected.payment_method}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-medium">{formatPeso(selected.subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">12% VAT Included</span><span className="font-medium">{formatPeso(selected.vat)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Cash Tendered</span><span className="font-medium">{formatPeso(selected.cash_tendered)}</span></div>
                <div className="flex justify-between border-t border-border pt-2"><span className="font-semibold text-foreground">Total</span><span className="font-bold text-[#2E7D32]">{formatPeso(selected.total)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Change Given</span><span className="font-medium text-[#2E7D32]">{formatPeso(selected.change_given)}</span></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SummaryCard({ icon: Icon, tint, value, label, sub }) {
  const tints = { green: "bg-green-100 text-green-700", blue: "bg-blue-100 text-blue-700", amber: "bg-amber-100 text-amber-700" };
  return (
    <div className="bg-white rounded-xl border border-border p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${tints[tint]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xl font-bold text-foreground">{value}</p>
        <p className="text-sm font-medium text-foreground mt-0.5">{label}</p>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </div>
    </div>
  );
}