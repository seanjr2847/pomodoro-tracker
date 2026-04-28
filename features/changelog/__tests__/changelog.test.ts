import { describe, it, expect, vi, beforeEach } from "vitest";
import fs from "fs";

vi.mock("fs");

import { getChangelogEntry, getAllChangelogs } from "../lib/changelog";

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("getChangelogEntry", () => {
  it("returns parsed changelog entry", () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readFileSync).mockReturnValue(
      `---
title: "v1.0.0 Release"
date: "2026-03-01"
version: "1.0.0"
description: "Initial release"
---
Release content here`,
    );

    const entry = getChangelogEntry("v1-0-0");
    expect(entry).not.toBeNull();
    expect(entry!.slug).toBe("v1-0-0");
    expect(entry!.title).toBe("v1.0.0 Release");
    expect(entry!.version).toBe("1.0.0");
    expect(entry!.content).toContain("Release content here");
  });

  it("returns null for non-existent file", () => {
    vi.mocked(fs.existsSync).mockReturnValue(false);
    expect(getChangelogEntry("missing")).toBeNull();
  });

  it("defaults description to empty string", () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readFileSync).mockReturnValue(
      `---
title: "Update"
date: "2026-01-01"
version: "0.1.0"
---
No desc`,
    );
    const entry = getChangelogEntry("update");
    expect(entry!.description).toBe("");
  });
});

describe("getAllChangelogs", () => {
  it("returns empty array if directory does not exist", () => {
    vi.mocked(fs.existsSync).mockReturnValue(false);
    expect(getAllChangelogs()).toEqual([]);
  });

  it("returns changelogs sorted by date descending", () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readdirSync).mockReturnValue(
      ["v1.mdx", "v2.mdx", "readme.txt"] as unknown as ReturnType<typeof fs.readdirSync>,
    );
    vi.mocked(fs.readFileSync).mockImplementation((filePath) => {
      const p = String(filePath);
      if (p.includes("v1"))
        return '---\ntitle: "V1"\ndate: "2026-01-01"\nversion: "1.0"\n---\nV1';
      if (p.includes("v2"))
        return '---\ntitle: "V2"\ndate: "2026-02-01"\nversion: "2.0"\n---\nV2';
      return "";
    });

    const entries = getAllChangelogs();
    expect(entries).toHaveLength(2);
    expect(entries[0].version).toBe("2.0"); // newer first
    expect(entries[1].version).toBe("1.0");
  });

  it("filters non-mdx files", () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readdirSync).mockReturnValue(
      ["notes.txt", "data.json"] as unknown as ReturnType<typeof fs.readdirSync>,
    );
    expect(getAllChangelogs()).toEqual([]);
  });
});
