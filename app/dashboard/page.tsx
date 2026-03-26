"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Inbox } from "lucide-react";
import { Button } from "@/shared/ui";
import { LucideIconByName } from "@/shared/ui/lucide-icon";
import { siteConfig } from "@/config/site";
import Link from "next/link";

export default function DashboardPage() {
  const t = useTranslations("dashboard.emptyState");
  const [clicked, setClicked] = useState(false);
  const es = siteConfig.emptyState;

  const icon = es?.icon ?? "Inbox";
  const title = es?.title ?? t("title");
  const description = es?.description ?? t("description");
  const ctaText = es?.ctaText ?? t("cta");
  const ctaHref = es?.ctaHref ?? "#";

  const isNoOp = ctaHref === "#";

  return (
    <div className="flex flex-1 flex-col items-center justify-center py-20">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="rounded-full bg-muted p-4">
          {icon === "Inbox" ? (
            <Inbox className="h-8 w-8 text-muted-foreground" />
          ) : (
            <LucideIconByName name={icon} className="h-8 w-8 text-muted-foreground" />
          )}
        </div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
        {isNoOp ? (
          <Button
            onClick={() => {
              setClicked(true);
              setTimeout(() => setClicked(false), 2000);
            }}
          >
            {clicked ? "Coming Soon!" : ctaText}
          </Button>
        ) : (
          <Button asChild>
            <Link href={ctaHref}>{ctaText}</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
