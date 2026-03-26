import { Check } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";

export function PricingPlaceholder() {
  const { pricing } = siteConfig;

  return (
    <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Pricing</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Simple pricing for everyone.
        </p>
      </div>
      <div className="mt-12 grid gap-8 md:grid-cols-2">
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
            <Button variant="outline" className="mt-6 w-full">
              Get Started
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{pricing.pro.name}</CardTitle>
            <p className="text-3xl font-bold">{pricing.pro.price}</p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {pricing.pro.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-muted-foreground" />
                  {f}
                </li>
              ))}
            </ul>
            <Button variant="outline" className="mt-6 w-full" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
