import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Button } from "@/shared/ui";
import { GridPattern } from "@/shared/ui/grid-pattern";

export function Hero() {
  const { hero } = siteConfig;

  return (
    <section className="mx-auto mt-4 max-w-screen-lg px-3 lg:px-4 xl:px-0">
      <div className="relative overflow-hidden rounded-2xl bg-neutral-50 dark:bg-neutral-900">
        {/* Grid background — dub.co pattern with radial fade */}
        <GridPattern
          cellSize={80}
          className="text-neutral-200 [mask-image:radial-gradient(ellipse_80%_60%_at_50%_60%,black_40%,transparent)] dark:text-neutral-700"
        />

        {/* Gradient blobs — dub.co style */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40 blur-[100px] dark:opacity-25"
          style={{
            background: `
              radial-gradient(77% 116% at 37% 67%, #EEA5BA, rgba(238,165,186,0) 50%),
              radial-gradient(56% 84% at 34% 56%, #3A8BFD, rgba(58,139,253,0) 50%),
              radial-gradient(85% 127% at 100% 100%, #E4C795, rgba(228,199,149,0) 50%),
              radial-gradient(82% 122% at 3% 29%, #855AFC, rgba(133,90,252,0) 50%),
              radial-gradient(90% 136% at 52% 100%, #FD3A4E, rgba(253,58,78,0) 50%),
              radial-gradient(102% 143% at 92% 7%, #72FE7D, rgba(114,254,125,0) 50%)
            `,
          }}
        />

        <div className="relative z-10 flex flex-col items-center p-6 sm:p-20 sm:px-0">
          <div className="max-w-xl text-center">
            {/* Title with slide-up animation */}
            <h1 className="animate-slide-up-fade font-sans text-4xl font-medium tracking-tight text-neutral-900 [--offset:20px] [animation-duration:1s] [animation-fill-mode:both] sm:text-5xl sm:leading-[1.15] dark:text-white">
              {hero.title.split("\n").map((line, i) => (
                <span key={i}>
                  {i > 0 && <br />}
                  {line}
                </span>
              ))}
            </h1>

            {/* Subtitle */}
            <p className="animate-slide-up-fade mt-5 text-base text-neutral-700 [--offset:10px] [animation-delay:200ms] [animation-duration:1s] [animation-fill-mode:both] sm:text-xl dark:text-neutral-300">
              {hero.subtitle}
            </p>

            {/* CTA buttons */}
            <div className="animate-slide-up-fade mt-8 flex flex-col items-center justify-center gap-4 [--offset:5px] [animation-delay:300ms] [animation-duration:1s] [animation-fill-mode:both] sm:flex-row">
              <Button
                asChild
                className="h-10 rounded-lg border border-black bg-black px-5 text-base text-white hover:ring-4 hover:ring-neutral-200 dark:border-white dark:bg-white dark:text-black dark:hover:ring-white/10"
              >
                <Link href={hero.cta.primary.href}>{hero.cta.primary.text}</Link>
              </Button>
              {hero.cta.secondary && (
                <Button
                  asChild
                  variant="outline"
                  className="h-10 rounded-lg border border-neutral-300 bg-white px-5 text-base text-neutral-900 hover:bg-neutral-50 dark:border-white/20 dark:bg-transparent dark:text-white dark:hover:bg-white/10"
                >
                  <Link href={hero.cta.secondary.href}>
                    {hero.cta.secondary.text}
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
