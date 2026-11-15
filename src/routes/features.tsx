import { createFileRoute } from "@tanstack/react-router";
import { PublicFooter, PublicPage } from "@/components/anand-site";

export const Route = createFileRoute("/features")({
  component: FeaturesPage,
  head: () => ({ meta: [
    { title: "Billing Software Features | Anand Wholesale" },
    { name: "description", content: "See the wholesale billing, product, stock, vendor, customer, and reporting tools in Anand Wholesale." },
    { property: "og:title", content: "Billing Software Features | Anand Wholesale" },
    { property: "og:description", content: "A practical overview of Anand Wholesale’s billing and inventory workspace." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
});

function FeaturesPage() {
  return <><PublicPage eyebrow="Features" title="A clearer view of everyday wholesale operations." intro="Bring the key jobs of a busy wholesale counter into one business workspace." items={["Find products quickly by name, brand, SKU, or barcode.", "Build itemized bills with payment type, GST, discounts, and print support.", "Review purchasing, sales, expenses, vendor dues, and stock summaries.", "Use distinct administrator and cashier menus for the right day-to-day access."]} /><PublicFooter /></>;
}