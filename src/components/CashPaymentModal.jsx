import React, { useState } from "react";
import { formatPeso } from "@/lib/constants";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CashPaymentModal({ open, order, total, onClose, onComplete }) {
  const [cash, setCash] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  const totalNum = Number(total || 0);
  const cashNum = parseFloat(cash) || 0;
  const change = cashNum - totalNum;
  const canComplete = cashNum >= totalNum;

  const handleQuick = (amount) => {
    if (amount === "exact") {
      setCash(totalNum.toFixed(2));
    } else {
      setCash((cashNum + amount).toFixed(2));
    }
    setError("");
  };

  const handleComplete = () => {
    if (!canComplete) {
      setError("Cash tendered is less than the total amount due.");
      return;
    }
    onComplete({ cashTendered: cashNum, changeGiven: change });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-base font-bold text-foreground">Cash Payment Processing</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Order summary */}
          <div className="border border-border rounded-lg p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Order Summary</p>
            <div className="space-y-2">
              {order.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-foreground">{item.qty}x {item.name}</span>
                  <span className="text-foreground font-medium">{formatPeso(item.price * item.qty)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border mt-3 pt-3 flex justify-between text-sm">
              <span className="text-muted-foreground">Discounts (None Applied)</span>
              <span className="text-muted-foreground">{formatPeso(0)}</span>
            </div>
          </div>

          {/* Total */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Total Amount Due</p>
            <p className="text-3xl font-bold text-[#2E7D32] mt-0.5">{formatPeso(totalNum)}</p>
          </div>

          {/* Cash input */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Cash Tendered (₱)</label>
            <Input
              type="number"
              value={cash}
              onChange={(e) => { setCash(e.target.value); setError(""); }}
              placeholder="0.00"
              className="h-12 text-lg font-semibold border-primary focus:border-primary text-foreground"
            />
          </div>

          {/* Quick cash */}
          <div className="grid grid-cols-4 gap-2">
            <button onClick={() => handleQuick("exact")} className="h-9 border border-border rounded-lg text-xs font-medium text-foreground hover:bg-muted">Exact</button>
            <button onClick={() => handleQuick(100)} className="h-9 border border-border rounded-lg text-xs font-medium text-foreground hover:bg-muted">+₱100</button>
            <button onClick={() => handleQuick(500)} className="h-9 border border-border rounded-lg text-xs font-medium text-foreground hover:bg-muted">+₱500</button>
            <button onClick={() => handleQuick(1000)} className="h-9 border border-border rounded-lg text-xs font-medium text-foreground hover:bg-muted">+₱1,000</button>
          </div>

          {/* Change due */}
          <div className="bg-[#FFF9C4] rounded-lg px-4 py-3 flex justify-between items-center">
            <span className="text-sm font-bold text-[#BF6F00]">Change Due</span>
            <span className="text-xl font-bold text-[#BF6F00]">{formatPeso(change > 0 ? change : 0)}</span>
          </div>

          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

          {/* Footer */}
          <div className="flex gap-3 pt-1">
            <Button variant="outline" onClick={onClose} className="flex-1 h-11 border-border text-foreground font-medium">
              Cancel &amp; Edit Cart
            </Button>
            <Button onClick={handleComplete} disabled={!canComplete} className="flex-1 h-11 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-semibold">
              Complete Transaction
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}