import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("posthog-js", () => ({
  default: { capture: vi.fn(), identify: vi.fn() },
}));

vi.mock("../lib/config", () => ({
  isPostHogEnabled: true,
  isGAEnabled: true,
  analyticsConfig: { gaId: "G-TEST" },
}));

import { trackEvent, identifyUser } from "../lib/track";
import posthog from "posthog-js";

beforeEach(() => {
  vi.restoreAllMocks();
  // @ts-expect-error -- mock window.gtag
  global.window = {};
  window.gtag = vi.fn();
});

describe("trackEvent", () => {
  it("calls posthog.capture when PostHog is enabled", () => {
    trackEvent("click", { button: "signup" });
    expect(posthog.capture).toHaveBeenCalledWith("click", { button: "signup" });
  });

  it("calls window.gtag when GA is enabled", () => {
    trackEvent("click", { button: "signup" });
    expect(window.gtag).toHaveBeenCalledWith("event", "click", { button: "signup" });
  });
});

describe("identifyUser", () => {
  it("calls posthog.identify", () => {
    identifyUser("user-1", { plan: "pro" });
    expect(posthog.identify).toHaveBeenCalledWith("user-1", { plan: "pro" });
  });

  it("calls gtag config with user_id", () => {
    identifyUser("user-1");
    expect(window.gtag).toHaveBeenCalledWith("config", "G-TEST", { user_id: "user-1" });
  });
});
