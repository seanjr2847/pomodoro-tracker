"use client";

import { useState, useEffect } from "react";
import { fetchSubscription } from "../actions/getSubscription";

interface Subscription {
  plan: string;
  status: "active" | "canceled" | "past_due" | "none";
  renewalDate?: string;
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription>({
    plan: "Free",
    status: "none",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSubscription()
      .then((result) => {
        if (result && "success" in result && result.success && result.data) {
          const data = result.data;
          setSubscription({
            plan: data.plan,
            status: data.status as Subscription["status"],
            renewalDate: data.currentPeriodEnd
              ? new Date(data.currentPeriodEnd).toLocaleDateString()
              : undefined,
          });
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  return { subscription, isLoading };
}
