"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { siteConfig } from "@/config/site";

export function Banner() {
  const [dismissed, setDismissed] = useState(false);

  if (!siteConfig.banner || dismissed) return null;

  return (
    <div className="relative flex items-center justify-center gap-2 bg-primary px-4 py-2 text-center text-sm text-primary-foreground">
      <Link href={siteConfig.banner.href} className="flex items-center gap-1 hover:underline">
        {siteConfig.banner.text}
        <ArrowRight className="h-3 w-3" />
      </Link>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 rounded-sm opacity-70 hover:opacity-100"
        aria-label="Dismiss banner"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
