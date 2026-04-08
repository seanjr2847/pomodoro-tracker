import { describe, it, expect } from "vitest";
// Import directly from the module file to avoid pulling in jsonld.tsx (JSX)
// via the barrel export, which vitest cannot parse in node environment.
import { generateSiteMetadata } from "@/features/seo/metadata";
import { siteConfig } from "@/config/site";

describe("generateSiteMetadata", () => {
  it("returns an object with a title containing the site name", () => {
    const metadata = generateSiteMetadata();
    const title = metadata.title as { default: string; template: string };
    expect(title.default).toBe(siteConfig.name);
    expect(title.template).toContain(siteConfig.name);
  });

  it("returns the site description", () => {
    const metadata = generateSiteMetadata();
    expect(metadata.description).toBe(siteConfig.description);
  });

  it("sets metadataBase to the site URL", () => {
    const metadata = generateSiteMetadata();
    expect(metadata.metadataBase).toBeInstanceOf(URL);
    expect(metadata.metadataBase?.toString()).toContain(
      siteConfig.url.replace(/\/$/, ""),
    );
  });

  it("sets openGraph title and description from siteConfig", () => {
    const metadata = generateSiteMetadata();
    expect(metadata.openGraph?.title).toBe(siteConfig.name);
    expect(metadata.openGraph?.description).toBe(siteConfig.description);
  });

  it("sets openGraph type to website", () => {
    const metadata = generateSiteMetadata();
    expect(metadata.openGraph?.type).toBe("website");
  });

  it("sets twitter card to summary_large_image", () => {
    const metadata = generateSiteMetadata();
    expect(metadata.twitter?.card).toBe("summary_large_image");
  });

  it("sets robots index and follow to true", () => {
    const metadata = generateSiteMetadata();
    const robots = metadata.robots as { index: boolean; follow: boolean };
    expect(robots.index).toBe(true);
    expect(robots.follow).toBe(true);
  });

  it("sets theme-color in other from siteConfig", () => {
    const metadata = generateSiteMetadata();
    expect(metadata.other?.["theme-color"]).toBe(siteConfig.theme.primary);
  });

  it("includes canonical alternates", () => {
    const metadata = generateSiteMetadata();
    expect(metadata.alternates?.canonical).toBe("/");
  });
});
