"use client";

import { Check } from "lucide-react";
import { useSession } from "next-auth/react";
import { siteConfig } from "@/config/site";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from "@/shared/ui";
import { cn } from "@/shared/utils/cn";
import { paddleClientConfig } from "../config/paddle";

export function PricingCard() {
  const { plans } = siteConfig.pricing;
  const { data: session } = useSession();

  function handleCheckout(priceId: string) {
    if (!window.Paddle || !priceId) return;

    window.Paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      customData: session?.user?.id ? { user_id: session.user.id } : undefined,
      customer: session?.user?.email
        ? { email: session.user.email }
        : undefined,
    });
  }

  const colsClass =
    plans.length === 1
      ? "max-w-sm mx-auto"
      : plans.length === 2
        ? "md:grid-cols-2"
        : plans.length === 3
          ? "md:grid-cols-3"
          : "md:grid-cols-2 lg:grid-cols-4";

  return (
    <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Pricing</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Simple pricing for everyone.
        </p>
      </div>
      <div className={cn("mt-12 grid gap-8", colsClass)}>
        {plans.map((plan) => {
          const planPriceId = plan.priceId ?? paddleClientConfig.priceId;
          const canCheckout = !!planPriceId;

          return (
            <Card
              key={plan.id}
              className={cn("relative", plan.highlighted && "border-primary")}
            >
              {plan.highlighted && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Popular
                </Badge>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <p className="text-3xl font-bold">{plan.price}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                {plan.href ? (
                  <Button variant="outline" className="mt-6 w-full" asChild>
                    <a href={plan.href}>{plan.cta}</a>
                  </Button>
                ) : (
                  <Button
                    className="mt-6 w-full"
                    onClick={canCheckout ? () => handleCheckout(planPriceId!) : undefined}
                    disabled={!canCheckout}
                  >
                    {canCheckout ? plan.cta : "Coming Soon"}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
