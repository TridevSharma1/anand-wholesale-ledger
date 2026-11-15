import { createFileRoute } from "@tanstack/react-router";
import { HomePage, PublicFooter } from "@/components/anand-site";

// The home route ships no og:image, so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Anand Wholesale | Wholesale Billing Software" },
      { name: "description", content: "Manage purchase, sales, and inventory easily with Anand Wholesale in Vijayapura." },
      { property: "og:title", content: "Anand Wholesale | Wholesale Billing Software" },
      { property: "og:description", content: "Manage purchase, sales, and inventory easily with Anand Wholesale in Vijayapura." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Index() {
  return <><HomePage /><PublicFooter /></>;
}
