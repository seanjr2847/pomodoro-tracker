import { describe, it, expect, vi, afterEach } from "vitest";
import type { NextConfig } from "next";

describe("withSerwist", () => {
  afterEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
  });

  it("returns config unchanged when PWA is disabled", async () => {
    vi.doMock("../lib/config", () => ({ isPwaEnabled: false }));
    const { withSerwist } = await import("../lib/withSerwist");
    const config: NextConfig = { reactStrictMode: true };
    expect(withSerwist(config)).toBe(config);
  });

  it("calls require(@serwist/next) when PWA is enabled", async () => {
    vi.doMock("../lib/config", () => ({ isPwaEnabled: true }));

    const wrappedConfig: NextConfig = { output: "standalone" };
    const initFn = vi.fn(() => wrappedConfig);
    const withSerwistInit = vi.fn(() => initFn);

    // Intercept the `require` call inside withSerwist
    const originalRequire = globalThis.require;
    // @ts-expect-error - monkey-patching require for test
    const Module = await import("module");
    const origResolve = Module.default.prototype.require;
    Module.default.prototype.require = function (id: string) {
      if (id === "@serwist/next") {
        return { default: withSerwistInit };
      }
      return origResolve.call(this, id);
    };

    try {
      const { withSerwist } = await import("../lib/withSerwist");
      const config: NextConfig = { reactStrictMode: true };
      const result = withSerwist(config);

      expect(withSerwistInit).toHaveBeenCalledWith({
        swSrc: "features/pwa/sw.ts",
        swDest: "public/sw.js",
        reloadOnOnline: false,
      });
      expect(initFn).toHaveBeenCalledWith(config);
      expect(result).toEqual(wrappedConfig);
    } finally {
      Module.default.prototype.require = origResolve;
    }
  });
});
