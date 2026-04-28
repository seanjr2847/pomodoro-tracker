import { Zap } from "lucide-react";
import { Badge } from "@/shared/ui";

interface CreditBadgeProps {
  used: number;
  limit: number;
}

export function CreditBadge({ used, limit }: CreditBadgeProps) {
  const remaining = Math.max(0, limit - used);
  const pct = limit > 0 ? (used / limit) * 100 : 0;

  return (
    <Badge variant={pct > 90 ? "destructive" : "secondary"} className="gap-1">
      <Zap className="h-3 w-3" />
      {remaining.toLocaleString()} / {limit.toLocaleString()}
    </Badge>
  );
}
