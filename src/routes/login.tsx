import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { LoginForm } from "@/components/anand-workspace";
import { Brand, PublicFooter } from "@/components/anand-site";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [
    { title: "Sign in | Anand Wholesale Billing" },
    { name: "description", content: "Sign in to the Anand Wholesale billing and inventory workspace." },
    { property: "og:title", content: "Sign in | Anand Wholesale Billing" },
    { property: "og:description", content: "Open the Anand Wholesale business workspace." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
});

function LoginPage() {
  return <><main className="min-h-[70vh] bg-muted/50 px-5 py-12"><div className="mx-auto max-w-md"><div className="mb-8"><Brand /></div><section className="rounded-lg border border-border bg-card p-6 shadow-soft sm:p-8"><p className="text-xs font-bold uppercase tracking-[.14em] text-teal">Team sign in</p><h1 className="font-display mt-2 text-2xl font-extrabold">Welcome to your workspace</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">Use your team account to open billing and business tools.</p><div className="mt-6"><LoginForm /></div><div className="mt-6 border-t border-border pt-5"><p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Sample accounts</p><div className="mt-3 grid gap-3 text-sm"><div className="flex items-center justify-between gap-3"><span><span className="block font-semibold">Admin</span><span className="text-muted-foreground">admin@anand.com</span></span><code className="rounded bg-muted px-2 py-1 text-xs">admin123</code></div><div className="flex items-center justify-between gap-3"><span><span className="block font-semibold">Cashier</span><span className="text-muted-foreground">cashier@anand.com</span></span><code className="rounded bg-muted px-2 py-1 text-xs">cash123</code></div></div></div><Button asChild variant="link" className="mt-4 px-0"><Link to="/">Back to Anand Wholesale</Link></Button></section></div></main><PublicFooter /></>;
}