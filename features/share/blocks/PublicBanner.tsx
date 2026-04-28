import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Button } from "@/shared/ui";

interface PublicBannerProps {
  appName?: string;
  ctaUrl?: string;
}

export function PublicBanner({
  appName = siteConfig.name,
  ctaUrl = "/",
}: PublicBannerProps) {
  return (
    <div className="border-t bg-muted/50 py-6 text-center">
      <p className="mb-2 text-sm text-muted-foreground">
        Created with <strong>{appName}</strong>
      </p>
      <Button asChild size="sm">
        <Link href={ctaUrl}>Try it free</Link>
      </Button>
    </div>
  );
}
