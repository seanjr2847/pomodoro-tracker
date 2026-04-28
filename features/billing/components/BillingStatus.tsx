"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";

interface BillingStatusProps {
  plan: string;
  renewalDate?: string;
}

export function BillingStatus({ plan, renewalDate }: BillingStatusProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm">
          <span className="text-muted-foreground">Current plan:</span>{" "}
          <span className="font-medium">{plan}</span>
        </p>
        {renewalDate && (
          <p className="text-sm">
            <span className="text-muted-foreground">Renews:</span>{" "}
            <span className="font-medium">{renewalDate}</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
