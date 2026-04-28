"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/shared/ui";

export default function DashboardNotFound() {
  const t = useTranslations("errors");

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20">
      <h2 className="text-xl font-semibold">{t("pageNotFound")}</h2>
      <p className="text-sm text-muted-foreground">{t("pageNotFoundDescription")}</p>
      <Button asChild>
        <Link href="/dashboard">{t("goToDashboard")}</Link>
      </Button>
    </div>
  );
}
