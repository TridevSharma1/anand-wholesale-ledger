import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { Icon } from "./icons";

/* ---------- Toasts (React state only) ---------- */
const ToastContext = createContext({ notify: () => {} });
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const notify = useCallback((message, type = "success") => {
    const id = Math.random().toString(36).slice(2);
    setItems((list) => [...list, { id, message, type }]);
    setTimeout(() => setItems((list) => list.filter((t) => t.id !== id)), 3200);
  }, []);
  const value = useMemo(() => ({ notify }), [notify]);
  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[60] grid w-[min(360px,calc(100vw-2rem))] gap-2" role="status" aria-live="polite">
        {items.map((t) => (
          <div key={t.id} className={`pointer-events-auto flex items-start gap-3 rounded-lg border bg-card p-3.5 text-sm shadow-soft animate-in slide-in-from-top-2 ${t.type === "error" ? "border-destructive/40" : "border-success/40"}`}>
            <span className={`grid size-6 shrink-0 place-items-center rounded-full ${t.type === "error" ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"}`}>
              <Icon name={t.type === "error" ? "alert" : "check"} className="size-3.5" />
            </span>
            <p className="pt-0.5 font-medium">{t.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/* ---------- Basic controls ---------- */
const btnBase = "inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold shadow-soft transition-all hover:-translate-y-px disabled:pointer-events-none disabled:opacity-50";
const btnVariants = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  teal: "bg-teal text-teal-foreground hover:bg-teal/90",
  accent: "bg-accent text-accent-foreground hover:bg-accent/90",
  success: "bg-success text-success-foreground hover:bg-success/90",
  danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  outline: "border border-border bg-card text-foreground hover:bg-muted",
  ghost: "shadow-none text-foreground hover:bg-muted",
};
export function Btn({ variant = "primary", icon, children, className = "", size, ...props }) {
  return (
    <button {...props} className={`${btnBase} ${btnVariants[variant]} ${size === "sm" ? "h-8 px-3 text-xs" : ""} ${className}`}>
      {icon && <Icon name={icon} />}
      {children}
    </button>
  );
}

export function IconBtn({ icon, label, tone = "default", ...props }) {
  const tones = { default: "text-muted-foreground hover:bg-muted hover:text-foreground", danger: "text-destructive hover:bg-destructive/10" };
  return (
    <button {...props} aria-label={label} title={label} className={`grid size-8 place-items-center rounded-md transition ${tones[tone]}`}>
      <Icon name={icon} />
    </button>
  );
}

const inputCls = "h-10 w-full min-w-0 rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20";
export function Field({ label, value, onChange, type = "text", className = "", ...props }) {
  return (
    <label className={`grid gap-1.5 text-xs font-semibold ${className}`}>
      {label}
      <input type={type} value={value ?? ""} onChange={(e) => onChange?.(e.target.value)} className={inputCls + " font-normal"} {...props} />
    </label>
  );
}
export function TextArea({ label, value, onChange, className = "" }) {
  return (
    <label className={`grid gap-1.5 text-xs font-semibold ${className}`}>
      {label}
      <textarea value={value ?? ""} onChange={(e) => onChange?.(e.target.value)} rows={3} className={inputCls + " h-auto py-2 font-normal"} />
    </label>
  );
}
export function Select({ label, value, onChange, options, className = "" }) {
  const control = (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={inputCls + " font-normal"}>
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
  );
  if (!label) return <div className={className}>{control}</div>;
  return <label className={`grid gap-1.5 text-xs font-semibold ${className}`}>{label}{control}</label>;
}

export function SearchBar({ value, onChange, placeholder = "Search…" }) {
  return (
    <label className="flex h-10 w-full items-center gap-2 rounded-lg border border-input bg-card px-3 text-muted-foreground focus-within:ring-2 focus-within:ring-ring/20 sm:max-w-xs">
      <Icon name="search" />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" />
    </label>
  );
}

const badgeTones = {
  green: "bg-success/10 text-success",
  red: "bg-destructive/10 text-destructive",
  amber: "bg-accent/15 text-accent-foreground",
  blue: "bg-primary/10 text-primary",
  teal: "bg-teal/10 text-teal",
  gray: "bg-muted text-muted-foreground",
};
export const statusTone = (s) =>
  ({ Active: "green", Paid: "green", "In Stock": "green", Healthy: "green", Inactive: "gray", Pending: "amber", Partial: "amber", "Low Stock": "amber", Overdue: "red", "Out of Stock": "red", Reorder: "red", Cash: "teal", UPI: "blue", Card: "amber" })[s] || "gray";
export function Badge({ children, tone }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${badgeTones[tone || statusTone(children)]}`}>{children}</span>;
}

export function Card({ children, className = "" }) {
  return <section className={`rounded-xl border border-border bg-card p-4 shadow-soft sm:p-5 ${className}`}>{children}</section>;
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-[.12em] text-teal">Anand Wholesale</p>
        <h1 className="font-display mt-1 text-2xl font-extrabold">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

const statTones = { blue: "bg-primary/10 text-primary", teal: "bg-teal/10 text-teal", amber: "bg-accent/15 text-accent-foreground", green: "bg-success/10 text-success", red: "bg-destructive/10 text-destructive" };
export function StatCard({ label, value, detail, icon, tone = "blue" }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-soft transition hover:-translate-y-0.5 hover:border-primary/30 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold leading-5 text-muted-foreground">{label}</p>
        <span className={`grid size-9 shrink-0 place-items-center rounded-lg ${statTones[tone]}`}><Icon name={icon} /></span>
      </div>
      <p className="font-display mt-3 text-xl font-extrabold sm:text-2xl">{value}</p>
      {detail && <p className="mt-1 text-[11px] text-muted-foreground">{detail}</p>}
    </div>
  );
}

/* ---------- Table with mock pagination ---------- */
export function DataTable({ columns, rows, pageSize = 10, empty = "No matching records", rowKey = (r, i) => r.id ?? i }) {
  const [page, setPage] = useState(1);
  const pages = Math.max(1, Math.ceil(rows.length / pageSize));
  const current = Math.min(page, pages);
  const shown = rows.slice((current - 1) * pageSize, current * pageSize);
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border bg-muted/70">
            <tr>{columns.map((c) => <th key={c.label} className={`px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground ${c.right ? "text-right" : ""}`}>{c.label}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-border">
            {shown.map((r, i) => (
              <tr key={rowKey(r, i)} className="transition-colors hover:bg-muted/40">
                {columns.map((c) => <td key={c.label} className={`px-4 py-3 align-middle ${c.right ? "text-right" : ""}`}>{c.render ? c.render(r) : r[c.key]}</td>)}
              </tr>
            ))}
            {!shown.length && <tr><td colSpan={columns.length} className="px-4 py-12 text-center text-muted-foreground">{empty}</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 text-xs text-muted-foreground">
        <span>Showing {shown.length ? (current - 1) * pageSize + 1 : 0}–{(current - 1) * pageSize + shown.length} of {rows.length}</span>
        <div className="flex items-center gap-1">
          <IconBtn icon="chevronLeft" label="Previous page" disabled={current === 1} onClick={() => setPage(current - 1)} />
          {Array.from({ length: pages }, (_, i) => i + 1).filter((p) => Math.abs(p - current) < 3 || p === 1 || p === pages).map((p) => (
            <button key={p} onClick={() => setPage(p)} className={`size-8 rounded-md font-semibold transition ${p === current ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>{p}</button>
          ))}
          <IconBtn icon="chevronRight" label="Next page" disabled={current === pages} onClick={() => setPage(current + 1)} />
        </div>
      </div>
    </div>
  );
}

/* ---------- Modal & confirmation ---------- */
export function Modal({ open, title, onClose, children, wide }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-foreground/40 p-4 animate-in fade-in" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label={title} className={`w-full ${wide ? "max-w-3xl" : "max-w-lg"} rounded-xl border border-border bg-card p-5 shadow-xl animate-in zoom-in-95 sm:p-6`}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-bold">{title}</h2>
          <IconBtn icon="x" label="Close" onClick={onClose} />
        </div>
        {children}
      </div>
    </div>
  );
}

export function ConfirmDialog({ open, title = "Are you sure?", message, confirmLabel = "Delete", onConfirm, onCancel }) {
  return (
    <Modal open={open} title={title} onClose={onCancel}>
      <div className="flex gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-destructive/10 text-destructive"><Icon name="alert" /></span>
        <p className="text-sm leading-6 text-muted-foreground">{message}</p>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Btn variant="outline" onClick={onCancel}>Cancel</Btn>
        <Btn variant="danger" onClick={onConfirm}>{confirmLabel}</Btn>
      </div>
    </Modal>
  );
}

/* ---------- Mock export / print ---------- */
export function useReportActions() {
  const { notify } = useToast();
  return {
    exportCsv: (name, columns, rows) => {
      const head = columns.filter((c) => c.key).map((c) => c.label);
      const body = rows.map((r) => columns.filter((c) => c.key).map((c) => `"${String(r[c.key] ?? "").replaceAll('"', '""')}"`).join(","));
      const url = URL.createObjectURL(new Blob([[head.join(","), ...body].join("\n")], { type: "text/csv" }));
      const a = document.createElement("a");
      a.href = url; a.download = `${name}.csv`; a.click(); URL.revokeObjectURL(url);
      notify(`${name} exported (${rows.length} rows).`);
    },
    print: () => { notify("Preparing print preview…"); setTimeout(() => window.print(), 300); },
  };
}
