import Link from "next/link";
import { Button, Card, CardContent } from "@/shared/ui";
import { AnimateOnScroll } from "@/shared/ui/animate-on-scroll";
import { LucideIconByName } from "@/shared/ui/lucide-icon";
import type { SiteConfig } from "@/config/site";

type Section = SiteConfig["sections"][number];

const cardGradients = [
  "conic-gradient(from 270deg, #F4950C, #EB5C0C, transparent, transparent)",
  "conic-gradient(from 270deg, #3A8BFD, #855AFC, transparent, transparent)",
  "conic-gradient(from 270deg, #5CFF80, #0EA5E9, transparent, transparent)",
];

export function FeatureSection({ section }: { section: Section }) {
  return (
    <section id="features" className="mx-auto max-w-screen-lg px-3 lg:px-4 xl:px-0">
      <AnimateOnScroll animation="slide-up-fade" className="mx-auto max-w-xl text-center">
        <span className="inline-block rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700 dark:bg-white/10 dark:text-neutral-300">
          {section.badge}
        </span>
        <h2 className="mt-4 font-sans text-3xl font-medium tracking-tight text-neutral-900 dark:text-white">
          {section.title}
        </h2>
        <p className="mt-2 text-lg text-neutral-700 dark:text-neutral-300">
          {section.description}
        </p>
      </AnimateOnScroll>

      {section.image && (
        <div className="mt-12 overflow-hidden rounded-xl border border-neutral-200 shadow-sm dark:border-white/10">
          <img src={section.image} alt={section.title} className="w-full" />
        </div>
      )}

      {section.cards.length > 0 && (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {section.cards.map((card, i) => (
            <AnimateOnScroll key={card.title} animation="slide-up-fade" delay={i * 100}>
            <Card
              className="relative overflow-hidden border-neutral-200 bg-white transition-shadow hover:shadow-md dark:border-white/10 dark:bg-neutral-900"
            >
              {/* Rotating conic gradient per card */}
              <div
                className="pointer-events-none absolute inset-0 opacity-10 blur-[50px]"
                style={{ background: cardGradients[i % cardGradients.length] }}
              />
              <CardContent className="relative z-10 px-4 py-14 sm:px-12">
                {/* BubbleIcon — 3-layer dub.co style */}
                <div className="relative mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-t from-neutral-100 to-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.04] dark:from-neutral-800 dark:to-neutral-700 dark:ring-white/[0.06]">
                  <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-white/40 to-transparent dark:from-white/[0.08]" />
                  <LucideIconByName
                    name={card.icon}
                    className="relative z-10 h-5 w-5 text-neutral-600 dark:text-neutral-300"
                  />
                </div>
                <h3 className="text-lg font-medium text-neutral-900 dark:text-white">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                  {card.description}
                </p>
                {card.href && (
                  <Button
                    asChild
                    variant="outline"
                    className="mt-6 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium leading-none dark:border-white/20 dark:bg-transparent"
                  >
                    <Link href={card.href}>Learn more</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
            </AnimateOnScroll>
          ))}
        </div>
      )}

      <div className="mt-6 text-center">
        <Button
          asChild
          variant="outline"
          className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium dark:border-white/20 dark:bg-transparent"
        >
          <Link href={section.cta.href}>{section.cta.text}</Link>
        </Button>
      </div>
    </section>
  );
}
