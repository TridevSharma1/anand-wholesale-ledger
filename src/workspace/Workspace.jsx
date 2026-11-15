import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Icon } from "./icons";
import { Btn, Field, ToastProvider, useToast } from "./ui";
import { StoreProvider } from "./store";
import * as M from "./modules";

const ADMIN = [["Dashboard","dashboard"],["Categories","tag"],["Products","box"],["Purchase","cart"],["Vendors","truck"],["Purchase Report","file"],["Sales Billing","receipt"],["Customers","users"],["Inventory","layers"],["Stock","chart"],["Expenses","wallet"],["Vendor Dues","clock"],["Reports","file"],["Settings","settings"]];
const REPORT_SUBS = ["Sales Report","Expense Report","Stock Report","Vendor Report"];
const CASHIER = [["Dashboard","dashboard"],["Sales Billing","receipt"],["Product Search","search"],["Customers","users"]];
const allowed = (role, v) => role === "Admin" ? [...ADMIN.map(a => a[0]), ...REPORT_SUBS].includes(v) : CASHIER.some(c => c[0] === v);

const USERS = [
  { email: "admin@anand.com", password: "admin123", role: "Admin", name: "Anand (Admin)" },
  { email: "cashier@anand.com", password: "cash123", role: "Cashier", name: "Counter Cashier" },
];

export function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [error, setError] = useState("");
  const submit = (e) => {
    e.preventDefault();
    const u = USERS.find(x => x.email === email.trim().toLowerCase() && x.password === password);
    if (!u) return setError("Email or password doesn’t match the sample accounts.");
    sessionStorage.setItem("anand-workspace", JSON.stringify({ role: u.role, name: u.name }));
    navigate({ to: "/app" });
  };
  return (
    <form onSubmit={submit} className="grid gap-4">
      <Field label="Email address" type="email" value={email} onChange={setEmail} placeholder="you@anand.com" required />
      <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="Enter your password" required />
      {error && <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">{error}</p>}
      <Btn type="submit" className="w-full">Sign in</Btn>
    </form>
  );
}

function Shell({ user, onLogout }) {
  const { notify } = useToast();
  const [view, setView] = useState("Dashboard");
  const [open, setOpen] = useState(false);
  useEffect(() => { notify(`Welcome, ${user.name}.`); }, []);
  const go = (v) => { if (!allowed(user.role, v)) return notify("You don’t have access to that section.", "error"); setView(v); setOpen(false); };
  const nav = user.role === "Admin" ? ADMIN : CASHIER;
  const pages = {
    Dashboard: <M.Dashboard role={user.role} go={go} />, Categories: <M.Categories />, Products: <M.Products />, Purchase: <M.PurchaseEntry />,
    Vendors: <M.Vendors />, "Purchase Report": <M.PurchaseReport />, "Sales Billing": <M.SalesBilling />, Customers: <M.Customers readOnly={user.role !== "Admin"} />,
    Inventory: <M.Inventory />, Stock: <M.Stock />, Expenses: <M.Expenses />, "Vendor Dues": <M.VendorDues />, Reports: <M.ReportsHub go={go} />,
    "Sales Report": <M.SalesReport />, "Expense Report": <M.ExpenseReport />, "Stock Report": <M.StockReport />, "Vendor Report": <M.VendorReport />,
    Settings: <M.Settings />, "Product Search": <M.ProductSearch />,
  };
  return (
    <div className="flex min-h-screen bg-background">
      <aside className={`no-print fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform md:sticky md:top-0 md:h-screen md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-5">
          <Link to="/" className="flex items-center gap-2"><span className="grid size-9 place-items-center rounded-lg bg-sidebar-primary font-display font-extrabold text-sidebar-primary-foreground">A</span><span className="font-display text-sm font-extrabold">Anand Wholesale</span></Link>
          <button className="md:hidden" aria-label="Close menu" onClick={() => setOpen(false)}><Icon name="x" /></button>
        </div>
        <div className="border-b border-sidebar-border px-5 py-3 text-xs"><p className="font-semibold">{user.name}</p><p className="text-sidebar-foreground/60">{user.role} access</p></div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
          {nav.map(([label, icon]) => (
            <div key={label}>
              <button onClick={() => go(label)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-[13px] font-medium transition ${view === label ? "bg-sidebar-accent text-sidebar-primary" : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground"}`}><Icon name={icon} />{label}</button>
              {label === "Reports" && (view === "Reports" || REPORT_SUBS.includes(view)) && REPORT_SUBS.map(s => (
                <button key={s} onClick={() => go(s)} className={`ml-7 block w-[calc(100%-1.75rem)] rounded-md px-3 py-1.5 text-left text-xs transition ${view === s ? "text-sidebar-primary" : "text-sidebar-foreground/65 hover:text-sidebar-foreground"}`}>{s}</button>
              ))}
            </div>
          ))}
        </nav>
        <div className="border-t border-sidebar-border p-3"><button onClick={onLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-sidebar-foreground/75 transition hover:bg-sidebar-accent"><Icon name="logout" />Logout</button></div>
      </aside>
      {open && <button aria-label="Close menu overlay" className="fixed inset-0 z-30 bg-foreground/30 md:hidden" onClick={() => setOpen(false)} />}
      <main className="min-w-0 flex-1">
        <header className="no-print sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-card/95 px-4 backdrop-blur sm:px-6">
          <button className="md:hidden" aria-label="Open menu" onClick={() => setOpen(true)}><Icon name="menu" className="size-5" /></button>
          <span className="text-sm font-semibold">{view}</span>
          <span className="ml-auto rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{user.role}</span>
        </header>
        <div className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-8">{allowed(user.role, view) ? pages[view] : pages.Dashboard}</div>
      </main>
    </div>
  );
}

export function Workspace() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  useEffect(() => {
    const raw = sessionStorage.getItem("anand-workspace");
    if (!raw) { navigate({ to: "/login" }); return; }
    setUser(JSON.parse(raw));
  }, [navigate]);
  if (!user) return <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">Opening your workspace…</div>;
  const logout = () => { sessionStorage.removeItem("anand-workspace"); navigate({ to: "/login" }); };
  return <ToastProvider><StoreProvider><Shell user={user} onLogout={logout} /></StoreProvider></ToastProvider>;
}
