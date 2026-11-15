import { createFileRoute } from "@tanstack/react-router";
import { Workspace } from "@/components/anand-workspace";

export const Route = createFileRoute("/app")({
  component: Workspace,
  head: () => ({ meta: [
    { title: "Business Workspace | Anand Wholesale" },
    { name: "description", content: "Manage Anand Wholesale billing, products, purchases, and inventory." },
    { property: "og:title", content: "Business Workspace | Anand Wholesale" },
    { property: "og:description", content: "Billing and inventory workspace for Anand Wholesale." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
});