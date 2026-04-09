import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Navbar, Footer, PricingPlaceholder } from "@/features/landing";

export const metadata: Metadata = {
  title: "Pricing",
  description: `Simple, transparent pricing for ${siteConfig.name}`,
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-neutral-50/80 dark:bg-black">
      <Navbar />
      <main>
        <PricingPlaceholder />
      </main>
      <Footer />
    </div>
  );
}
