import type { Metadata } from "next";
import { Navbar } from "@/features/landing";
import { Footer } from "@/features/landing";
import { PricingPlaceholder } from "@/features/landing";
import { PricingCard } from "@/features/billing";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple pricing for everyone.",
};

export default function PricingPage() {
  const hasBilling = !!process.env.PADDLE_API_KEY;

  return (
    <>
      <Navbar />
      {hasBilling ? <PricingCard /> : <PricingPlaceholder />}
      <Footer />
    </>
  );
}
