import { describe, it, expect } from "vitest";
import { extractHeadings } from "@/features/blog/lib/mdx";

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
