import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  parseUtmParams,
  saveUtmParams,
  getUtmParams,
  captureUtmFromUrl,
} from "../lib/utm";

describe("parseUtmParams", () => {
  it("extracts all UTM parameters from URLSearchParams", () => {
    const params = new URLSearchParams(
      "utm_source=google&utm_medium=cpc&utm_campaign=spring&utm_term=saas&utm_content=banner"
    );
    const result = parseUtmParams(params);
    expect(result).toEqual({
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "spring",
      utm_term: "saas",
      utm_content: "banner",
    });
  });

  it("returns only present UTM params", () => {
    const params = new URLSearchParams("utm_source=twitter&other=ignored");
    const result = parseUtmParams(params);
    expect(result).toEqual({ utm_source: "twitter" });
  });

  it("returns empty object when no UTM params", () => {
    const params = new URLSearchParams("page=1&sort=asc");
    expect(parseUtmParams(params)).toEqual({});
  });
});

describe("saveUtmParams / getUtmParams", () => {
  let storage: Record<string, string>;

  beforeEach(() => {
    storage = {};
    vi.stubGlobal("window", {});
    vi.stubGlobal("sessionStorage", {
      getItem: (key: string) => storage[key] ?? null,
      setItem: (key: string, value: string) => {
        storage[key] = value;
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("saves and retrieves UTM params", () => {
    saveUtmParams({ utm_source: "test" });
    expect(getUtmParams()).toEqual({ utm_source: "test" });
  });

  it("merges with existing params", () => {
    saveUtmParams({ utm_source: "first" });
    saveUtmParams({ utm_medium: "email" });
    expect(getUtmParams()).toEqual({
      utm_source: "first",
      utm_medium: "email",
    });
  });

  it("overwrites same key", () => {
    saveUtmParams({ utm_source: "a" });
    saveUtmParams({ utm_source: "b" });
    expect(getUtmParams()).toEqual({ utm_source: "b" });
  });

  it("does nothing when utm is empty object", () => {
    saveUtmParams({});
    expect(getUtmParams()).toEqual({});
  });
});

describe("saveUtmParams / getUtmParams (server-side)", () => {
  it("returns empty on server (no window)", () => {
    // In Node.js, window is undefined by default
    const original = globalThis.window;
    // @ts-expect-error - removing window for test
    delete globalThis.window;
    expect(getUtmParams()).toEqual({});
    saveUtmParams({ utm_source: "ignored" }); // should not throw
    if (original) globalThis.window = original;
  });
});

describe("getUtmParams (sessionStorage error)", () => {
  beforeEach(() => {
    vi.stubGlobal("window", {});
    vi.stubGlobal("sessionStorage", {
      getItem: () => {
        throw new Error("SecurityError");
      },
      setItem: () => {
        throw new Error("SecurityError");
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns empty object when sessionStorage throws", () => {
    expect(getUtmParams()).toEqual({});
  });

  it("saveUtmParams does not throw when sessionStorage throws", () => {
    expect(() => saveUtmParams({ utm_source: "x" })).not.toThrow();
  });
});

describe("captureUtmFromUrl", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns empty on server", () => {
    const original = globalThis.window;
    // @ts-expect-error - removing window for test
    delete globalThis.window;
    expect(captureUtmFromUrl()).toEqual({});
    if (original) globalThis.window = original;
  });

  it("captures UTM params from window.location.search", () => {
    const storage: Record<string, string> = {};
    vi.stubGlobal("window", {
      location: { search: "?utm_source=newsletter&utm_campaign=launch" },
    });
    vi.stubGlobal("sessionStorage", {
      getItem: (key: string) => storage[key] ?? null,
      setItem: (key: string, value: string) => {
        storage[key] = value;
      },
    });

    const result = captureUtmFromUrl();
    expect(result).toEqual({
      utm_source: "newsletter",
      utm_campaign: "launch",
    });
    // Also persisted to storage
    expect(getUtmParams()).toEqual({
      utm_source: "newsletter",
      utm_campaign: "launch",
    });
  });
});
