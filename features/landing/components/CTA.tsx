import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Button } from "@/shared/ui";
import { AnimateOnScroll } from "@/shared/ui/animate-on-scroll";
import { GridPattern } from "@/shared/ui/grid-pattern";

export function CTA() {
  const { cta } = siteConfig;

  return (
    <section className="mx-auto mt-20 max-w-screen-lg px-3 lg:px-4 xl:px-0">
      <AnimateOnScroll animation="scale-fade">
      <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-white/10 dark:bg-neutral-900">
        {/* Grid background with radial fade from top */}
        <GridPattern
          cellSize={80}
          className="text-neutral-100 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black_30%,transparent)] dark:text-neutral-800"
        />

        {/* Conic gradient — spec.md colors */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08] blur-[130px]"
          style={{
            background:
              "conic-gradient(from -66deg, #E84A5F -32deg, #F06477 63deg, #7BC8A4 158deg, #E84A5F 240deg, #F06477 328deg, #7BC8A4 423deg)",
          }}
        />

        <div className="relative z-10 px-6 pb-16 pt-10 text-center sm:px-12">
          <h2 className="mx-auto max-w-xl font-sans text-4xl font-medium tracking-tight text-neutral-900 sm:text-[2.5rem] sm:leading-[1.15] dark:text-white">
            {cta.title}
          </h2>
          {cta.subtitle && (
            <p className="mx-auto mt-5 max-w-xl text-base text-neutral-700 sm:text-xl dark:text-neutral-300">
              {cta.subtitle}
            </p>
          )}
          <div className="mt-10 flex items-center justify-center space-x-4">
            <Button
              asChild
              className="btn-brand h-10 rounded-lg px-5 text-base transition-all hover:ring-4 hover:ring-[color-mix(in_oklab,var(--site-primary)_25%,transparent)] active:scale-95"
            >
              <Link href={cta.button.href}>{cta.button.text}</Link>
            </Button>
          </div>
        </div>
      </div>
      </AnimateOnScroll>
    </section>
  );
}
