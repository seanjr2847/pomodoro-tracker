import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { Navbar } from "./Navbar";
import { Banner } from "./Banner";
import { Hero } from "./Hero";
import { FeatureTabs } from "./FeatureTabs";
import { LogoCloud } from "./LogoCloud";
import { ValueProposition } from "./ValueProposition";
import { FeatureSection } from "./FeatureSection";
import { Testimonial } from "./Testimonial";
import { Integration } from "./Integration";
import { CTA } from "./CTA";
import { Footer } from "./Footer";
import { interleave } from "../lib/renderSections";

interface LandingPageProps {
  pricingSlot?: ReactNode;
}

export function LandingPage({ pricingSlot }: LandingPageProps) {
  const items = interleave(siteConfig.sections, siteConfig.testimonials);

  return (
    <div className="min-h-screen bg-neutral-50/80 dark:bg-black">
      <Navbar />
      <Banner />
      <main>
        <Hero />
        <FeatureTabs />
        <LogoCloud />
        <ValueProposition />

        {/* Feature Sections + Testimonials 교차 배치 */}
        {items.length > 0 && (
          <div className="mt-20 space-y-16">
            {items.map((item, i) =>
              item.type === "section" ? (
                <FeatureSection key={`section-${i}`} section={item.data} />
              ) : (
                <Testimonial key={`testimonial-${i}`} testimonial={item.data} />
              )
            )}
          </div>
        )}

        {pricingSlot}
        <Integration />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
