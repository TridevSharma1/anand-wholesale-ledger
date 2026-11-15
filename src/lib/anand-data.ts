export type Role = "Admin" | "Cashier";

export const adminNavigation = ["Dashboard", "Categories", "Products", "Purchase Entry", "Vendors", "Purchase Reports", "Sales Billing", "Customers", "Inventory", "Stock", "Expenses", "Reports", "Vendor Dues", "Settings"];
export const cashierNavigation = ["Dashboard", "Sales Billing", "Product Search", "Customers"];
export const canRoleAccess = (role: Role, view: string) =>
  role === "Admin" ? adminNavigation.includes(view) : cashierNavigation.includes(view);

export const categories = [
  "Packaged Foods", "Personal Care", "Home Care", "Beverages", "Snacks",
  "Dairy & Chilled", "Kitchen Essentials", "Stationery", "Health & Wellness", "Household Goods",
].map((name, index) => ({
  id: `CAT-${String(index + 1).padStart(3, "0")}`,
  name,
  description: ["Everyday essentials for retail partners", "Trusted brands, ready for your shelves", "Quality wholesale selection"][index % 3],
  status: index === 8 ? "Inactive" : "Active",
}));

const productSeeds = [
  ["Sunflower Oil", "Packaged Foods", "GoldDrop", "1 L", 118, 142, "Bottle"],
  ["Basmati Rice", "Packaged Foods", "Royal Harvest", "5 kg", 420, 489, "Bag"],
  ["Toor Dal", "Packaged Foods", "Daily Basket", "1 kg", 126, 154, "Pack"],
  ["Wheat Flour", "Packaged Foods", "Annapurna", "5 kg", 205, 249, "Bag"],
  ["Tata Salt", "Packaged Foods", "Tata", "1 kg", 18, 24, "Pack"],
  ["Green Tea", "Beverages", "Twinings", "100 g", 142, 179, "Box"],
  ["Instant Coffee", "Beverages", "Sunrise", "200 g", 91, 116, "Jar"],
  ["Mango Drink", "Beverages", "Maaza", "1.2 L", 62, 78, "Bottle"],
  ["Butter Cookies", "Snacks", "Sunfeast", "300 g", 37, 48, "Pack"],
  ["Masala Chips", "Snacks", "Bingo", "90 g", 15, 20, "Pack"],
  ["Dark Chocolate", "Snacks", "Amul", "150 g", 78, 99, "Bar"],
  ["Bath Soap", "Personal Care", "Dove", "125 g", 42, 55, "Bar"],
  ["Shampoo", "Personal Care", "Clinic Plus", "340 ml", 126, 158, "Bottle"],
  ["Toothpaste", "Personal Care", "Colgate", "200 g", 72, 92, "Tube"],
  ["Hand Wash", "Personal Care", "Savlon", "750 ml", 114, 142, "Bottle"],
  ["Washing Powder", "Home Care", "Surf Excel", "2 kg", 192, 239, "Bag"],
  ["Dishwash Liquid", "Home Care", "Vim", "500 ml", 78, 98, "Bottle"],
  ["Floor Cleaner", "Home Care", "Lizol", "1 L", 121, 149, "Bottle"],
  ["Toilet Cleaner", "Home Care", "Harpic", "500 ml", 91, 112, "Bottle"],
  ["Toned Milk", "Dairy & Chilled", "Nandini", "1 L", 41, 49, "Pouch"],
  ["Ghee", "Dairy & Chilled", "Nandini", "500 ml", 298, 349, "Jar"],
  ["Fresh Paneer", "Dairy & Chilled", "Nandini", "200 g", 72, 89, "Pack"],
  ["Steel Tumbler", "Kitchen Essentials", "Milton", "350 ml", 88, 119, "Piece"],
  ["Storage Box", "Kitchen Essentials", "Cello", "1.2 L", 96, 129, "Piece"],
  ["Ball Pen Blue", "Stationery", "Reynolds", "Pack of 10", 68, 89, "Pack"],
  ["A4 Paper", "Stationery", "JK Copier", "500 sheets", 232, 279, "Ream"],
  ["LED Bulb", "Household Goods", "Philips", "9 W", 92, 125, "Piece"],
  ["Floor Mat", "Household Goods", "HomeStyle", "Medium", 110, 159, "Piece"],
  ["Vitamin C", "Health & Wellness", "HealthKart", "60 tablets", 154, 199, "Bottle"],
  ["Bandage Roll", "Health & Wellness", "Dr. Care", "5 cm", 28, 39, "Roll"],
];

export const products = productSeeds.map(([name, category, brand, size, purchase, selling, unit], index) => ({
  id: `PRD-${String(index + 1).padStart(3, "0")}`,
  name: String(name), category: String(category), brand: String(brand), size: String(size),
  sku: `ANW-${String(501 + index)}`, purchasePrice: Number(purchase), sellingPrice: Number(selling),
  quantity: [8, 14, 24, 36, 48, 63, 82, 112, 144, 208][index % 10],
  unit: String(unit), barcode: `890${String(340000000000 + index * 1543)}`,
}));

export const vendors = Array.from({ length: 20 }, (_, i) => {
  const names = ["Karnataka Foods Co.", "Southern Distributors", "Metro Essentials", "Nandi Traders", "Vijaya Supply House", "BlueRock Wholesale", "Freshway Agencies", "Deccan Retail Supply"];
  return {
    id: `VEN-${String(i + 1).padStart(3, "0")}`, name: names[i % names.length] + (i >= names.length ? ` ${Math.floor(i / names.length) + 1}` : ""),
    phone: `+91 98${String(41000000 + i * 173).slice(0, 8)}`, email: `orders${i + 1}@${["karnatakafoods", "southerntrade", "deccansupply"][i % 3]}.in`,
    gst: `29AABCU${String(1000 + i)}F1Z${i % 9 + 1}`, address: ["Vijayapura, Karnataka", "Solapur, Maharashtra", "Hubballi, Karnataka"][i % 3],
    outstanding: [0, 12400, 28600, 7400, 31800][i % 5], dueDate: `2026-11-${String(9 + i % 20).padStart(2, "0")}`, status: i === 8 ? "Inactive" : "Active",
  };
});

export const customers = Array.from({ length: 30 }, (_, i) => {
  const names = ["Mahalaxmi General Stores", "Shree Ganesh Mart", "Patil Supermarket", "City Corner Shop", "Vijayapura Daily Needs", "New Market Provision Store", "Sai Kirana & General", "Basava Trading Co."];
  return {
    id: `CUS-${String(i + 1).padStart(3, "0")}`, name: names[i % names.length] + (i >= names.length ? ` ${Math.floor(i / names.length) + 1}` : ""),
    phone: `+91 99${String(17830000 + i * 271).slice(0, 8)}`, address: ["Vijayapura", "Tidagundi", "Sindagi", "Solapur"][i % 4],
    totalPurchase: 18450 + (i * 7361) % 135000, outstanding: [0, 1850, 4720, 980][i % 4],
  };
});

export const purchases = Array.from({ length: 50 }, (_, i) => {
  const vendor = vendors[i % vendors.length];
  const product = products[(i * 3) % products.length];
  const quantity = 12 + (i * 7) % 92;
  const total = quantity * product.purchasePrice;
  const due = [0, 0, 0, 1240, 3800, 6800][i % 6];
  const day = String(1 + (i % 28)).padStart(2, "0");
  return {
    id: `PUR-${String(20261000 + i)}`, vendor: vendor.name, product: product.name, quantity, total,
    paid: total - due, due, dueDate: `2026-11-${String(2 + (i * 3) % 28).padStart(2, "0")}`,
    payment: due === 0 ? "Paid" : i % 3 === 0 ? "Overdue" : "Pending", date: `2026-11-${day}`, invoice: `INV-${8001 + i}`,
  };
});

export const sales = Array.from({ length: 100 }, (_, i) => {
  const customer = customers[i % customers.length];
  const product = products[(i * 7 + 4) % products.length];
  return {
    id: `ANW-${String(4101 + i)}`, customer: customer.name, product: product.name,
    quantity: 1 + (i * 3) % 18, total: product.sellingPrice * (1 + (i * 3) % 18),
    payment: ["Cash", "UPI", "Card"][i % 3], date: `2026-11-${String(1 + i % 28).padStart(2, "0")}`,
  };
});

export const expenses = Array.from({ length: 20 }, (_, i) => {
  const categories = ["Electricity", "Rent", "Salary", "Transport", "Office Expense", "Maintenance", "Miscellaneous"];
  return {
    id: `EXP-${String(i + 1).padStart(3, "0")}`, name: ["Monthly electricity", "Warehouse rent", "Local delivery", "Staff wages", "Printer supplies"][i % 5],
    category: categories[i % categories.length], amount: [5840, 32000, 2150, 18000, 1260, 4200][i % 6],
    date: `2026-11-${String(1 + i % 28).padStart(2, "0")}`, description: "Monthly business expense",
  };
});

export const formatINR = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;