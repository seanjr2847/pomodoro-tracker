"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/shared/ui";

export function SignInButton({
  variant = "default",
  className,
  label = "Get Started",
}: {
  variant?: "default" | "outline" | "ghost";
  className?: string;
  label?: string;
}) {
  return (
    <Button
      variant={variant}
      className={className}
      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
    >
      {label}
    </Button>
  );
}
