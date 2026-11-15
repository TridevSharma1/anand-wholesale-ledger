import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PublicFooter, PublicNav } from "@/components/anand-site";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({ meta: [
    { title: "Contact Anand Wholesale | Vijayapura" },
    { name: "description", content: "Call, email, or visit Anand Wholesale at Extension Center on Vijayapur–Solapur Road, Tidagundi." },
    { property: "og:title", content: "Contact Anand Wholesale | Vijayapura" },
    { property: "og:description", content: "Contact Anand Wholesale in Vijayapura by phone, email, or visit." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
});

function ContactPage() {
  return <><main><section className="bg-sidebar"><PublicNav /><div className="mx-auto max-w-7xl px-5 pb-16 pt-44 lg:px-10"><p className="text-xs font-bold uppercase tracking-[.14em] text-warning">Contact</p><h1 className="font-display mt-4 max-w-3xl text-4xl font-extrabold leading-tight text-sidebar-foreground sm:text-5xl">Your Anand Wholesale team is nearby.</h1><p className="mt-5 max-w-2xl text-base leading-7 text-sidebar-foreground/70">Get in touch about wholesale orders, products, or the billing workspace.</p></div></section><section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-3 lg:px-10 lg:py-24"><article className="border-t border-border pt-5"><p className="text-xs font-bold uppercase tracking-[.14em] text-teal">Visit</p><h2 className="font-display mt-3 text-xl font-extrabold">Vijayapura</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">Extension Center, NH-52, Vijayapur-Solapur Rd, Tidagundi, Vijayapura, Karnataka - 586119</p></article><article className="border-t border-border pt-5"><p className="text-xs font-bold uppercase tracking-[.14em] text-teal">Call</p><h2 className="font-display mt-3 text-xl font-extrabold">+91 91759 95609</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">Speak with the team about products, orders, and business tools.</p><Button asChild variant="outline" className="mt-4"><a href="tel:+919175995609">Call Anand Wholesale</a></Button></article><article className="border-t border-border pt-5"><p className="text-xs font-bold uppercase tracking-[.14em] text-teal">Email</p><h2 className="font-display mt-3 text-xl font-extrabold">anand@gmail.com</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">Send your wholesale or billing enquiry to the team.</p><Button asChild variant="outline" className="mt-4"><a href="mailto:anand@gmail.com">Email Anand Wholesale</a></Button></article></section></main><PublicFooter /></>;
}