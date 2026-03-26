"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui";

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errors");

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20">
      <h2 className="text-xl font-semibold">{t("somethingWentWrong")}</h2>
      <p className="text-sm text-muted-foreground">{t("unexpectedError")}</p>
      <Button onClick={reset}>{t("tryAgain")}</Button>
    </div>
  );
}
