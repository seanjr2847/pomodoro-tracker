"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function PwaUpdater() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    navigator.serviceWorker.ready.then((registration) => {
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (!newWorker) return;

        newWorker.addEventListener("statechange", () => {
          if (
            newWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            toast("New version available", {
              description: "Refresh to update.",
              action: {
                label: "Refresh",
                onClick: () => window.location.reload(),
              },
              duration: Infinity,
            });
          }
        });
      });
    });
  }, []);

  return null;
}
