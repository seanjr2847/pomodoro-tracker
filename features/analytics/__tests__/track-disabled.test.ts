import { describe, it, expect, vi } from "vitest";

vi.mock("posthog-js", () => ({
  default: { capture: vi.fn(), identify: vi.fn() },
}));

vi.mock("../lib/config", () => ({
  isPostHogEnabled: false,
  isGAEnabled: false,
  analyticsConfig: { gaId: "" },
}));

import { trackEvent, identifyUser } from "../lib/track";
import posthog from "posthog-js";

describe("analytics track — disabled", () => {
  it("trackEvent does not call posthog or gtag when disabled", () => {
    trackEvent("click");
    expect(posthog.capture).not.toHaveBeenCalled();
  });

  it("identifyUser does not call posthog or gtag when disabled", () => {
    identifyUser("user-1");
    expect(posthog.identify).not.toHaveBeenCalled();
  });
});
