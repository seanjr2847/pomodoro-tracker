import Link from "next/link";
import { Button } from "@/shared/ui";

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h2 className="text-4xl font-bold">Offline</h2>
      <p className="text-muted-foreground">
        You appear to be offline. Check your connection and try again.
      </p>
      <Button asChild>
        <Link href="/">Try again</Link>
      </Button>
    </div>
  );
}
