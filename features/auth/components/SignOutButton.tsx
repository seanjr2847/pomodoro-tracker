"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/shared/ui";

export function SignOutButton({ className }: { className?: string }) {
  return (
    <Button
      variant="ghost"
      className={className}
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      Log out
    </Button>
  );
}
