import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Post } from "../types";

vi.mock("../lib/mdx", () => ({
  getAllSlugs: vi.fn(),
  getPostBySlug: vi.fn(),
}));

import { getAllPosts, getPostsByTag, getAllTags, getAdjacentPosts } from "../lib/posts";
import { getAllSlugs, getPostBySlug } from "../lib/mdx";

function makePost(overrides: Partial<Post> & { slug: string }): Post {
  return {
    slug: overrides.slug,
    content: overrides.content ?? "content",
    frontmatter: {
      title: overrides.frontmatter?.title ?? overrides.slug,
      description: overrides.frontmatter?.description ?? "",
      date: overrides.frontmatter?.date ?? "2026-01-01",
      tags: overrides.frontmatter?.tags ?? [],
      published: overrides.frontmatter?.published ?? true,
      image: overrides.frontmatter?.image,
    },
  };
}

const post1 = makePost({
  slug: "first",
  frontmatter: { title: "First", description: "", date: "2026-01-01", tags: ["react"], published: true },
});
const post2 = makePost({
  slug: "second",
  frontmatter: { title: "Second", description: "", date: "2026-02-01", tags: ["react", "nextjs"], published: true },
});
const post3 = makePost({
  slug: "third",
  frontmatter: { title: "Third", description: "", date: "2026-03-01", tags: ["nextjs"], published: true },
});
const unpublished = makePost({
  slug: "draft",
  frontmatter: { title: "Draft", description: "", date: "2026-04-01", tags: ["draft"], published: false },
});

beforeEach(() => {
  vi.mocked(getAllSlugs).mockReturnValue(["first", "second", "third", "draft"]);
  vi.mocked(getPostBySlug).mockImplementation((slug) => {
    const map: Record<string, Post> = { first: post1, second: post2, third: post3, draft: unpublished };
    return map[slug] ?? null;
  });
});

describe("getAllPosts", () => {
  it("returns published posts sorted by date descending", () => {
    const posts = getAllPosts();
    expect(posts).toHaveLength(3);
    expect(posts[0].slug).toBe("third");
    expect(posts[1].slug).toBe("second");
    expect(posts[2].slug).toBe("first");
  });

  it("excludes unpublished posts", () => {
    const posts = getAllPosts();
    expect(posts.find((p) => p.slug === "draft")).toBeUndefined();
  });

  it("handles null from getPostBySlug", () => {
    vi.mocked(getPostBySlug).mockReturnValue(null);
    expect(getAllPosts()).toHaveLength(0);
  });
});

describe("getPostsByTag", () => {
  it("filters posts by tag (case-insensitive)", () => {
    const posts = getPostsByTag("React");
    expect(posts).toHaveLength(2);
    expect(posts.map((p) => p.slug)).toContain("first");
    expect(posts.map((p) => p.slug)).toContain("second");
  });

  it("returns empty array for non-existent tag", () => {
    expect(getPostsByTag("vue")).toHaveLength(0);
  });
});

describe("getAllTags", () => {
  it("returns unique sorted tags", () => {
    const tags = getAllTags();
    expect(tags).toEqual(["nextjs", "react"]);
  });
});

describe("getAdjacentPosts", () => {
  it("returns prev and next posts", () => {
    const { prev, next } = getAdjacentPosts("second");
    expect(next?.slug).toBe("third"); // newer
    expect(prev?.slug).toBe("first"); // older
  });

  it("returns null prev for last post", () => {
    const { prev } = getAdjacentPosts("first");
    expect(prev).toBeNull();
  });

  it("returns null next for first post", () => {
    const { next } = getAdjacentPosts("third");
    expect(next).toBeNull();
  });

  it("returns first post as prev when slug not found (index=-1)", () => {
    // findIndex returns -1, so index+1=0 → first post, index-1=-1 → undefined
    const { prev, next } = getAdjacentPosts("nonexistent");
    expect(prev?.slug).toBe("third"); // posts[0] since -1 < length-1
    expect(next).toBeNull(); // -1 > 0 is false
  });
});
