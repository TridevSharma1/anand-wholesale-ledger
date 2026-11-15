import { createFileRoute } from "@tanstack/react-router";
import { PublicFooter, PublicPage } from "@/components/anand-site";

export const Route = createFileRoute("/services")({
  component: ServicesPage,
  head: () => ({ meta: [
    { title: "Wholesale Services | Anand Wholesale" },
    { name: "description", content: "Wholesale distribution, point-of-sale billing, stock tracking, and retailer support from Anand Wholesale." },
    { property: "og:title", content: "Wholesale Services | Anand Wholesale" },
    { property: "og:description", content: "Explore everyday wholesale supply and practical billing and inventory support." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
});

function ServicesPage() {
  return <><PublicPage eyebrow="Services" title="Wholesale essentials and the tools to manage them." intro="A local supply partner and an organized way to handle the daily movement of goods." items={["Wholesale supply across packaged foods, beverages, personal care, home care, and more.", "Purchase entries for tracking vendor invoices, rates, and payment due dates.", "Counter billing with customer details, itemized products, discounts, and tax totals.", "Inventory visibility with stock levels and low-stock alerts."]} /><PublicFooter /></>;
}