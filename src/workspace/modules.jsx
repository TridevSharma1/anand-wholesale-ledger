import { useMemo, useState } from "react";
import { Icon } from "./icons";
import { Badge, Btn, Card, ConfirmDialog, DataTable, Field, IconBtn, Modal, PageHeader, SearchBar, Select, StatCard, TextArea, useReportActions, useToast } from "./ui";
import { CrudPage } from "./CrudPage";
import { TODAY, expenseCategories, inr, useStore } from "./store";

const sum = (arr, key) => arr.reduce((s, x) => s + (Number(x[key]) || 0), 0);
const bold = (k) => (r) => <span className="font-semibold">{r[k]}</span>;
const money = (k) => (r) => inr(r[k]);
const badge = (k) => (r) => <Badge>{r[k]}</Badge>;
const isOverdue = (p) => p.due > 0 && p.dueDate < TODAY;

/* ================= Dashboard ================= */
export function Dashboard({ role, go }) {
  const s = useStore();
  const todaySales = s.sales.filter((x) => x.date === TODAY);
  const monthSales = s.sales.filter((x) => x.date.startsWith("2026-11"));
  const pendingVendor = sum(s.purchases.filter((p) => p.due > 0), "due");
  const stockValue = sum(s.stock, "value");
  const lowStock = s.stock.filter((p) => p.alert !== "In Stock");
  const recentBills = Object.values(s.sales.reduce((acc, x) => { (acc[x.id] ||= { ...x, total: 0, items: 0 }); acc[x.id].total += x.total; acc[x.id].items += 1; return acc; }, {})).slice(0, 6);

  const adminCards = [
    ["Total Products", s.products.length, "Active catalogue items", "box", "blue"],
    ["Total Categories", s.categories.length, `${s.categories.filter((c) => c.status === "Active").length} active`, "tag", "teal"],
    ["Today's Sales", inr(sum(todaySales, "total")), `${todaySales.length} line items today`, "receipt", "green"],
    ["Monthly Sales", inr(sum(monthSales, "total")), "November 2026", "chart", "amber"],
    ["Total Purchases", inr(sum(s.purchases, "total")), `${s.purchases.length} purchase records`, "cart", "blue"],
    ["Stock Value", inr(stockValue), "At purchase price", "layers", "teal"],
    ["Pending Vendor Payments", inr(pendingVendor), `${s.purchases.filter(isOverdue).length} overdue invoices`, "clock", "red"],
    ["Expenses", inr(sum(s.expenses, "amount")), `${s.expenses.length} entries this month`, "wallet", "amber"],
    ["Active Customers", s.customers.length, "Retail partners", "users", "green"],
  ];
  const cashierCards = [
    ["Today's Sales", inr(sum(todaySales, "total")), `${todaySales.length} line items`, "receipt", "green"],
    ["Bills This Month", new Set(monthSales.map((x) => x.id)).size, "November 2026", "file", "blue"],
    ["Products Available", s.stock.filter((p) => p.available > 0).length, "Ready to bill", "box", "teal"],
    ["Low Stock Items", lowStock.length, "Tell your admin", "alert", "red"],
  ];
  const cards = role === "Admin" ? adminCards : cashierCards;

  return (
    <>
      <PageHeader title={`Welcome back, ${role === "Admin" ? "Anand" : "Cashier"}`} subtitle="Here’s what’s happening at Anand Wholesale today." actions={<Btn icon="receipt" onClick={() => go("Sales Billing")}>New bill</Btn>} />
      <div className={`grid grid-cols-2 gap-3 sm:gap-4 ${role === "Admin" ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}>
        {cards.map(([label, value, detail, icon, tone]) => <StatCard key={label} label={label} value={value} detail={detail} icon={icon} tone={tone} />)}
      </div>
      <div className="mt-6 grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between"><h2 className="font-display font-bold">Recent bills</h2><Btn size="sm" variant="outline" onClick={() => go(role === "Admin" ? "Sales Report" : "Sales Billing")}>View all</Btn></div>
          <div className="divide-y divide-border">
            {recentBills.map((b) => (
              <div key={b.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <div className="min-w-0"><p className="font-semibold text-primary">{b.id}</p><p className="truncate text-xs text-muted-foreground">{b.customer} · {b.date}</p></div>
                <div className="flex items-center gap-3"><Badge>{b.payment}</Badge><span className="font-semibold">{inr(b.total)}</span></div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <div className="mb-4 flex items-center justify-between"><h2 className="font-display font-bold">Low stock alerts</h2><Badge tone="red">{lowStock.length}</Badge></div>
          <div className="divide-y divide-border">
            {lowStock.slice(0, 7).map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2.5 text-sm"><span>{p.name} <span className="text-xs text-muted-foreground">{p.size}</span></span><span className="font-semibold text-destructive">{p.available} {p.unit}</span></div>
            ))}
            {!lowStock.length && <p className="py-6 text-center text-sm text-muted-foreground">All products are well stocked.</p>}
          </div>
        </Card>
      </div>
    </>
  );
}

/* ================= Categories ================= */
export function Categories() {
  const { categories, setCategories } = useStore();
  return <CrudPage title="Product categories" subtitle="Organise your catalogue into product groups." noun="Category" idPrefix="CAT" items={categories} setItems={setCategories}
    filter={{ key: "status", options: ["Active", "Inactive"] }}
    fields={[{ key: "name", label: "Category name", required: true }, { key: "status", label: "Status", type: "select", options: ["Active", "Inactive"] }, { key: "description", label: "Description", type: "textarea" }]}
    columns={[{ label: "Category", render: bold("name") }, { label: "Description", key: "description" }, { label: "Status", key: "status", render: badge("status") }]} />;
}

/* ================= Products ================= */
const stockStatus = (q) => (q <= 0 ? "Out of Stock" : q < 40 ? "Low Stock" : "In Stock");
export function Products() {
  const { products, setProducts, categories } = useStore();
  const rows = products.map((p) => ({ ...p, stockStatus: stockStatus(p.quantity) }));
  return <CrudPage title="Products" subtitle="Manage prices, product details and stock levels." noun="Product" idPrefix="PRD" items={rows} setItems={setProducts}
    filter={{ key: "category", options: categories.map((c) => c.name) }}
    searchKeys={["name", "brand", "sku", "barcode", "category"]}
    fields={[
      { key: "name", label: "Product name", required: true }, { key: "category", label: "Category", type: "select", options: categories.map((c) => c.name) },
      { key: "brand", label: "Brand" }, { key: "size", label: "Size" }, { key: "sku", label: "SKU", required: true }, { key: "barcode", label: "Barcode" },
      { key: "purchasePrice", label: "Purchase price", type: "number" }, { key: "sellingPrice", label: "Selling price", type: "number" },
      { key: "quantity", label: "Quantity", type: "number" }, { key: "unit", label: "Unit", type: "select", options: ["Piece", "Pack", "Bag", "Bottle", "Box", "Jar", "Bar", "Tube", "Pouch", "Ream", "Roll"] },
    ]}
    columns={[
      { label: "Product", render: (r) => <div><p className="font-semibold">{r.name}</p><p className="text-xs text-muted-foreground">{r.brand} · {r.size}</p></div> },
      { label: "Category", key: "category" }, { label: "SKU", key: "sku" },
      { label: "Barcode", key: "barcode", render: (r) => <span className="font-mono text-xs">{r.barcode}</span> },
      { label: "Cost", key: "purchasePrice", right: true, render: money("purchasePrice") }, { label: "Price", key: "sellingPrice", right: true, render: money("sellingPrice") },
      { label: "Qty", key: "quantity", right: true, render: (r) => `${r.quantity} ${r.unit}` }, { label: "Status", key: "stockStatus", render: badge("stockStatus") },
    ]} />;
}

/* ================= Product search (cashier) ================= */
export function ProductSearch() {
  const { stock, categories } = useStore();
  const [q, setQ] = useState(""); const [cat, setCat] = useState("All");
  const rows = stock.filter((p) => `${p.name} ${p.brand} ${p.sku} ${p.barcode}`.toLowerCase().includes(q.toLowerCase()) && (cat === "All" || p.category === cat));
  return (
    <>
      <PageHeader title="Product search" subtitle="Look up prices and current availability." />
      <div className="mb-4 flex flex-wrap gap-3"><SearchBar value={q} onChange={setQ} placeholder="Name, brand, SKU or barcode…" /><Select value={cat} onChange={setCat} options={["All", ...categories.map((c) => c.name)]} className="w-48" /></div>
      <DataTable rows={rows} columns={[
        { label: "Product", render: (r) => <div><p className="font-semibold">{r.name}</p><p className="text-xs text-muted-foreground">{r.brand} · {r.size}</p></div> },
        { label: "Category", key: "category" }, { label: "SKU", key: "sku" }, { label: "Barcode", render: (r) => <span className="font-mono text-xs">{r.barcode}</span> },
        { label: "Price", right: true, render: money("sellingPrice") }, { label: "Available", right: true, render: (r) => `${r.available} ${r.unit}` }, { label: "Status", render: badge("alert") },
      ]} />
    </>
  );
}

/* ================= Vendors ================= */
export function Vendors() {
  const { vendors, setVendors } = useStore();
  return <CrudPage title="Vendors" subtitle="Supplier contacts, GST details and balances." noun="Vendor" idPrefix="VEN" items={vendors} setItems={setVendors}
    filter={{ key: "status", options: ["Active", "Inactive"] }}
    fields={[{ key: "name", label: "Vendor name", required: true }, { key: "phone", label: "Phone", required: true }, { key: "email", label: "Email", type: "email" }, { key: "gst", label: "GST number" }, { key: "outstanding", label: "Outstanding balance", type: "number" }, { key: "dueDate", label: "Due date", type: "date" }, { key: "status", label: "Status", type: "select", options: ["Active", "Inactive"] }, { key: "address", label: "Address", type: "textarea" }]}
    columns={[{ label: "Vendor", render: (r) => <div><p className="font-semibold">{r.name}</p><p className="text-xs text-muted-foreground">{r.email}</p></div> }, { label: "Phone", key: "phone" }, { label: "GST number", key: "gst" }, { label: "Address", key: "address" }, { label: "Outstanding", key: "outstanding", right: true, render: money("outstanding") }, { label: "Due date", key: "dueDate" }, { label: "Status", key: "status", render: badge("status") }]} />;
}

/* ================= Customers ================= */
export function Customers({ readOnly }) {
  const { customers, setCustomers } = useStore();
  return <CrudPage title={readOnly ? "Customer search" : "Customers"} subtitle="Retail partners and their purchase history." noun="Customer" idPrefix="CUS" items={customers} setItems={setCustomers} readOnly={readOnly}
    fields={[{ key: "name", label: "Customer name", required: true }, { key: "phone", label: "Phone", required: true }, { key: "totalPurchase", label: "Total purchase", type: "number" }, { key: "outstanding", label: "Outstanding amount", type: "number" }, { key: "address", label: "Address", type: "textarea" }]}
    columns={[{ label: "Customer", render: bold("name") }, { label: "Phone", key: "phone" }, { label: "Address", key: "address" }, { label: "Total purchase", key: "totalPurchase", right: true, render: money("totalPurchase") }, { label: "Outstanding", key: "outstanding", right: true, render: (r) => <span className={r.outstanding ? "font-semibold text-destructive" : ""}>{inr(r.outstanding)}</span> }]} />;
}

/* ================= Expenses ================= */
export function Expenses() {
  const { expenses, setExpenses } = useStore();
  return <CrudPage title="Expenses" subtitle="Record and review business operating costs." noun="Expense" idPrefix="EXP" items={expenses} setItems={setExpenses}
    filter={{ key: "category", options: expenseCategories }}
    fields={[{ key: "name", label: "Expense name", required: true }, { key: "category", label: "Category", type: "select", options: expenseCategories }, { key: "amount", label: "Amount (₹)", type: "number", required: true }, { key: "date", label: "Date", type: "date", required: true }, { key: "description", label: "Description", type: "textarea" }]}
    columns={[{ label: "Expense", render: bold("name") }, { label: "Category", key: "category", render: (r) => <Badge tone="teal">{r.category}</Badge> }, { label: "Amount", key: "amount", right: true, render: money("amount") }, { label: "Date", key: "date" }, { label: "Description", key: "description" }]} />;
}

/* ================= Purchase entry ================= */
export function PurchaseEntry() {
  const { vendors, products, purchases, setPurchases } = useStore();
  const { notify } = useToast();
  const newId = `PUR-${20261000 + purchases.length}`;
  const empty = { vendor: vendors[0].name, invoice: "", date: TODAY, dueDate: "", payment: "Pending", discount: 0, gst: 5, paid: 0, notes: "" };
  const [form, setForm] = useState(empty);
  const [items, setItems] = useState([{ productId: products[0].id, qty: 10, rate: products[0].purchasePrice }]);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  const subtotal = items.reduce((s, it) => s + it.qty * it.rate, 0);
  const discount = (subtotal * Number(form.discount || 0)) / 100;
  const gst = ((subtotal - discount) * Number(form.gst || 0)) / 100;
  const total = Math.round(subtotal - discount + gst);
  const updateItem = (i, patch) => setItems((list) => list.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));

  const save = (e) => {
    e.preventDefault();
    if (!form.invoice.trim()) return notify("Enter the vendor invoice number.", "error");
    if (!form.dueDate) return notify("Choose a due date.", "error");
    const named = items.map((it) => ({ ...it, name: products.find((p) => p.id === it.productId)?.name }));
    const paid = form.payment === "Paid" ? total : form.payment === "Pending" ? 0 : Math.min(total, Number(form.paid) || 0);
    setPurchases((list) => [{ id: newId, vendor: form.vendor, invoice: form.invoice, date: form.date, dueDate: form.dueDate, payment: form.payment, product: named.map((n) => n.name).join(", "), items: named, quantity: named.reduce((s, n) => s + Number(n.qty), 0), rate: named[0].rate, discount: Number(form.discount), gst: Number(form.gst), total, paid, due: total - paid, notes: form.notes }, ...list]);
    notify(`Purchase ${newId} saved · ${inr(total)}`);
    setForm(empty); setItems([{ productId: products[0].id, qty: 10, rate: products[0].purchasePrice }]);
  };

  return (
    <>
      <PageHeader title="Purchase entry" subtitle="Record stock received from your vendors." actions={<Badge tone="blue">{newId}</Badge>} />
      <form onSubmit={save} className="grid items-start gap-5 xl:grid-cols-[1.6fr_.9fr]">
        <div className="grid gap-5">
          <Card>
            <h2 className="font-display mb-4 font-bold">Invoice details</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Purchase ID" value={newId} readOnly />
              <Select label="Vendor name" value={form.vendor} onChange={set("vendor")} options={vendors.map((v) => v.name)} />
              <Field label="Invoice number *" value={form.invoice} onChange={set("invoice")} placeholder="INV-9001" />
              <Field label="Purchase date" type="date" value={form.date} onChange={set("date")} />
              <Field label="Due date *" type="date" value={form.dueDate} onChange={set("dueDate")} />
              <Select label="Payment status" value={form.payment} onChange={set("payment")} options={["Pending", "Partial", "Paid"]} />
            </div>
          </Card>
          <Card>
            <div className="mb-4 flex items-center justify-between"><h2 className="font-display font-bold">Product list</h2><Btn type="button" size="sm" variant="outline" icon="plus" onClick={() => setItems((l) => [...l, { productId: products[1].id, qty: 1, rate: products[1].purchasePrice }])}>Add row</Btn></div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead><tr className="text-left text-[11px] font-bold uppercase tracking-wide text-muted-foreground"><th className="pb-2">Product</th><th className="pb-2 w-24">Qty</th><th className="pb-2 w-32">Rate (₹)</th><th className="pb-2 text-right">Amount</th><th /></tr></thead>
                <tbody className="divide-y divide-border">
                  {items.map((it, i) => (
                    <tr key={i}>
                      <td className="py-2 pr-2"><select value={it.productId} onChange={(e) => updateItem(i, { productId: e.target.value, rate: products.find((p) => p.id === e.target.value).purchasePrice })} className="h-9 w-full rounded-lg border border-input bg-background px-2">{products.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.size})</option>)}</select></td>
                      <td className="py-2 pr-2"><input type="number" min="1" value={it.qty} onChange={(e) => updateItem(i, { qty: Number(e.target.value) })} className="h-9 w-full rounded-lg border border-input bg-background px-2" /></td>
                      <td className="py-2 pr-2"><input type="number" min="0" value={it.rate} onChange={(e) => updateItem(i, { rate: Number(e.target.value) })} className="h-9 w-full rounded-lg border border-input bg-background px-2" /></td>
                      <td className="py-2 text-right font-semibold">{inr(it.qty * it.rate)}</td>
                      <td className="py-2 pl-2 text-right"><IconBtn type="button" icon="trash" tone="danger" label="Remove row" disabled={items.length === 1} onClick={() => setItems((l) => l.filter((_, idx) => idx !== i))} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <TextArea className="mt-4" label="Notes" value={form.notes} onChange={set("notes")} />
          </Card>
        </div>
        <Card className="xl:sticky xl:top-24">
          <h2 className="font-display mb-4 font-bold">Summary</h2>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Discount (%)" type="number" value={form.discount} onChange={set("discount")} />
            <Field label="GST (%)" type="number" value={form.gst} onChange={set("gst")} />
            {form.payment === "Partial" && <Field className="col-span-2" label="Amount paid (₹)" type="number" value={form.paid} onChange={set("paid")} />}
          </div>
          <dl className="mt-5 grid gap-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{inr(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Discount</dt><dd>− {inr(discount)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">GST</dt><dd>{inr(gst)}</dd></div>
            <div className="mt-2 flex justify-between border-t border-border pt-3 text-base font-extrabold"><dt>Total amount</dt><dd className="text-primary">{inr(total)}</dd></div>
          </dl>
          <Btn type="submit" icon="check" className="mt-5 w-full">Save purchase</Btn>
        </Card>
      </form>
    </>
  );
}

/* ================= Sales billing ================= */
const GST_RATE = 5;
export function SalesBilling() {
  const { stock, sales, setSales, customers, settings } = useStore();
  const { notify } = useToast();
  const billCount = new Set(sales.map((s) => s.id)).size;
  const billNo = `${settings.prefix}-${4101 + billCount}`;
  const [customer, setCustomer] = useState(""); const [mobile, setMobile] = useState("");
  const [q, setQ] = useState(""); const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState(0); const [payment, setPayment] = useState("Cash"); const [tendered, setTendered] = useState("");
  const [invoice, setInvoice] = useState(null); const [confirmCancel, setConfirmCancel] = useState(false);

  const results = q ? stock.filter((p) => `${p.name} ${p.brand} ${p.sku} ${p.barcode}`.toLowerCase().includes(q.toLowerCase())).slice(0, 6) : [];
  const subtotal = cart.reduce((s, it) => s + it.qty * it.price, 0);
  const disc = Math.min(subtotal, Number(discount) || 0);
  const gst = Math.round(((subtotal - disc) * GST_RATE) / 100);
  const grand = subtotal - disc + gst;

  const add = (p) => {
    if (p.available <= 0) return notify(`${p.name} is out of stock.`, "error");
    setCart((c) => c.some((it) => it.id === p.id) ? c.map((it) => (it.id === p.id ? { ...it, qty: Math.min(it.qty + 1, p.available) } : it)) : [...c, { id: p.id, name: p.name, size: p.size, price: p.sellingPrice, qty: 1, max: p.available }]);
    setQ("");
  };
  const reset = () => { setCustomer(""); setMobile(""); setCart([]); setDiscount(0); setPayment("Cash"); setTendered(""); };
  const pickCustomer = (name) => { setCustomer(name); const c = customers.find((x) => x.name === name); if (c) setMobile(c.phone); };

  const buildBill = () => ({ billNo, customer: customer || "Walk-in customer", mobile, items: cart, subtotal, disc, gst, grand, payment, tendered: Number(tendered) || 0, date: TODAY });
  const save = (andPrint) => {
    if (!cart.length) return notify("Add at least one product to the bill.", "error");
    if (mobile && !/^[+\d\s]{10,15}$/.test(mobile)) return notify("Enter a valid mobile number.", "error");
    if (payment === "Cash" && tendered && Number(tendered) < grand) return notify("Cash received is less than the grand total.", "error");
    const bill = buildBill();
    const share = subtotal ? (grand / subtotal) : 1;
    setSales((list) => [...cart.map((it) => ({ id: billNo, customer: bill.customer, mobile, product: it.name, quantity: it.qty, total: Math.round(it.qty * it.price * share), payment, date: TODAY })), ...list]);
    notify(`Bill ${billNo} saved · ${inr(grand)}`);
    setInvoice(bill); reset();
    if (andPrint) setTimeout(() => window.print(), 350);
  };

  return (
    <>
      <PageHeader title="Sales billing" subtitle="Create a customer bill and collect payment." actions={<Badge tone="blue">Bill No. {billNo}</Badge>} />
      <div className="grid items-start gap-5 xl:grid-cols-[1.5fr_1fr]">
        <div className="grid gap-5">
          <Card>
            <h2 className="font-display mb-4 font-bold">Customer details</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Bill number" value={billNo} readOnly />
              <label className="grid gap-1.5 text-xs font-semibold">Customer name
                <input list="customer-list" value={customer} onChange={(e) => pickCustomer(e.target.value)} placeholder="Walk-in customer" className="h-10 rounded-lg border border-input bg-background px-3 text-sm font-normal outline-none focus:ring-2 focus:ring-ring/20" />
                <datalist id="customer-list">{customers.map((c) => <option key={c.id} value={c.name} />)}</datalist>
              </label>
              <Field label="Mobile number" value={mobile} onChange={setMobile} placeholder="+91 98xxx xxxxx" />
            </div>
          </Card>
          <Card>
            <h2 className="font-display mb-3 font-bold">Products</h2>
            <div className="relative">
              <SearchBar value={q} onChange={setQ} placeholder="Search product, SKU or scan barcode…" />
              {!!results.length && (
                <div className="absolute z-10 mt-1 w-full max-w-md divide-y divide-border overflow-hidden rounded-lg border border-border bg-popover shadow-xl">
                  {results.map((p) => (
                    <button key={p.id} onClick={() => add(p)} className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm transition hover:bg-muted">
                      <span><span className="font-semibold">{p.name}</span> <span className="text-xs text-muted-foreground">{p.size} · {p.sku}</span></span>
                      <span className="text-right"><span className="block font-semibold">{inr(p.sellingPrice)}</span><span className={`text-[11px] ${p.available < 40 ? "text-destructive" : "text-muted-foreground"}`}>{p.available} left</span></span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[520px] text-sm">
                <thead><tr className="border-b border-border text-left text-[11px] font-bold uppercase tracking-wide text-muted-foreground"><th className="py-2">Product</th><th className="py-2">Rate</th><th className="py-2">Quantity</th><th className="py-2 text-right">Amount</th><th /></tr></thead>
                <tbody className="divide-y divide-border">
                  {cart.map((it) => (
                    <tr key={it.id}>
                      <td className="py-2.5"><p className="font-semibold">{it.name}</p><p className="text-xs text-muted-foreground">{it.size}</p></td>
                      <td>{inr(it.price)}</td>
                      <td>
                        <div className="inline-flex items-center rounded-lg border border-border">
                          <button aria-label={`Decrease ${it.name}`} className="size-8 hover:bg-muted" onClick={() => setCart((c) => c.map((x) => (x.id === it.id ? { ...x, qty: Math.max(1, x.qty - 1) } : x)))}>−</button>
                          <span className="w-9 text-center font-semibold">{it.qty}</span>
                          <button aria-label={`Increase ${it.name}`} className="size-8 hover:bg-muted" onClick={() => setCart((c) => c.map((x) => (x.id === it.id ? { ...x, qty: Math.min(x.max, x.qty + 1) } : x)))}>+</button>
                        </div>
                      </td>
                      <td className="text-right font-semibold">{inr(it.qty * it.price)}</td>
                      <td className="pl-2 text-right"><IconBtn icon="trash" tone="danger" label={`Remove ${it.name}`} onClick={() => setCart((c) => c.filter((x) => x.id !== it.id))} /></td>
                    </tr>
                  ))}
                  {!cart.length && <tr><td colSpan={5} className="py-10 text-center text-muted-foreground">Search above to add products to this bill.</td></tr>}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
        <Card className="xl:sticky xl:top-24">
          <h2 className="font-display mb-4 font-bold">Bill summary</h2>
          <Field label="Discount (₹)" type="number" min="0" value={discount} onChange={setDiscount} />
          <p className="mb-2 mt-4 text-xs font-semibold">Payment type</p>
          <div className="grid grid-cols-3 gap-2">
            {["Cash", "UPI", "Card"].map((m) => (
              <button key={m} onClick={() => setPayment(m)} className={`h-10 rounded-lg border text-sm font-semibold transition ${payment === m ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted"}`}>{m}</button>
            ))}
          </div>
          {payment === "Cash" && <Field className="mt-3" label="Cash received (₹)" type="number" value={tendered} onChange={setTendered} />}
          {payment === "UPI" && <p className="mt-3 rounded-lg bg-muted p-3 text-xs text-muted-foreground">Ask the customer to scan the counter UPI QR and confirm the payment.</p>}
          {payment === "Card" && <p className="mt-3 rounded-lg bg-muted p-3 text-xs text-muted-foreground">Swipe or tap the card on the counter machine.</p>}
          <dl className="mt-5 grid gap-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{inr(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Discount</dt><dd>− {inr(disc)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">GST ({GST_RATE}%)</dt><dd>{inr(gst)}</dd></div>
            <div className="mt-2 flex justify-between border-t border-border pt-3 text-lg font-extrabold"><dt>Grand total</dt><dd className="text-primary">{inr(grand)}</dd></div>
            {payment === "Cash" && Number(tendered) >= grand && grand > 0 && <div className="flex justify-between font-semibold text-success"><dt>Change to return</dt><dd>{inr(Number(tendered) - grand)}</dd></div>}
          </dl>
          <div className="mt-5 grid gap-2">
            <Btn variant="success" icon="check" onClick={() => save(false)}>Save bill</Btn>
            <div className="grid grid-cols-2 gap-2">
              <Btn variant="outline" icon="print" onClick={() => save(true)}>Print bill</Btn>
              <Btn variant="outline" icon="x" onClick={() => cart.length ? setConfirmCancel(true) : reset()}>Cancel</Btn>
            </div>
          </div>
        </Card>
      </div>
      <ConfirmDialog open={confirmCancel} title="Cancel this bill?" message="All products and customer details on this bill will be cleared." confirmLabel="Clear bill" onCancel={() => setConfirmCancel(false)} onConfirm={() => { reset(); setConfirmCancel(false); notify("Bill cleared."); }} />
      <Modal open={!!invoice} wide title={`Invoice ${invoice?.billNo ?? ""}`} onClose={() => setInvoice(null)}>
        {invoice && <Invoice bill={invoice} settings={settings} />}
        <div className="no-print mt-5 flex justify-end gap-2"><Btn variant="outline" onClick={() => setInvoice(null)}>Close</Btn><Btn icon="print" onClick={() => window.print()}>Print</Btn></div>
      </Modal>
    </>
  );
}

function Invoice({ bill, settings }) {
  return (
    <div className="print-area rounded-lg border border-border p-5 text-sm">
      <div className="flex flex-wrap justify-between gap-4 border-b border-border pb-4">
        <div className="flex gap-3">
          {settings.logo ? <img src={settings.logo} alt="" className="size-12 rounded-lg object-cover" /> : <span className="grid size-12 place-items-center rounded-lg bg-primary font-display text-xl font-extrabold text-primary-foreground">A</span>}
          <div><p className="font-display text-lg font-extrabold">{settings.company}</p><p className="max-w-xs text-xs text-muted-foreground">{settings.address}</p><p className="text-xs text-muted-foreground">{settings.phone} · GSTIN {settings.gst}</p></div>
        </div>
        <div className="text-right"><p className="text-xs font-bold uppercase tracking-wide text-teal">Tax invoice</p><p className="font-semibold">{bill.billNo}</p><p className="text-xs text-muted-foreground">{bill.date}</p></div>
      </div>
      <p className="mt-3"><span className="text-muted-foreground">Bill to:</span> <span className="font-semibold">{bill.customer}</span> {bill.mobile && <span className="text-muted-foreground">· {bill.mobile}</span>}</p>
      <table className="mt-3 w-full">
        <thead><tr className="border-b border-border text-left text-[11px] uppercase text-muted-foreground"><th className="py-1.5">Item</th><th>Qty</th><th>Rate</th><th className="text-right">Amount</th></tr></thead>
        <tbody>{bill.items.map((it) => <tr key={it.id} className="border-b border-border/60"><td className="py-1.5">{it.name} <span className="text-xs text-muted-foreground">{it.size}</span></td><td>{it.qty}</td><td>{inr(it.price)}</td><td className="text-right">{inr(it.qty * it.price)}</td></tr>)}</tbody>
      </table>
      <div className="ml-auto mt-3 grid max-w-60 gap-1">
        <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{inr(bill.subtotal)}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span>− {inr(bill.disc)}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">GST</span><span>{inr(bill.gst)}</span></div>
        <div className="flex justify-between border-t border-border pt-1 font-extrabold"><span>Grand total</span><span>{inr(bill.grand)}</span></div>
        <div className="flex justify-between text-xs text-muted-foreground"><span>Paid by</span><span>{bill.payment}</span></div>
      </div>
      <p className="mt-5 text-center text-xs text-muted-foreground">Thank you for your business!</p>
    </div>
  );
}

/* ================= Stock & Inventory ================= */
export function Stock() {
  const { stock } = useStore();
  const [q, setQ] = useState(""); const [f, setF] = useState("All");
  const rows = stock.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()) && (f === "All" || p.alert === f));
  return (
    <>
      <PageHeader title="Stock management" subtitle="On-hand quantities and items to reorder." />
      <div className="mb-5 grid grid-cols-3 gap-3">
        <StatCard label="In stock" value={stock.filter((p) => p.alert === "In Stock").length} icon="check" tone="green" />
        <StatCard label="Low stock" value={stock.filter((p) => p.alert === "Low Stock").length} icon="alert" tone="amber" />
        <StatCard label="Out of stock" value={stock.filter((p) => p.alert === "Out of Stock").length} icon="x" tone="red" />
      </div>
      <div className="mb-4 flex flex-wrap gap-3"><SearchBar value={q} onChange={setQ} placeholder="Search products…" /><Select value={f} onChange={setF} options={["All", "In Stock", "Low Stock", "Out of Stock"]} className="w-44" /></div>
      <DataTable rows={rows} columns={[
        { label: "Product", render: bold("name") }, { label: "Current stock", right: true, key: "opening" }, { label: "Purchase qty", right: true, key: "purchased" },
        { label: "Sold qty", right: true, key: "sold" }, { label: "Remaining", right: true, render: (r) => <span className="font-semibold">{r.available}</span> },
        { label: "Low stock alert", render: (r) => <Badge>{r.alert}</Badge> },
      ]} />
    </>
  );
}

export function Inventory() {
  const { stock } = useStore();
  const [q, setQ] = useState("");
  const rows = stock.filter((p) => `${p.name} ${p.category}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <PageHeader title="Inventory" subtitle="Stock movement and current inventory value." actions={<Badge tone="blue">Total value {inr(sum(stock, "value"))}</Badge>} />
      <div className="mb-4"><SearchBar value={q} onChange={setQ} placeholder="Search inventory…" /></div>
      <DataTable rows={rows} columns={[
        { label: "Product", render: (r) => <div><p className="font-semibold">{r.name}</p><p className="text-xs text-muted-foreground">{r.category}</p></div> },
        { label: "Opening stock", right: true, key: "opening" }, { label: "Purchased", right: true, key: "purchased" }, { label: "Sold", right: true, key: "sold" },
        { label: "Available", right: true, render: (r) => <span className={`font-semibold ${r.alert !== "In Stock" ? "text-destructive" : ""}`}>{r.available}</span> },
        { label: "Stock value", right: true, render: money("value") },
      ]} />
    </>
  );
}

/* ================= Vendor dues ================= */
export function VendorDues() {
  const { purchases, setPurchases } = useStore();
  const { notify } = useToast();
  const [paying, setPaying] = useState(null); const [f, setF] = useState("All");
  const dues = purchases.filter((p) => p.due > 0).map((p) => ({ ...p, status: isOverdue(p) ? "Overdue" : p.payment === "Partial" ? "Partial" : "Pending" }));
  const rows = dues.filter((d) => f === "All" || d.status === f);
  return (
    <>
      <PageHeader title="Vendor due payments" subtitle="Outstanding vendor invoices. Overdue items are highlighted in red." />
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-3">
        <StatCard label="Total due" value={inr(sum(dues, "due"))} detail={`${dues.length} invoices`} icon="rupee" tone="amber" />
        <StatCard label="Overdue" value={inr(sum(dues.filter((d) => d.status === "Overdue"), "due"))} detail={`${dues.filter((d) => d.status === "Overdue").length} invoices past due`} icon="alert" tone="red" />
      </div>
      <div className="mb-4"><Select value={f} onChange={setF} options={["All", "Overdue", "Pending", "Partial"]} className="w-44" /></div>
      <DataTable rows={rows} columns={[
        { label: "Vendor", render: bold("vendor") }, { label: "Invoice number", key: "invoice" }, { label: "Due amount", right: true, render: (r) => <span className="font-semibold">{inr(r.due)}</span> },
        { label: "Due date", render: (r) => <span className={r.status === "Overdue" ? "font-semibold text-destructive" : ""}>{r.dueDate}</span> },
        { label: "Status", render: (r) => <Badge>{r.status}</Badge> },
        { label: "Action", right: true, render: (r) => <Btn size="sm" variant="outline" onClick={() => setPaying(r)}>Mark paid</Btn> },
      ]} />
      <ConfirmDialog open={!!paying} title="Mark invoice as paid?" message={`Record a payment of ${inr(paying?.due)} to ${paying?.vendor} for ${paying?.invoice}.`} confirmLabel="Record payment" onCancel={() => setPaying(null)}
        onConfirm={() => { setPurchases((l) => l.map((p) => (p.id === paying.id ? { ...p, paid: p.total, due: 0, payment: "Paid" } : p))); notify(`Payment recorded for ${paying.invoice}.`); setPaying(null); }} />
    </>
  );
}

/* ================= Reports ================= */
function ReportShell({ title, subtitle, name, columns, rows, filters, summary }) {
  const { exportCsv, print } = useReportActions();
  return (
    <>
      <PageHeader title={title} subtitle={subtitle} actions={<><Btn variant="outline" icon="download" onClick={() => exportCsv(name, columns, rows)}>Export</Btn><Btn variant="outline" icon="print" onClick={print}>Print</Btn></>} />
      {summary && <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">{summary}</div>}
      <div className="mb-4 flex flex-wrap items-center gap-3">{filters}<span className="ml-auto text-xs text-muted-foreground">{rows.length} records</span></div>
      <div className="print-area"><DataTable rows={rows} columns={columns} /></div>
    </>
  );
}
const match = (r, keys, q) => keys.map((k) => r[k]).join(" ").toLowerCase().includes(q.toLowerCase());

export function PurchaseReport() {
  const { purchases } = useStore();
  const [q, setQ] = useState(""); const [f, setF] = useState("All");
  const rows = purchases.map((p) => ({ ...p, status: isOverdue(p) ? "Overdue" : p.payment })).filter((p) => match(p, ["id", "vendor", "product", "invoice"], q) && (f === "All" || p.status === f));
  return <ReportShell title="Purchase report" subtitle="Purchase activity and payment status." name="purchase-report" rows={rows}
    summary={<><StatCard label="Total purchases" value={inr(sum(rows, "total"))} icon="cart" /><StatCard label="Paid" value={inr(sum(rows, "paid"))} icon="check" tone="green" /><StatCard label="Due" value={inr(sum(rows, "due"))} icon="clock" tone="red" /><StatCard label="Entries" value={rows.length} icon="file" tone="teal" /></>}
    filters={<><SearchBar value={q} onChange={setQ} placeholder="Search ID, vendor, product…" /><Select value={f} onChange={setF} options={["All", "Paid", "Partial", "Pending", "Overdue"]} className="w-40" /></>}
    columns={[{ label: "Purchase ID", key: "id", render: bold("id") }, { label: "Vendor", key: "vendor" }, { label: "Product", key: "product" }, { label: "Qty", key: "quantity", right: true }, { label: "Total", key: "total", right: true, render: money("total") }, { label: "Paid", key: "paid", right: true, render: money("paid") }, { label: "Due", key: "due", right: true, render: money("due") }, { label: "Due date", key: "dueDate" }, { label: "Status", key: "status", render: badge("status") }, { label: "Purchase date", key: "date" }]} />;
}

export function SalesReport() {
  const { sales } = useStore();
  const [q, setQ] = useState(""); const [f, setF] = useState("All");
  const rows = sales.filter((s) => match(s, ["id", "customer", "product"], q) && (f === "All" || s.payment === f));
  return <ReportShell title="Sales report" subtitle="Every billed item across the month." name="sales-report" rows={rows}
    summary={["Cash", "UPI", "Card"].map((m) => <StatCard key={m} label={`${m} sales`} value={inr(sum(rows.filter((r) => r.payment === m), "total"))} icon="rupee" tone={m === "Cash" ? "teal" : m === "UPI" ? "blue" : "amber"} />).concat(<StatCard key="t" label="Total sales" value={inr(sum(rows, "total"))} icon="chart" tone="green" />)}
    filters={<><SearchBar value={q} onChange={setQ} placeholder="Search bill, customer, product…" /><Select value={f} onChange={setF} options={["All", "Cash", "UPI", "Card"]} className="w-36" /></>}
    columns={[{ label: "Bill no.", key: "id", render: bold("id") }, { label: "Customer", key: "customer" }, { label: "Product", key: "product" }, { label: "Qty", key: "quantity", right: true }, { label: "Total", key: "total", right: true, render: money("total") }, { label: "Payment", key: "payment", render: badge("payment") }, { label: "Date", key: "date" }]} />;
}

export function ExpenseReport() {
  const { expenses } = useStore();
  const [q, setQ] = useState(""); const [f, setF] = useState("All");
  const rows = expenses.filter((e) => match(e, ["name", "description"], q) && (f === "All" || e.category === f));
  const top = expenseCategories.map((c) => [c, sum(expenses.filter((e) => e.category === c), "amount")]).sort((a, b) => b[1] - a[1]).slice(0, 3);
  return <ReportShell title="Expense report" subtitle="Operating costs by category." name="expense-report" rows={rows}
    summary={[<StatCard key="t" label="Total expenses" value={inr(sum(rows, "amount"))} icon="wallet" tone="red" />, ...top.map(([c, v]) => <StatCard key={c} label={c} value={inr(v)} icon="tag" tone="amber" />)]}
    filters={<><SearchBar value={q} onChange={setQ} placeholder="Search expenses…" /><Select value={f} onChange={setF} options={["All", ...expenseCategories]} className="w-44" /></>}
    columns={[{ label: "Expense", key: "name", render: bold("name") }, { label: "Category", key: "category", render: (r) => <Badge tone="teal">{r.category}</Badge> }, { label: "Amount", key: "amount", right: true, render: money("amount") }, { label: "Date", key: "date" }, { label: "Description", key: "description" }]} />;
}

export function StockReport() {
  const { stock } = useStore();
  const [q, setQ] = useState(""); const [f, setF] = useState("All");
  const rows = stock.filter((p) => match(p, ["name", "category", "sku"], q) && (f === "All" || p.alert === f));
  return <ReportShell title="Stock report" subtitle="Movement and valuation of every product." name="stock-report" rows={rows}
    summary={<><StatCard label="Stock value" value={inr(sum(rows, "value"))} icon="layers" /><StatCard label="Units available" value={sum(rows, "available").toLocaleString("en-IN")} icon="box" tone="teal" /><StatCard label="Units sold" value={sum(rows, "sold")} icon="receipt" tone="green" /><StatCard label="Low / out of stock" value={rows.filter((r) => r.alert !== "In Stock").length} icon="alert" tone="red" /></>}
    filters={<><SearchBar value={q} onChange={setQ} placeholder="Search products…" /><Select value={f} onChange={setF} options={["All", "In Stock", "Low Stock", "Out of Stock"]} className="w-44" /></>}
    columns={[{ label: "Product", key: "name", render: bold("name") }, { label: "SKU", key: "sku" }, { label: "Opening", key: "opening", right: true }, { label: "Purchased", key: "purchased", right: true }, { label: "Sold", key: "sold", right: true }, { label: "Available", key: "available", right: true }, { label: "Value", key: "value", right: true, render: money("value") }, { label: "Status", key: "alert", render: badge("alert") }]} />;
}

export function VendorReport() {
  const { vendors, purchases } = useStore();
  const [q, setQ] = useState(""); const [f, setF] = useState("All");
  const rows = vendors.map((v) => { const ps = purchases.filter((p) => p.vendor === v.name); return { ...v, orders: ps.length, purchased: sum(ps, "total"), paid: sum(ps, "paid"), due: sum(ps, "due") }; })
    .filter((v) => match(v, ["name", "gst", "phone"], q) && (f === "All" || v.status === f));
  return <ReportShell title="Vendor report" subtitle="Purchases and balances for each supplier." name="vendor-report" rows={rows}
    summary={<><StatCard label="Vendors" value={rows.length} icon="truck" /><StatCard label="Purchased" value={inr(sum(rows, "purchased"))} icon="cart" tone="teal" /><StatCard label="Paid" value={inr(sum(rows, "paid"))} icon="check" tone="green" /><StatCard label="Due" value={inr(sum(rows, "due"))} icon="clock" tone="red" /></>}
    filters={<><SearchBar value={q} onChange={setQ} placeholder="Search vendors…" /><Select value={f} onChange={setF} options={["All", "Active", "Inactive"]} className="w-36" /></>}
    columns={[{ label: "Vendor", key: "name", render: bold("name") }, { label: "Phone", key: "phone" }, { label: "GST number", key: "gst" }, { label: "Orders", key: "orders", right: true }, { label: "Purchased", key: "purchased", right: true, render: money("purchased") }, { label: "Paid", key: "paid", right: true, render: money("paid") }, { label: "Due", key: "due", right: true, render: money("due") }, { label: "Status", key: "status", render: badge("status") }]} />;
}

export function ReportsHub({ go }) {
  const list = [["Purchase Report", "cart", "Purchases, paid and due amounts"], ["Sales Report", "receipt", "Bills by customer and payment type"], ["Expense Report", "wallet", "Operating costs by category"], ["Stock Report", "layers", "Stock movement and valuation"], ["Vendor Report", "truck", "Supplier purchases and balances"], ["Vendor Dues", "clock", "Outstanding and overdue invoices"]];
  return (
    <>
      <PageHeader title="Reports" subtitle="Choose a report to view, export or print." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {list.map(([name, icon, desc]) => (
          <button key={name} onClick={() => go(name)} className="group flex items-start gap-4 rounded-xl border border-border bg-card p-5 text-left shadow-soft transition hover:-translate-y-0.5 hover:border-primary/40">
            <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground"><Icon name={icon} className="size-5" /></span>
            <span><span className="block font-display font-bold">{name}</span><span className="mt-1 block text-sm text-muted-foreground">{desc}</span></span>
          </button>
        ))}
      </div>
    </>
  );
}

/* ================= Settings ================= */
export function Settings() {
  const { settings, setSettings } = useStore();
  const { notify } = useToast();
  const [form, setForm] = useState(settings);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  const onLogo = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (!file.type.startsWith("image/")) return notify("Please choose an image file.", "error");
    const reader = new FileReader(); reader.onload = () => set("logo")(String(reader.result)); reader.readAsDataURL(file);
  };
  return (
    <>
      <PageHeader title="Business settings" subtitle="Details shown on invoices and reports." />
      <Card className="max-w-3xl">
        <form onSubmit={(e) => { e.preventDefault(); if (!form.company.trim()) return notify("Company name is required.", "error"); setSettings(form); notify("Business information saved."); }}>
          <div className="mb-6 flex items-center gap-4">
            {form.logo ? <img src={form.logo} alt="Business logo" className="size-16 rounded-xl object-cover" /> : <span className="grid size-16 place-items-center rounded-xl bg-primary font-display text-2xl font-extrabold text-primary-foreground">A</span>}
            <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-border px-4 text-sm font-semibold transition hover:bg-muted"><Icon name="upload" /> Upload logo<input type="file" accept="image/*" className="sr-only" onChange={onLogo} /></label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Company name" value={form.company} onChange={set("company")} />
            <Field label="GST number" value={form.gst} onChange={set("gst")} />
            <Field label="Email" type="email" value={form.email} onChange={set("email")} />
            <Field label="Phone" value={form.phone} onChange={set("phone")} />
            <Field label="Invoice prefix" value={form.prefix} onChange={set("prefix")} />
            <TextArea className="sm:col-span-2" label="Address" value={form.address} onChange={set("address")} />
          </div>
          <div className="mt-6 flex justify-end gap-2"><Btn type="button" variant="outline" onClick={() => setForm(settings)}>Reset</Btn><Btn type="submit" icon="check">Save changes</Btn></div>
        </form>
      </Card>
    </>
  );
}
