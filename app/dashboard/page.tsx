"use client";

import { useTranslations } from "next-intl";
import { UsageDashboard } from "@/features/usage";
import { ApiKeyManager } from "@/features/api-keys";


export default function DashboardPage() {
  const t = useTranslations("dashboard");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("home")}</h1>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <UsageDashboard plan="free" />
        <ApiKeyManager />
      </div>
    </div>
  );
}
