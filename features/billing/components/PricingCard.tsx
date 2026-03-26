"use client";

import { Check } from "lucide-react";
import { useSession } from "next-auth/react";
import { siteConfig } from "@/config/site";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from "@/shared/ui";
import { paddleClientConfig } from "../config/paddle";

export function PricingCard() {
  const { pricing } = siteConfig;
  const { data: session } = useSession();

  const canCheckout = !!paddleClientConfig.priceId;

  function handleCheckout() {
    if (!window.Paddle || !paddleClientConfig.priceId) return;

    window.Paddle.Checkout.open({
      items: [{ priceId: paddleClientConfig.priceId, quantity: 1 }],
      customData: session?.user?.id ? { user_id: session.user.id } : undefined,
      customer: session?.user?.email
        ? { email: session.user.email }
        : undefined,
    });
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Pricing</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Simple pricing for everyone.
        </p>
      </div>
      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {/* Free */}
        <Card>
          <CardHeader>
            <CardTitle>{pricing.free.name}</CardTitle>
            <p className="text-3xl font-bold">{pricing.free.price}</p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {pricing.free.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
            <Button variant="outline" className="mt-6 w-full" asChild>
              <a href="/dashboard">Get Started</a>
            </Button>
          </CardContent>
        </Card>

        {/* Pro */}
        <Card className="relative border-primary">
          <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Popular</Badge>
          <CardHeader>
            <CardTitle>{pricing.pro.name}</CardTitle>
            <p className="text-3xl font-bold">{pricing.pro.price}</p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {pricing.pro.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              className="mt-6 w-full"
              onClick={canCheckout ? handleCheckout : undefined}
              disabled={!canCheckout}
            >
              {canCheckout ? "Upgrade to Pro" : "Coming Soon"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
