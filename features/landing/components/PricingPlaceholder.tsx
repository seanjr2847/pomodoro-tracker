import { Check } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Button, Badge, Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";
import { AnimateOnScroll } from "@/shared/ui/animate-on-scroll";
import { cn } from "@/shared/utils/cn";

export function PricingPlaceholder() {
  const { plans } = siteConfig.pricing;

  const colsClass =
    plans.length === 1
      ? "max-w-sm mx-auto"
      : plans.length === 2
        ? "md:grid-cols-2"
        : plans.length === 3
          ? "md:grid-cols-3"
          : "md:grid-cols-2 lg:grid-cols-4";

  return (
    <section className="mx-auto max-w-screen-lg px-3 py-20 lg:px-4 xl:px-0">
      <AnimateOnScroll animation="slide-up-fade">
        <div className="text-center">
          <h1 className="font-sans text-3xl font-medium tracking-tight text-neutral-900 sm:text-4xl dark:text-white">요금제</h1>
          <p className="mt-4 text-lg text-neutral-700 dark:text-neutral-300">
            간편한 요금제를 확인하세요
          </p>
        </div>
      </AnimateOnScroll>
      <div className={cn("mt-12 grid gap-8", colsClass)}>
        {plans.map((plan, i) => (
          <AnimateOnScroll key={plan.id} animation="scale-fade" delay={i * 100}>
            <Card
              className={cn(
                "relative h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-lg",
                plan.highlighted && "border-[var(--site-primary)]"
              )}
            >
              {plan.highlighted && (
                <Badge className="absolute -top-3 right-4 bg-[var(--site-primary)] text-white">
                  인기
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
                      <Check className="h-4 w-4 text-[var(--site-primary)]" />
                      {f}
                    </li>
                  ))}
                </ul>
                {plan.href ? (
                  <Button variant="outline" className="mt-6 w-full" asChild>
                    <a href={plan.href}>{plan.cta}</a>
                  </Button>
                ) : (
                  <Button variant="outline" className="mt-6 w-full" disabled>
                    곧 출시
                  </Button>
                )}
              </CardContent>
            </Card>
          </AnimateOnScroll>
        ))}
      </div>
    </section>
  );
}
