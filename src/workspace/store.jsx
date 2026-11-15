import { createContext, useContext, useMemo, useState } from "react";
import * as seed from "@/lib/anand-data";

export const TODAY = "2026-11-15";
export const inr = (n) => `₹${Math.round(Number(n) || 0).toLocaleString("en-IN")}`;
export const expenseCategories = ["Electricity", "Rent", "Salary", "Transport", "Office Expense", "Maintenance", "Miscellaneous"];

const StoreContext = createContext(null);
export const useStore = () => useContext(StoreContext);

export function StoreProvider({ children }) {
  const [categories, setCategories] = useState(seed.categories);
  const [products, setProducts] = useState(seed.products.map((p) => ({ ...p, quantity: p.quantity + 20 })));
  const [vendors, setVendors] = useState(seed.vendors);
  const [customers, setCustomers] = useState(seed.customers);
  const [purchases, setPurchases] = useState(seed.purchases.map((p, i) => ({ ...p, rate: Math.round(p.total / p.quantity), discount: 0, gst: 5, notes: "" , payment: p.due === 0 ? "Paid" : i % 4 === 1 ? "Partial" : p.payment })));
  const [sales, setSales] = useState(seed.sales.map((s) => ({ ...s, mobile: seed.customers.find((c) => c.name === s.customer)?.phone ?? "" })));
  const [expenses, setExpenses] = useState(seed.expenses);
  const [settings, setSettings] = useState({
    company: "Anand Wholesale", gst: "29AABCA9603R1Z2",
    address: "Extension Center, NH-52, Vijayapur-Solapur Rd, Tidagundi, Vijayapura, Karnataka - 586119",
    email: "anand@gmail.com", phone: "+91 91759 95609", prefix: "ANW", logo: "",
  });

  const stock = useMemo(() => products.map((p) => {
    const purchased = purchases.filter((x) => x.product.split(", ").includes(p.name)).reduce((s, x) => s + (x.items?.find((it) => it.name === p.name)?.qty ?? x.quantity), 0);
    const sold = sales.filter((x) => x.product === p.name).reduce((s, x) => s + x.quantity, 0);
    const available = Math.max(0, p.quantity + purchased - sold);
    const alert = available === 0 ? "Out of Stock" : available < 40 ? "Low Stock" : "In Stock";
    return { ...p, opening: p.quantity, purchased, sold, available, value: available * p.purchasePrice, alert };
  }), [products, purchases, sales]);

  const value = { categories, setCategories, products, setProducts, vendors, setVendors, customers, setCustomers, purchases, setPurchases, sales, setSales, expenses, setExpenses, settings, setSettings, stock };
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
