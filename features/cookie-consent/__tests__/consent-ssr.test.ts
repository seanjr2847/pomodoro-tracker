import { describe, it, expect, vi, beforeEach } from "vitest";

// Save and remove window to test SSR guard
const originalWindow = globalThis.window;

beforeEach(() => {
  // @ts-expect-error -- simulate SSR (no window)
  delete globalThis.window;
});

// Must use dynamic import so module re-evaluates
describe("consent SSR guards", () => {
  it("getConsent returns null when window is undefined", async () => {
    const { getConsent } = await import("../lib/consent");
    expect(getConsent()).toBeNull();
  });

  it("setConsent does nothing when window is undefined", async () => {
    const { setConsent } = await import("../lib/consent");
    // Should not throw
    setConsent("accepted");
  });

  it("hasResponded returns false when window is undefined", async () => {
    const { hasResponded } = await import("../lib/consent");
    expect(hasResponded()).toBe(false);
  });

  it("hasConsented returns false when window is undefined", async () => {
    const { hasConsented } = await import("../lib/consent");
    expect(hasConsented()).toBe(false);
  });
});

// Restore window after tests
afterAll(() => {
  globalThis.window = originalWindow;
});
