import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import warehouseImage from "@/assets/anand-warehouse.jpg";

const links = [
  ["About", "/about"], ["Services", "/services"], ["Features", "/features"],
  ["Pricing", "/pricing"], ["Contact", "/contact"],
] as const;

export function Brand({ inverse = false }: { inverse?: boolean }) {
  return <Link to="/" className={`inline-flex items-center gap-3 ${inverse ? "text-sidebar-foreground" : "text-foreground"}`}>
    <span className="grid size-10 place-items-center rounded-lg bg-primary font-display text-lg font-extrabold text-primary-foreground">A</span>
    <span className="leading-tight"><span className="block font-display text-sm font-extrabold">Anand Wholesale</span><span className={`block text-[10px] font-medium ${inverse ? "text-sidebar-foreground/60" : "text-muted-foreground"}`}>BILLING & INVENTORY</span></span>
  </Link>;
}

export function PublicNav() {
  return <header className="absolute inset-x-0 top-0 z-20 border-b border-primary-foreground/15">
    <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 lg:px-10">
      <Brand inverse />
      <nav className="hidden items-center gap-7 md:flex">{links.map(([label, href]) => <Link key={label} to={href} className="text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground">{label}</Link>)}</nav>
      <Button asChild variant="hero" size="default"><Link to="/login">Sign in <span aria-hidden="true">↗</span></Link></Button>
    </div>
    <nav className="no-scrollbar flex gap-5 overflow-x-auto px-5 pb-3 md:hidden">{links.map(([label, href]) => <Link key={label} to={href} className="whitespace-nowrap text-xs font-medium text-primary-foreground/85">{label}</Link>)}</nav>
  </header>;
}

export function PublicFooter() {
  return <footer className="bg-sidebar text-sidebar-foreground">
    <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-[1.3fr_1fr_1fr_1.2fr] lg:px-10">
      <div><Brand inverse /><p className="mt-4 max-w-xs text-sm leading-6 text-sidebar-foreground/65">A trusted wholesale partner for everyday retail essentials in Vijayapura and beyond.</p><div className="mt-4 flex gap-2"><a className="grid size-8 place-items-center rounded-md border border-sidebar-border text-xs" href="https://www.facebook.com" aria-label="Facebook">f</a><a className="grid size-8 place-items-center rounded-md border border-sidebar-border text-xs" href="https://www.instagram.com" aria-label="Instagram">◎</a><a className="grid size-8 place-items-center rounded-md border border-sidebar-border text-xs" href="https://www.linkedin.com" aria-label="LinkedIn">in</a></div></div>
      <div><h3 className="text-sm font-bold">Explore</h3><div className="mt-4 grid gap-3">{links.map(([label, href]) => <Link key={label} to={href} className="text-sm text-sidebar-foreground/65 hover:text-sidebar-foreground">{label}</Link>)}</div></div>
      <div><h3 className="text-sm font-bold">Contact</h3><p className="mt-4 text-sm leading-6 text-sidebar-foreground/65">Extension Center, NH-52<br />Vijayapur–Solapur Rd, Tidagundi<br />Vijayapura, Karnataka – 586119</p><a className="mt-3 block text-sm text-sidebar-foreground/80" href="tel:+919175995609">+91 91759 95609</a><a className="mt-2 block text-sm text-sidebar-foreground/80" href="mailto:anand@gmail.com">anand@gmail.com</a></div>
      <div><h3 className="text-sm font-bold">For your team</h3><p className="mt-4 text-sm leading-6 text-sidebar-foreground/65">Fast billing, reliable stock records, and a clearer view of day-to-day operations.</p><Button asChild variant="hero" className="mt-4"><Link to="/login">Admin Login <span aria-hidden="true">↗</span></Link></Button></div>
    </div>
    <div className="border-t border-sidebar-border"><div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-xs text-sidebar-foreground/55 sm:flex-row sm:items-center sm:justify-between lg:px-10"><span>© 2026 Anand Wholesale. All rights reserved.</span><span>Vijayapura, Karnataka · India</span></div></div>
  </footer>;
}

export function HomePage() {
  return <><section className="relative flex min-h-[700px] items-end overflow-hidden bg-primary lg:min-h-[690px]">
      <img src={warehouseImage} alt="Warehouse team checking wholesale stock" width={1600} height={900} fetchPriority="high" className="absolute inset-0 size-full object-cover" />
      <div className="hero-shade absolute inset-0" />
      <PublicNav />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-16 pt-44 lg:px-10 lg:pb-24">
        <div className="max-w-2xl text-primary-foreground">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-3 py-1.5 text-xs font-semibold"><span className="size-1.5 rounded-full bg-warning" />Wholesale partner · Vijayapura, Karnataka</span>
          <h1 className="font-display mt-6 text-5xl font-extrabold leading-[1.08] sm:text-6xl">Anand Wholesale<br /><span className="text-primary-foreground/75">Billing Software</span></h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-primary-foreground/80 sm:text-lg">A simpler way to keep your products moving and your business in view. Built around the everyday rhythm of wholesale.</p>
          <p className="mt-4 flex items-center gap-2 text-sm font-bold text-primary-foreground"><span className="grid size-6 place-items-center rounded-full bg-primary-foreground/15">✓</span>Manage Purchase, Sales &amp; Inventory Easily</p>
          <div className="mt-8 flex flex-wrap gap-3"><Button asChild variant="hero" size="lg"><Link to="/login">Get Started <span aria-hidden="true">↗</span></Link></Button><Button asChild variant="heroOutline" size="lg"><Link to="/contact">Contact our team</Link></Button></div>
        </div>
      </div>
      <div className="absolute bottom-7 right-10 hidden items-center gap-3 text-xs text-primary-foreground/80 lg:flex"><span className="h-px w-12 bg-primary-foreground/55" />Serving retailers across North Karnataka</div>
    </section>
    <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[.85fr_1.15fr] lg:px-10 lg:py-24"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-teal">Built for the trade</p><h2 className="font-display mt-3 max-w-lg text-3xl font-extrabold leading-tight sm:text-4xl">Everyday wholesale, made easier to manage.</h2><p className="mt-5 max-w-lg text-sm leading-7 text-muted-foreground">From your first purchase entry to the last bill of the day, keep the essentials close at hand and the numbers in order.</p><Button asChild variant="outline" className="mt-7"><Link to="/about">More about Anand <span aria-hidden="true">→</span></Link></Button></div><div className="grid grid-cols-2 gap-x-8 gap-y-8 border-t border-border pt-6 sm:grid-cols-4 lg:border-t-0 lg:pt-0">{[["01", "Purchase tracking"], ["02", "Fast billing"], ["03", "Stock visibility"], ["04", "Business reports"]].map(([num, label]) => <div key={num} className="border-t border-border pt-4"><span className="font-display text-sm font-extrabold text-teal">{num}</span><p className="mt-3 text-sm font-semibold">{label}</p></div>)}</div></section>
    <section className="border-y border-border bg-card"><div className="mx-auto flex max-w-7xl flex-col gap-7 px-5 py-12 sm:flex-row sm:items-center sm:justify-between lg:px-10"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-teal">A better daily rhythm</p><h2 className="font-display mt-2 text-2xl font-extrabold">One place for the busywork.</h2></div><Button asChild><Link to="/features">Explore the features <span aria-hidden="true">→</span></Link></Button></div></section>
  </>;
}

export function PublicPage({ title, eyebrow, intro, items }: { title: string; eyebrow: string; intro: string; items: string[] }) {
  return <><div className="bg-sidebar"><PublicNav /><div className="mx-auto max-w-7xl px-5 pb-16 pt-44 lg:px-10"><p className="text-xs font-bold uppercase tracking-[.14em] text-warning">{eyebrow}</p><h1 className="font-display mt-4 max-w-3xl text-4xl font-extrabold leading-tight text-sidebar-foreground sm:text-5xl">{title}</h1><p className="mt-5 max-w-2xl text-base leading-7 text-sidebar-foreground/70">{intro}</p></div></div><section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-[.8fr_1.2fr] lg:px-10 lg:py-24"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-teal">Anand Wholesale</p><h2 className="font-display mt-3 text-3xl font-extrabold">Thoughtful tools for a hands-on business.</h2></div><div className="divide-y divide-border">{items.map((item, i) => <div key={item} className="flex gap-5 py-5 first:pt-0"><span className="font-display text-sm font-extrabold text-teal">0{i + 1}</span><p className="text-sm leading-6 text-muted-foreground">{item}</p></div>)}<Button asChild className="mt-7"><Link to="/contact">Talk to Anand Wholesale <span aria-hidden="true">→</span></Link></Button></div></section></>;
}