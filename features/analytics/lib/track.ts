import posthog from "posthog-js";
import { isPostHogEnabled, isGAEnabled, analyticsConfig } from "./config";

export function trackEvent(
  name: string,
  properties?: Record<string, unknown>,
) {
  if (isPostHogEnabled) {
    posthog.capture(name, properties);
  }

  if (isGAEnabled && typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", name, properties);
  }
}

export function identifyUser(userId: string, traits?: Record<string, unknown>) {
  if (isPostHogEnabled) {
    posthog.identify(userId, traits);
  }

  if (isGAEnabled && typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("config", analyticsConfig.gaId, { user_id: userId });
  }
}
