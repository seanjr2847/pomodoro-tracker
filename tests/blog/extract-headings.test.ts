import { describe, it, expect, vi, beforeEach } from "vitest";
import fs from "fs";
import { extractHeadings, getPostBySlug, getAllSlugs } from "@/features/blog/lib/mdx";

vi.mock("fs");

describe("extractHeadings", () => {
  it("extracts h2 headings", () => {
    const content = "## Getting Started\n\nSome text.";
    const headings = extractHeadings(content);
    expect(headings).toEqual([
      { level: 2, text: "Getting Started", id: "getting-started" },
    ]);
  });

  it("extracts h3 headings", () => {
    const content = "### Installation Guide";
    const headings = extractHeadings(content);
    expect(headings).toEqual([
      { level: 3, text: "Installation Guide", id: "installation-guide" },
    ]);
  });

  it("extracts multiple headings in order", () => {
    const content = [
      "## First Section",
      "Some text",
      "### Subsection A",
      "More text",
      "## Second Section",
    ].join("\n");
    const headings = extractHeadings(content);
    expect(headings).toHaveLength(3);
    expect(headings[0].id).toBe("first-section");
    expect(headings[1].id).toBe("subsection-a");
    expect(headings[2].id).toBe("second-section");
  });

  it("returns empty array for content without headings", () => {
    expect(extractHeadings("Just plain text")).toEqual([]);
    expect(extractHeadings("")).toEqual([]);
  });

  it("ignores h1 and h4+ headings", () => {
    const content = "# H1 Title\n## H2 Title\n### H3 Title\n#### H4 Title";
    const headings = extractHeadings(content);
    expect(headings).toHaveLength(2);
    expect(headings[0].level).toBe(2);
    expect(headings[1].level).toBe(3);
  });

  it("slugifies special characters in IDs", () => {
    const content = "## Hello, World! (2024)";
    const headings = extractHeadings(content);
    expect(headings[0].id).toBe("hello-world-2024");
  });

  it("strips leading/trailing hyphens from IDs", () => {
    const content = "## -Dash Start-";
    const headings = extractHeadings(content);
    expect(headings[0].id).toBe("dash-start");
  });
});

describe("getPostBySlug", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns null for non-existent slug", () => {
    vi.mocked(fs.existsSync).mockReturnValue(false);
    expect(getPostBySlug("non-existent")).toBeNull();
  });

  it("reads and parses an MDX file", () => {
    const mdxContent = [
      "---",
      "title: Test Post",
      "description: A test",
      "date: 2026-01-01",
      "tags: [test]",
      "---",
      "",
      "# Hello World",
      "",
      "Content here.",
    ].join("\n");

    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readFileSync).mockReturnValue(mdxContent);

    const post = getPostBySlug("test-post");
    expect(post).not.toBeNull();
    expect(post!.slug).toBe("test-post");
    expect(post!.frontmatter.title).toBe("Test Post");
    expect(post!.content).toContain("# Hello World");
  });
});

describe("getAllSlugs", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns empty array when content dir does not exist", () => {
    vi.mocked(fs.existsSync).mockReturnValue(false);
    expect(getAllSlugs()).toEqual([]);
  });

  it("returns slugs from .mdx files only", () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readdirSync).mockReturnValue([
      "hello-world.mdx",
      "getting-started.mdx",
      "readme.md",
      "notes.txt",
    ] as unknown as ReturnType<typeof fs.readdirSync>);

    const slugs = getAllSlugs();
    expect(slugs).toEqual(["hello-world", "getting-started"]);
  });

  it("returns empty array when no .mdx files", () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readdirSync).mockReturnValue([
      "readme.md",
    ] as unknown as ReturnType<typeof fs.readdirSync>);

    expect(getAllSlugs()).toEqual([]);
  });
});
