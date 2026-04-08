import { describe, it, expect, vi } from "vitest";

vi.mock("@/config/site", () => ({
  siteConfig: { url: "https://example.com" },
}));

vi.mock("../lib/posts", () => ({
  getAllPosts: vi.fn(() => [
    {
      slug: "hello-world",
      frontmatter: { date: "2026-01-15" },
    },
    {
      slug: "second-post",
      frontmatter: { date: "2026-03-20" },
    },
  ]),
}));

import { getBlogSitemapEntries } from "../lib/sitemap";

describe("getBlogSitemapEntries", () => {
  it("returns sitemap entries for all posts", () => {
    const entries = getBlogSitemapEntries();
    expect(entries).toHaveLength(2);
  });

  it("builds correct URL from siteConfig and slug", () => {
    const entries = getBlogSitemapEntries();
    expect(entries[0].url).toBe("https://example.com/blog/hello-world");
    expect(entries[1].url).toBe("https://example.com/blog/second-post");
  });

  it("sets lastModified from frontmatter date", () => {
    const entries = getBlogSitemapEntries();
    expect(entries[0].lastModified).toEqual(new Date("2026-01-15"));
    expect(entries[1].lastModified).toEqual(new Date("2026-03-20"));
  });

  it("sets changeFrequency and priority", () => {
    const entries = getBlogSitemapEntries();
    for (const entry of entries) {
      expect(entry.changeFrequency).toBe("monthly");
      expect(entry.priority).toBe(0.6);
    }
  });
});
