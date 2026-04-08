"use client";

import Link from "next/link";
import { Activity, Key, Zap, CreditCard, History, Settings } from "lucide-react";
import { useTranslations } from "next-intl";
<<<<<<< HEAD
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";
import { UsageDashboard, ApiKeyManager, FeedbackForm } from "./widgets";

const statsCards = [
  {
    label: "Requests This Month",
    value: "—",
    icon: Activity,
  },
  {
    label: "API Keys Active",
    value: "—",
    icon: Key,
  },
  {
    label: "Tokens Used",
    value: "—",
    icon: Zap,
  },
  {
    label: "Current Plan",
    value: "Free",
    icon: CreditCard,
  },
];

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
=======
import { UsageDashboard } from "@/features/usage";
import { ApiKeyManager } from "@/features/api-keys";
<<<<<<< HEAD
=======

>>>>>>> 97a9b91764f415196c300c2eaf880163656b1071
>>>>>>> 59ae8c622d47cf77f719d73ca7f578c98600f5b2

export default function DashboardPage() {
  const t = useTranslations("dashboard");

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
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <UsageDashboard plan="free" />
        <ApiKeyManager />
      </div>
<<<<<<< HEAD

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
=======
>>>>>>> 59ae8c622d47cf77f719d73ca7f578c98600f5b2
    </div>
  );
}
