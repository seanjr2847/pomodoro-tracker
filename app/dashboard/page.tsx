import Link from "next/link";
import { Suspense } from "react";
import { Activity, Key, Zap, CreditCard, History, Settings } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle, Skeleton } from "@/shared/ui";
import { listApiKeysAction } from "@/features/api-keys";
import { getMonthlyUsageAction } from "@/features/usage";
import { UsageDashboard, ApiKeyManager, FeedbackForm } from "./widgets";

const quickActions = [
  {
    label: "Manage API Keys",
    href: "/dashboard/api-keys",
    icon: Key,
    description: "Create and revoke keys",
  },
  {
    label: "View History",
    href: "/dashboard/history",
    icon: History,
    description: "Browse past activity",
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    description: "Configure your account",
  },
];

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");

  const [keysResult, usageResult] = await Promise.allSettled([
    listApiKeysAction(),
    getMonthlyUsageAction(),
  ]);

  const apiKeyCount =
    keysResult.status === "fulfilled" && keysResult.value.success
      ? String(keysResult.value.data.length)
      : null;

  const requestsCount =
    usageResult.status === "fulfilled" && usageResult.value.success
      ? String(usageResult.value.data.requests)
      : null;

  const tokensUsed =
    usageResult.status === "fulfilled" && usageResult.value.success
      ? usageResult.value.data.tokens.toLocaleString()
      : null;

  const statsCards = [
    { label: "Requests This Month", value: requestsCount, icon: Activity },
    { label: "API Keys Active", value: apiKeyCount, icon: Key },
    { label: "Tokens Used", value: tokensUsed, icon: Zap },
    { label: "Current Plan", value: "Free", icon: CreditCard },
  ];

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("home")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome back — here&apos;s what&apos;s happening today.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card) => (
          <Card key={card.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.label}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {card.value !== null ? (
                <div className="text-2xl font-bold">{card.value}</div>
              ) : (
                <Skeleton className="h-8 w-20" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Suspense fallback={<Skeleton className="h-48 w-full rounded-lg" />}>
          <UsageDashboard plan="free" />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-48 w-full rounded-lg" />}>
          <ApiKeyManager />
        </Suspense>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">
          Quick Actions
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Card className="cursor-pointer transition-colors hover:border-primary/50 hover:bg-muted/30">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <action.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{action.label}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <FeedbackForm />
    </div>
  );
}
