"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errors");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">{t("somethingWentWrong")}</h2>
      <p className="text-muted-foreground">{t("unexpectedError")}</p>
      <Button onClick={reset}>{t("tryAgain")}</Button>
    </div>
  );
}
