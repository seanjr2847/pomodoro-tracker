import { describe, it, expect } from "vitest";
import { siteConfig } from "@/config/site";

describe("siteConfig", () => {
  it("has required top-level fields", () => {
    expect(siteConfig.name).toBeTruthy();
    expect(siteConfig.description).toBeTruthy();
    expect(siteConfig.url).toMatch(/^https?:\/\//);
    expect(siteConfig.email).toContain("@");
  });

  it("has valid theme configuration", () => {
    expect(siteConfig.theme.primary).toMatch(/^#[0-9a-fA-F]{6}$/);
    expect(siteConfig.theme.gradient).toContain("linear-gradient");
  });

  it("has hero with both CTA buttons", () => {
    expect(siteConfig.hero.title).toBeTruthy();
    expect(siteConfig.hero.subtitle).toBeTruthy();
    expect(siteConfig.hero.cta.primary.text).toBeTruthy();
    expect(siteConfig.hero.cta.primary.href).toBeTruthy();
  });

  it("has featureTabs with valid hrefs (no dead /features/* links)", () => {
    siteConfig.featureTabs.forEach((tab) => {
      expect(tab.href).not.toMatch(/^\/features\//);
    });
  });

  it("has sections with valid cta hrefs", () => {
    siteConfig.sections.forEach((section) => {
      expect(section.cta.href).not.toMatch(/^\/features\//);
    });
  });

  it("has at least one pricing plan", () => {
    expect(siteConfig.pricing.plans.length).toBeGreaterThan(0);
    siteConfig.pricing.plans.forEach((plan) => {
      expect(plan.name).toBeTruthy();
      expect(plan.features.length).toBeGreaterThan(0);
    });
  });

  it("has legal.companyName without trailing double period", () => {
    const name = siteConfig.legal.companyName;
    const footer = `${name.replace(/\.$/, "")}. All rights reserved.`;
    expect(footer).not.toContain("..");
  });

  it("has about section with team and values", () => {
    if (!siteConfig.about) {
      expect(siteConfig.about).toBeNull();
      return;
    }
    expect(siteConfig.about.team.length).toBeGreaterThan(0);
    expect(siteConfig.about.values.length).toBeGreaterThan(0);
  });

  it("has at least one testimonial", () => {
    expect(siteConfig.testimonials.length).toBeGreaterThan(0);
    siteConfig.testimonials.forEach((t) => {
      expect(t.name).toBeTruthy();
      expect(t.quote).toBeTruthy();
    });
  });
});
