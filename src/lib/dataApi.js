const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };


const DEMO_KEY = "charing_demo_mode";
const PROD_KEY = "charing_demo_products";
const SALE_KEY = "charing_demo_sales";
const NAME_KEY = "charing_demo_display_name";

export const isDemoMode = () => {
  try { return localStorage.getItem(DEMO_KEY) === "1"; } catch { return false; }
};
export const enterDemoMode = () => {
  try { localStorage.setItem(DEMO_KEY, "1"); } catch {}
};
export const exitDemoMode = () => {
  try { localStorage.removeItem(DEMO_KEY); } catch {}
};

export const getDemoDisplayName = () => {
  try { return localStorage.getItem(NAME_KEY) || "Maria Santos"; } catch { return "Maria Santos"; }
};
export const setDemoDisplayName = (name) => {
  try { localStorage.setItem(NAME_KEY, name); } catch {}
};

export const getDemoUser = () => ({
  id: "demo-user",
  email: "demo@charings.pos",
  full_name: getDemoDisplayName(),
  display_name: getDemoDisplayName(),
  role: "admin",
});

// ---- Seed data ----
const SEED_PRODUCTS = [
  { id: "p1", name: "National Grid Rice 25kg", category: "Grains & Rice", price: 1450, cost_price: 1300, stock_qty: 40, unit: "sacks", supplier: "National Grid", reorder_level: 8, description: "Premium well-milled rice, 25kg sack.", image_url: "" },
  { id: "p2", name: "Royal Premium Rice 5kg", category: "Grains & Rice", price: 320, cost_price: 280, stock_qty: 25, unit: "packs", supplier: "Royal Farms", reorder_level: 10, description: "Aromatic jasmine rice, 5kg pack.", image_url: "" },
  { id: "p3", name: "Purefoods Corned Beef 150g", category: "Canned Goods", price: 85, cost_price: 70, stock_qty: 120, unit: "pcs", supplier: "Purefoods", reorder_level: 24, description: "Premium corned beef, 150g can.", image_url: "" },
  { id: "p4", name: "Argentina Corned Beef 340g", category: "Canned Goods", price: 165, cost_price: 140, stock_qty: 8, unit: "pcs", supplier: "Argentina", reorder_level: 24, description: "Chunky corned beef, 340g can.", image_url: "" },
  { id: "p5", name: "Century Tuna Flakes 180g", category: "Canned Goods", price: 72, cost_price: 58, stock_qty: 90, unit: "pcs", supplier: "Century Pacific", reorder_level: 20, description: "Tuna flakes in oil, 180g.", image_url: "" },
  { id: "p6", name: "Lucky Me Pancit Canton", category: "Snacks", price: 18, cost_price: 13, stock_qty: 200, unit: "pcs", supplier: "Monde Nissin", reorder_level: 50, description: "Instant stir-fry noodles.", image_url: "" },
  { id: "p7", name: "Chippy BBQ Snack 36g", category: "Snacks", price: 24, cost_price: 18, stock_qty: 0, unit: "pcs", supplier: "URC", reorder_level: 40, description: "Barbecue flavor corn snack.", image_url: "" },
  { id: "p8", name: "Piattos Cheese 85g", category: "Snacks & Bread", price: 35, cost_price: 27, stock_qty: 75, unit: "pcs", supplier: "URC", reorder_level: 30, description: "Crispy potato chips, cheese flavor.", image_url: "" },
  { id: "p9", name: "Coca-Cola 1.5L", category: "Beverages & Oil", price: 95, cost_price: 78, stock_qty: 60, unit: "L", supplier: "Coca-Cola FEMSA", reorder_level: 24, description: "Refreshing cola, 1.5 liter bottle.", image_url: "" },
  { id: "p10", name: "C2 Green Tea 500ml", category: "Beverages & Oil", price: 35, cost_price: 27, stock_qty: 110, unit: "pcs", supplier: "URC", reorder_level: 30, description: "Unsweetened green tea, 500ml.", image_url: "" },
  { id: "p11", name: "Magnolia Fresh Milk 1L", category: "Dairy & Eggs", price: 130, cost_price: 112, stock_qty: 15, unit: "L", supplier: "Magnolia", reorder_level: 12, description: "Fresh cow's milk, 1 liter.", image_url: "" },
  { id: "p12", name: "Santa Cruz Farm Eggs 1doz", category: "Dairy & Eggs", price: 95, cost_price: 80, stock_qty: 6, unit: "doz", supplier: "Santa Cruz Farm", reorder_level: 12, description: "Free-range chicken eggs, 1 dozen.", image_url: "" },
  { id: "p13", name: "Dole Pineapple (whole)", category: "Fruits", price: 65, cost_price: 50, stock_qty: 30, unit: "kg", supplier: "Dole Philippines", reorder_level: 10, description: "Sweet ripe pineapple, per kilo.", image_url: "" },
  { id: "p14", name: "Red Onions 1kg", category: "Vegetables", price: 90, cost_price: 72, stock_qty: 20, unit: "kg", supplier: "Benguet Farms", reorder_level: 15, description: "Fresh red onions, per kilo.", image_url: "" },
  { id: "p15", name: "Luna Cooking Oil 1L", category: "Beverages & Oil", price: 180, cost_price: 158, stock_qty: 45, unit: "L", supplier: "Luna Foods", reorder_level: 12, description: "Refined vegetable cooking oil, 1L.", image_url: "" },
];

function seedSales() {
  const sales = [];
  let counter = 0;
  for (let i = 6; i >= 0; i--) {
    const count = i === 0 ? 2 : (i % 2 === 0 ? 3 : 2);
    for (let j = 0; j < count; j++) {
      const day = new Date();
      day.setDate(day.getDate() - i);
      day.setHours(9 + (counter % 8), (counter * 17) % 60, 0, 0);
      const itemCount = 2 + (counter % 3);
      const items = [];
      let subtotal = 0;
      for (let k = 0; k < itemCount; k++) {
        const prod = SEED_PRODUCTS[(counter + k) % SEED_PRODUCTS.length];
        const qty = 1 + ((counter + k) % 2);
        const line = prod.price * qty;
        subtotal += line;
        items.push({ product_name: prod.name, qty, price: prod.price, total: line });
      }
      const vat = +(subtotal * (0.12 / 1.12)).toFixed(2);
      const total = subtotal;
      const cash = Math.ceil(total / 50) * 50 + 50;
      sales.push({
        id: "sale-" + (counter + 1),
        transaction_date: day.toISOString(),
        cashier_name: "Maria Santos",
        items,
        items_count: itemCount,
        subtotal,
        vat,
        total,
        payment_method: "Cash",
        cash_tendered: cash,
        change_given: +(cash - total).toFixed(2),
        status: "Completed",
        created_date: day.toISOString(),
      });
      counter++;
    }
  }
  return sales.reverse();
}

const getDemoProducts = () => {
  try {
    const raw = localStorage.getItem(PROD_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  localStorage.setItem(PROD_KEY, JSON.stringify(SEED_PRODUCTS));
  return SEED_PRODUCTS;
};
const setDemoProducts = (arr) => localStorage.setItem(PROD_KEY, JSON.stringify(arr));

const getDemoSales = () => {
  try {
    const raw = localStorage.getItem(SALE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const seeded = seedSales();
  localStorage.setItem(SALE_KEY, JSON.stringify(seeded));
  return seeded;
};
const setDemoSales = (arr) => localStorage.setItem(SALE_KEY, JSON.stringify(arr));

const uid = () => "demo-" + Math.random().toString(36).slice(2, 10);

// ---- Public data API (demo-aware) ----
export async function listProducts() {
  if (isDemoMode()) return getDemoProducts();
  return db.entities.Product.list();
}

export async function listSales(sort, limit) {
  if (isDemoMode()) {
    let arr = getDemoSales();
    if (sort === "-transaction_date") {
      arr = [...arr].sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date));
    }
    return limit ? arr.slice(0, limit) : arr;
  }
  return db.entities.Sale.list(sort, limit);
}

export async function getProduct(id) {
  if (isDemoMode()) return getDemoProducts().find((p) => p.id === id);
  return db.entities.Product.get(id);
}

export async function createProduct(data) {
  if (isDemoMode()) {
    const arr = getDemoProducts();
    const rec = { ...data, id: uid(), created_date: new Date().toISOString(), updated_date: new Date().toISOString() };
    arr.unshift(rec);
    setDemoProducts(arr);
    return rec;
  }
  return db.entities.Product.create(data);
}

export async function updateProduct(id, data) {
  if (isDemoMode()) {
    const arr = getDemoProducts().map((p) => (p.id === id ? { ...p, ...data, updated_date: new Date().toISOString() } : p));
    setDemoProducts(arr);
    return arr.find((p) => p.id === id);
  }
  return db.entities.Product.update(id, data);
}

export async function deleteProduct(id) {
  if (isDemoMode()) {
    setDemoProducts(getDemoProducts().filter((p) => p.id !== id));
    return { id };
  }
  return db.entities.Product.delete(id);
}

export async function createSale(record) {
  if (isDemoMode()) {
    const arr = getDemoSales();
    const rec = { ...record, id: uid(), created_date: new Date().toISOString() };
    arr.unshift(rec);
    setDemoSales(arr);
    return rec;
  }
  return db.entities.Sale.create(record);
}

export async function uploadFile({ file }) {
  if (isDemoMode()) {
    return { file_url: URL.createObjectURL(file) };
  }
  return db.integrations.Core.UploadFile({ file });
}