"use client";

import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui";

export function SignInButton({
  variant = "default",
  className,
  label,
}: {
  variant?: "default" | "outline" | "ghost";
  className?: string;
  label?: string;
}) {
  const t = useTranslations("auth");
  const text = label ?? t("getStarted");
  return (
    <Button
      variant={variant}
      className={className}
      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
    >
      {text}
    </Button>
  );
}
