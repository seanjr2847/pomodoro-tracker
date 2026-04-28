"use client";

import { useQuery } from "@tanstack/react-query";
import { Activity, Zap, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui";
import { getMonthlyUsageAction, checkUsageLimitAction } from "../actions/usageActions";
import { type PlanType } from "../lib/usage";

function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
      <div
        className={`h-full rounded-full transition-all ${pct > 80 ? "bg-red-500" : "bg-neutral-900 dark:bg-white"}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function UsageDashboard({ plan = "free" }: { plan?: PlanType }) {
  const { data: usageResult } = useQuery({
    queryKey: ["usage-monthly"],
    queryFn: () => getMonthlyUsageAction(),
  });

  const { data: limitsResult } = useQuery({
    queryKey: ["usage-limits", plan],
    queryFn: () => checkUsageLimitAction(plan),
  });

  const usage = usageResult && "success" in usageResult && usageResult.success ? usageResult.data : undefined;
  const limits = limitsResult && "success" in limitsResult && limitsResult.success ? limitsResult.data : undefined;

  const stats = [
    {
      label: "Requests",
      value: usage?.requests ?? 0,
      max: limits?.limits.requests ?? 100,
      icon: Activity,
    },
    {
      label: "Tokens",
      value: usage?.tokens ?? 0,
      max: limits?.limits.tokens ?? 10_000,
      icon: Zap,
    },
    {
      label: "Cost",
      value: `$${(usage?.cost ?? 0).toFixed(2)}`,
      icon: DollarSign,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage This Month</CardTitle>
        <CardDescription>
          {plan === "free" ? "Free" : "Pro"} plan — resets monthly
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats.map((s) => (
          <div key={s.label} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <s.icon className="h-3.5 w-3.5" />
                {s.label}
              </span>
              <span className="font-medium">
                {typeof s.value === "number"
                  ? s.value.toLocaleString()
                  : s.value}
                {s.max && (
                  <span className="text-muted-foreground">
                    {" "}
                    / {s.max.toLocaleString()}
                  </span>
                )}
              </span>
            </div>
            {s.max && typeof s.value === "number" && (
              <ProgressBar value={s.value} max={s.max} />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
