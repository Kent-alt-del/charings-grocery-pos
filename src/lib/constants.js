export const CATEGORIES = [
  "Grains & Rice",
  "Canned Goods",
  "Snacks",
  "Beverages & Oil",
  "Dairy & Eggs",
  "Fruits",
  "Vegetables",
  "Snacks & Bread",
];

export const POS_CATEGORIES = [
  "All",
  "Fruits",
  "Vegetables",
  "Dairy",
  "Beverages",
  "Snacks",
  "Canned Goods",
];

export const UNITS = ["pcs", "sacks", "kg", "doz", "packs", "L", "boxes"];

export const PAYMENT_METHODS = ["Cash", "GCash", "Maya"];

export const formatPeso = (amount) => {
  const n = Number(amount || 0);
  return "₱" + n.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const getStockStatus = (product) => {
  if (product.stock_qty <= 0) return "Out of Stock";
  const reorder = product.reorder_level ?? 10;
  if (product.stock_qty <= reorder) return "Low Stock";
  return "In Stock";
};