import React, { useEffect, useState, useMemo } from "react";
import { listProducts, createSale, updateProduct } from "@/lib/dataApi";
import { useAuth } from "@/lib/AuthContext";
import { formatPeso, POS_CATEGORIES } from "@/lib/constants";
import { Search, Plus, Minus, Trash2, Printer, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import CashPaymentModal from "@/components/CashPaymentModal";

const VAT_RATE = 0.12;

export default function POS() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState([]); // {id, name, price, qty}
  const [showPayment, setShowPayment] = useState(false);
  const [lastSale, setLastSale] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const p = await listProducts();
        setProducts(p);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const cashierName = user?.display_name || user?.full_name || (user?.email ? user.email.split("@")[0].replace(/[._]/g, " ") : "Cashier");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "All" || p.category === category;
      return matchSearch && matchCat;
    });
  }, [products, search, category]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const removeItem = (id) => setCart((prev) => prev.filter((i) => i.id !== id));

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const vat = subtotal * (VAT_RATE / (1 + VAT_RATE));
  const total = subtotal;
  const itemCount = cart.reduce((sum, i) => sum + i.qty, 0);

  const handleComplete = async ({ cashTendered, changeGiven }) => {
    const saleRecord = {
      transaction_date: new Date().toISOString(),
      cashier_name: cashierName,
      items: cart.map((i) => ({ product_name: i.name, qty: i.qty, price: i.price, total: i.price * i.qty })),
      items_count: itemCount,
      subtotal,
      vat,
      total,
      payment_method: "Cash",
      cash_tendered: cashTendered,
      change_given: changeGiven,
      status: "Completed",
    };

    try {
      const created = await createSale(saleRecord);
      // Decrement stock
      await Promise.all(
        cart.map((i) =>
          updateProduct(i.id, {
            stock_qty: Math.max(0, (products.find((p) => p.id === i.id)?.stock_qty || 0) - i.qty),
          })
        )
      );
      setProducts((prev) =>
        prev.map((p) => {
          const ci = cart.find((i) => i.id === p.id);
          return ci ? { ...p, stock_qty: Math.max(0, p.stock_qty - ci.qty) } : p;
        })
      );
      setLastSale({ ...saleRecord, id: created?.id, transaction_date: saleRecord.transaction_date });
      setShowPayment(false);
      setCart([]);
    } catch (e) {
      console.error(e);
      toast({ title: "Transaction failed", description: e.message || "Unknown error", variant: "destructive" });
    }
  };

  const handleNewTransaction = () => {
    setLastSale(null);
  };

  // ---- Transaction Success Screen ----
  if (lastSale) {
    return <SuccessScreen sale={lastSale} cashierName={cashierName} onNew={handleNewTransaction} />;
  }

  return (
    <div className="flex h-screen">
      {/* Main product area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="p-7 pb-5">
          <h1 className="text-2xl font-bold text-foreground mb-1">Point of Sale</h1>
          <p className="text-sm text-muted-foreground">Search and add Filipino grocery items to the current order.</p>
        </div>

        {/* Search */}
        <div className="px-7 pb-1">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Filipino items, groceries, canned goods..."
              className="pl-10 h-11 border-border"
            />
          </div>
        </div>

        {/* Category pills */}
        <div className="px-7 py-5 flex gap-2.5 flex-wrap">
          {POS_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category === cat
                  ? "bg-[#2E7D32] text-white"
                  : "bg-white border border-border text-foreground hover:bg-muted"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <div className="flex-1 overflow-y-auto px-7 pb-7 scrollbar-thin">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-16">No products found.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-3 xl:gap-5">
              {filtered.map((p) => {
                const out = p.stock_qty <= 0;
                return (
                  <div key={p.id} className="bg-white rounded-xl border border-border overflow-hidden flex flex-col">
                    <div className="aspect-square bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center relative">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-4xl font-bold text-[#2E7D32]/30">{p.name.charAt(0)}</span>
                      )}
                      {out && (
                        <span className="absolute top-2 right-2 text-[10px] font-semibold bg-red-100 text-red-700 px-2 py-0.5 rounded">Out</span>
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <p className="text-sm font-semibold text-foreground leading-tight mb-1 line-clamp-2">{p.name}</p>
                      <p className="text-xs text-muted-foreground mb-2">{p.category}</p>
                      <p className="text-base font-bold text-[#2E7D32] mb-2">{formatPeso(p.price)}</p>
                      <button
                        onClick={() => addToCart(p)}
                        disabled={out}
                        className="mt-auto w-full h-8 bg-primary-light text-[#2E7D32] text-xs font-semibold rounded-lg hover:bg-primary/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Current order panel */}
      <div className="w-[340px] shrink-0 bg-white border-l border-border flex flex-col">
        <div className="px-6 py-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Current Order</h2>
            <span className="text-xs font-semibold bg-primary text-white px-2.5 py-1 rounded-full">{itemCount} Items</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar-thin">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-3">
                <Plus className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">No items yet</p>
              <p className="text-xs text-muted-foreground mt-1">Add products from the grid to start an order.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{formatPeso(item.price)} each</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 rounded-md border border-border flex items-center justify-center hover:bg-muted">
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-sm font-semibold w-6 text-center tabular-nums">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 rounded-md border border-border flex items-center justify-center hover:bg-muted">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-right w-16">
                    <p className="text-sm font-bold text-foreground">{formatPeso(item.price * item.qty)}</p>
                    <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-red-500 mt-0.5">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary footer */}
        <div className="border-t border-border p-6 space-y-3.5">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium text-foreground">{formatPeso(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">12% VAT Included</span>
            <span className="font-medium text-foreground">{formatPeso(vat)}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-border">
            <span className="text-sm font-semibold text-foreground">Total Amount Due</span>
            <span className="text-xl font-bold text-[#2E7D32]">{formatPeso(total)}</span>
          </div>
          <Button
            onClick={() => setShowPayment(true)}
            disabled={cart.length === 0}
            className="w-full h-11 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-semibold text-sm rounded-lg disabled:opacity-40"
          >
            Proceed to Payment
          </Button>
        </div>
      </div>

      <CashPaymentModal
        open={showPayment}
        order={cart}
        total={total}
        onClose={() => setShowPayment(false)}
        onComplete={handleComplete}
      />
    </div>
  );
}

// ---- Success Screen ----
function SuccessScreen({ sale, cashierName, onNew }) {
  const dt = new Date(sale.transaction_date);
  const dateStr = dt.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Success header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[#2E7D32] flex items-center justify-center mb-4">
            <CheckCircle2 className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#2E7D32]">Transaction Successful</h1>
          <p className="text-sm text-muted-foreground mt-1">Order has been completed and recorded.</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Transaction details */}
          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="text-base font-bold text-foreground mb-4">Transaction Details</h2>
            <div className="space-y-3 text-sm">
              <DetailRow label="Date & Time" value={dateStr} />
              <DetailRow label="Cashier Name" value={cashierName} />
              <DetailRow label="Payment Method" value={sale.payment_method} />
              <DetailRow label="Total Due" value={formatPeso(sale.total)} />
              <DetailRow label="Cash Tendered" value={formatPeso(sale.cash_tendered)} />
              <DetailRow label="Change Given" value={formatPeso(sale.change_given)} highlight />
            </div>
            <div className="flex gap-3 mt-6">
              <Button onClick={() => window.print()} className="flex-1 h-11 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-semibold text-sm">
                <Printer className="w-4 h-4 mr-2" /> Print Receipt
              </Button>
              <Button onClick={onNew} variant="outline" className="flex-1 h-11 border-[#2E7D32] text-[#2E7D32] font-semibold text-sm hover:bg-primary-light">
                New Transaction
              </Button>
            </div>
          </div>

          {/* Receipt preview */}
          <div className="bg-white rounded-xl border border-border p-6">
            <div className="border border-dashed border-border rounded-lg p-5 font-mono text-xs">
              <div className="text-center mb-3">
                <p className="font-bold text-sm">CHARING'S GROCERY</p>
                <p>142 Rizal Avenue, Manila</p>
                <p>VAT Reg TIN: 102-452-921-000</p>
              </div>
              <div className="border-t border-dashed border-border pt-2 mb-2">
                <p>{dateStr}</p>
                <p>Cashier: {cashierName}</p>
              </div>
              <div className="border-t border-dashed border-border pt-2 space-y-1.5">
                {sale.items.map((i, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between">
                      <span>{i.product_name}</span>
                      <span>{formatPeso(i.total)}</span>
                    </div>
                    <p className="text-muted-foreground">{i.qty} x {formatPeso(i.price)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-dashed border-border pt-2 mt-2 space-y-1">
                <div className="flex justify-between"><span>Subtotal:</span><span>{formatPeso(sale.subtotal)}</span></div>
                <div className="flex justify-between"><span>12% VAT Included:</span><span>{formatPeso(sale.vat)}</span></div>
                <div className="flex justify-between font-bold"><span>TOTAL DUE:</span><span>{formatPeso(sale.total)}</span></div>
                <div className="flex justify-between"><span>Cash Tendered:</span><span>{formatPeso(sale.cash_tendered)}</span></div>
                <div className="flex justify-between font-bold"><span>CHANGE DUE:</span><span>{formatPeso(sale.change_given)}</span></div>
              </div>
              <div className="border-t border-dashed border-border pt-2 mt-2 text-center">
                <p>Thank you for shopping!</p>
                <p>Please come again.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, highlight }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={highlight ? "font-bold text-[#2E7D32]" : "font-medium text-foreground"}>{value}</span>
    </div>
  );
}