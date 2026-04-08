"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import {
  analyticsConfig,
  isPostHogEnabled,
  isGAEnabled,
} from "../lib/config";
import { captureUtmFromUrl } from "../lib/utm";

let posthogInitialized = false;

function initPostHog() {
  if (posthogInitialized || !isPostHogEnabled) return;
  posthog.init(analyticsConfig.posthogKey, {
    api_host: analyticsConfig.posthogHost,
    person_profiles: "identified_only",
    capture_pageview: false, // we handle it manually
  });
  posthogInitialized = true;
}

export function AnalyticsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    initPostHog();
    captureUtmFromUrl();
  }, []);

  useEffect(() => {
    if (!pathname) return;

    const url = searchParams?.size
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    // PostHog pageview
    if (isPostHogEnabled && posthogInitialized) {
      posthog.capture("$pageview", { $current_url: url });
    }

    // GA4 pageview
    if (isGAEnabled && typeof window.gtag === "function") {
      window.gtag("config", analyticsConfig.gaId, { page_path: url });
    }
  }, [pathname, searchParams]);

  return <>{children}</>;
}
