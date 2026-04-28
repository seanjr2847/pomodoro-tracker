import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Button } from "@/shared/ui";
import { LucideIconByName } from "@/shared/ui/lucide-icon";
import { AnimateOnScroll } from "@/shared/ui/animate-on-scroll";

export function Integration() {
  if (!siteConfig.integrations) return null;

  const { title, description, cta, items } = siteConfig.integrations;

  return (
    <section className="mx-auto max-w-screen-lg px-3 py-20 lg:px-4 xl:px-0">
      <AnimateOnScroll animation="slide-up-fade">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-sans text-3xl font-medium tracking-tight text-neutral-900 sm:text-4xl dark:text-white">{title}</h2>
          <p className="mt-4 text-lg text-neutral-700 dark:text-neutral-300">{description}</p>
        </div>
      </AnimateOnScroll>
      <div className="mt-12 grid grid-cols-3 gap-6 sm:grid-cols-4 md:grid-cols-6">
        {items.map((item, i) => (
          <AnimateOnScroll key={item.name} animation="scale-fade" delay={i * 60}>
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 rounded-lg border p-4 transition-all duration-200 hover:scale-105 hover:shadow-md hover:bg-neutral-50 dark:hover:bg-white/10 dark:hover:border-white/20"
            >
              <LucideIconByName name={item.icon} className="h-6 w-6 text-[var(--site-primary)] dark:text-[var(--site-primary-dark)]" />
              <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">{item.name}</span>
            </a>
          </AnimateOnScroll>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Button asChild variant="outline">
          <Link href={cta.href}>{cta.text}</Link>
        </Button>
      </div>
    </section>
  );
}
