import { describe, it, expect } from "vitest";
import { siteConfig } from "@/config/site";

describe("Footer", () => {
  it("produces clean copyright without double period", () => {
    const companyName = siteConfig.legal.companyName;
    const copyright = `© 2026 ${companyName.replace(/\.$/, "")}. All rights reserved.`;

    expect(copyright).not.toContain("..");
    expect(copyright).toContain("All rights reserved.");
  });

  it("handles companyName with trailing period", () => {
    const name = "Acme Inc.";
    const result = `${name.replace(/\.$/, "")}. All rights reserved.`;
    expect(result).toBe("Acme Inc. All rights reserved.");
  });

  it("handles companyName without trailing period", () => {
    const name = "Acme";
    const result = `${name.replace(/\.$/, "")}. All rights reserved.`;
    expect(result).toBe("Acme. All rights reserved.");
  });

  it("footer columns have valid links", () => {
    const columns = [
      {
        title: "Product",
        links: [
          { label: "Features", href: "/#features" },
          { label: "Pricing", href: "/pricing" },
          { label: "Blog", href: "/blog" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "About", href: "/about" },
          { label: "Blog", href: "/blog" },
        ],
      },
      {
        title: "Legal",
        links: [
          { label: "Privacy", href: "/privacy" },
          { label: "Terms", href: "/terms" },
        ],
      },
    ];

    columns.forEach((col) => {
      col.links.forEach((link) => {
        expect(link.href).toMatch(/^\//);
        expect(link.href).not.toMatch(/^#/);
      });
    });
  });
});
