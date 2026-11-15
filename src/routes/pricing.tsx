import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PublicFooter, PublicNav } from "@/components/anand-site";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
  head: () => ({ meta: [
    { title: "Pricing | Anand Wholesale" },
    { name: "description", content: "Talk to Anand Wholesale in Vijayapura about wholesale supply and billing tools." },
    { property: "og:title", content: "Pricing | Anand Wholesale" },
    { property: "og:description", content: "Contact Anand Wholesale for current wholesale supply and billing information." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
});

function PricingPage() {
  return <><main><section className="bg-sidebar"><PublicNav /><div className="mx-auto max-w-7xl px-5 pb-16 pt-44 lg:px-10"><p className="text-xs font-bold uppercase tracking-[.14em] text-warning">Pricing</p><h1 className="font-display mt-4 max-w-3xl text-4xl font-extrabold leading-tight text-sidebar-foreground sm:text-5xl">Let’s talk about what your business needs.</h1><p className="mt-5 max-w-2xl text-base leading-7 text-sidebar-foreground/70">Wholesale pricing depends on products and order requirements. Contact the Anand Wholesale team for current details.</p></div></section><section className="mx-auto max-w-7xl px-5 py-16 lg:px-10 lg:py-24"><p className="text-xs font-bold uppercase tracking-[.14em] text-teal">Wholesale enquiries</p><h2 className="font-display mt-3 max-w-2xl text-3xl font-extrabold">Straightforward answers from your local team.</h2><p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">Call or email Anand Wholesale to discuss product availability, ordering, and billing needs.</p><div className="mt-7 flex flex-wrap gap-3"><Button asChild><a href="tel:+919175995609">Call +91 91759 95609</a></Button><Button asChild variant="outline"><Link to="/contact">Contact us</Link></Button></div></section></main><PublicFooter /></>;
}