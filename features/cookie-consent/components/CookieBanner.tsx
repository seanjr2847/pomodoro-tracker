"use client";

import { useState, useEffect } from "react";
import { Cookie } from "lucide-react";
import { Button } from "@/shared/ui";
import { getConsent, setConsent } from "../lib/consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show banner only if user hasn't responded yet
    if (getConsent() === null) {
      setVisible(true);
    }
  }, []);

  function handleAccept() {
    setConsent("accepted");
    setVisible(false);
    // Update GA4 consent mode
    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", { analytics_storage: "granted" });
    }
  }

  function handleDecline() {
    setConsent("declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4">
      <div className="mx-auto flex max-w-screen-lg flex-col items-center gap-4 rounded-lg border bg-background p-4 shadow-lg sm:flex-row sm:justify-between">
        <div className="flex items-start gap-3">
          <Cookie className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            We use cookies to improve your experience and analyze site traffic.
            By accepting, you agree to our use of cookies.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" size="sm" onClick={handleDecline}>
            Decline
          </Button>
          <Button size="sm" onClick={handleAccept}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
