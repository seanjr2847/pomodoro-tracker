import { describe, it, expect, vi, afterEach } from "vitest";

describe("pwa config", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it("is disabled when env var is not set", async () => {
    vi.stubEnv("NEXT_PUBLIC_PWA_ENABLED", "");
    const mod = await import("../lib/config");
    expect(mod.isPwaEnabled).toBe(false);
  });

  it("is disabled when env var is not 'true'", async () => {
    vi.stubEnv("NEXT_PUBLIC_PWA_ENABLED", "false");
    const mod = await import("../lib/config");
    expect(mod.isPwaEnabled).toBe(false);
  });

  it("is enabled when env var is 'true'", async () => {
    vi.stubEnv("NEXT_PUBLIC_PWA_ENABLED", "true");
    const mod = await import("../lib/config");
    expect(mod.isPwaEnabled).toBe(true);
  });
});
