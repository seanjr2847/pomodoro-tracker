import { describe, it, expect } from "vitest";
// Import directly from content files to avoid pulling in LegalDocument.tsx (JSX)
// via the barrel export, which vitest cannot parse in node environment.
import { getPrivacyPolicy } from "@/features/legal/content/privacy";
import { getTermsOfService } from "@/features/legal/content/terms";
import { siteConfig } from "@/config/site";

describe("getPrivacyPolicy", () => {
  it("returns an object (not null/undefined)", () => {
    const result = getPrivacyPolicy();
    expect(result).toBeDefined();
    expect(result).not.toBeNull();
  });

  it("returns a title string that is not empty", () => {
    const result = getPrivacyPolicy();
    expect(typeof result.title).toBe("string");
    expect(result.title.length).toBeGreaterThan(0);
  });

  it("title contains the site name", () => {
    const result = getPrivacyPolicy();
    expect(result.title).toContain(siteConfig.name);
  });

  it("returns an effectiveDate field", () => {
    const result = getPrivacyPolicy();
    expect(result.effectiveDate).toBeDefined();
  });

  it("returns a non-empty sections array", () => {
    const result = getPrivacyPolicy();
    expect(Array.isArray(result.sections)).toBe(true);
    expect(result.sections.length).toBeGreaterThan(0);
  });

  it("each section has a heading and content string", () => {
    const result = getPrivacyPolicy();
    for (const section of result.sections) {
      expect(typeof section.heading).toBe("string");
      expect(section.heading.length).toBeGreaterThan(0);
      expect(typeof section.content).toBe("string");
      expect(section.content.length).toBeGreaterThan(0);
    }
  });
});

describe("getTermsOfService", () => {
  it("returns an object (not null/undefined)", () => {
    const result = getTermsOfService();
    expect(result).toBeDefined();
    expect(result).not.toBeNull();
  });

  it("returns a title string that is not empty", () => {
    const result = getTermsOfService();
    expect(typeof result.title).toBe("string");
    expect(result.title.length).toBeGreaterThan(0);
  });

  it("title contains the site name", () => {
    const result = getTermsOfService();
    expect(result.title).toContain(siteConfig.name);
  });

  it("returns an effectiveDate field", () => {
    const result = getTermsOfService();
    expect(result.effectiveDate).toBeDefined();
  });

  it("returns a non-empty sections array", () => {
    const result = getTermsOfService();
    expect(Array.isArray(result.sections)).toBe(true);
    expect(result.sections.length).toBeGreaterThan(0);
  });

  it("each section has a heading and content string", () => {
    const result = getTermsOfService();
    for (const section of result.sections) {
      expect(typeof section.heading).toBe("string");
      expect(section.heading.length).toBeGreaterThan(0);
      expect(typeof section.content).toBe("string");
      expect(section.content.length).toBeGreaterThan(0);
    }
  });
});
