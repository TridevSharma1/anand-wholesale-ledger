import { createFileRoute } from "@tanstack/react-router";
import { PublicFooter, PublicPage } from "@/components/anand-site";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({ meta: [
    { title: "About Anand Wholesale | Vijayapura" },
    { name: "description", content: "Learn about Anand Wholesale, a wholesale distributor serving retailers in Vijayapura and North Karnataka." },
    { property: "og:title", content: "About Anand Wholesale | Vijayapura" },
    { property: "og:description", content: "A local wholesale partner serving retailers with dependable essentials and business-focused billing tools." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
});

function AboutPage() {
  return <><PublicPage eyebrow="About us" title="A dependable wholesale partner, close to home." intro="Anand Wholesale serves retailers from Vijayapura with everyday products, practical service, and clear business records." items={["Based at Extension Center on the NH-52 Vijayapur–Solapur Road in Tidagundi.", "A practical range of everyday products across ten familiar categories.", "Local service built around reliable supply and straightforward wholesale operations.", "Billing and stock tools designed to keep the day’s work organized."]} /><PublicFooter /></>;
}