import { LandingPage } from "@/features/landing";

export default function Home() {
  // Billing slot: when PADDLE_API_KEY is set, import PricingCard;
  // otherwise use PricingPlaceholder (or nothing).
  // This composition happens here in app/ to keep landing independent of billing.
  return <LandingPage />;
}
