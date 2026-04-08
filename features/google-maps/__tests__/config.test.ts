import { describe, it, expect, vi, afterEach } from "vitest";

describe("google-maps config", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it("is disabled when env var is not set", async () => {
    delete process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const mod = await import("../lib/config");
    expect(mod.GOOGLE_MAPS_API_KEY).toBe("");
    expect(mod.isGoogleMapsEnabled).toBe(false);
  });

  it("is enabled when env var is set", async () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY", "AIza_test_key");
    const mod = await import("../lib/config");
    expect(mod.GOOGLE_MAPS_API_KEY).toBe("AIza_test_key");
    expect(mod.isGoogleMapsEnabled).toBe(true);
  });
});
