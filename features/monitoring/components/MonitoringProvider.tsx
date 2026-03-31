"use client";

import { useEffect } from "react";
import { initSentry } from "../lib/sentry";
import { isSentryEnabled } from "../lib/config";

export function MonitoringProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (isSentryEnabled) {
      initSentry();
    }
  }, []);

  return <>{children}</>;
}
