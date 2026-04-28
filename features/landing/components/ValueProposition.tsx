import { siteConfig } from "@/config/site";
import { AnimateOnScroll } from "@/shared/ui/animate-on-scroll";

export function ValueProposition() {
  if (!siteConfig.value) return null;

  const { title, description, highlights } = siteConfig.value;

  return (
    <section className="mx-auto max-w-screen-lg px-3 py-20 text-center lg:px-4 xl:px-0">
      <AnimateOnScroll animation="slide-up-fade">
        <h2 className="font-sans text-3xl font-medium tracking-tight text-neutral-900 sm:text-4xl dark:text-white">
          {title}
        </h2>
      </AnimateOnScroll>
      <AnimateOnScroll animation="slide-up-fade" delay={100}>
        <p className="mx-auto mt-4 max-w-xl text-lg text-neutral-700 dark:text-neutral-300">
          {description}
        </p>
      </AnimateOnScroll>
      {highlights.length > 0 && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {highlights.map((h, i) => (
            <AnimateOnScroll key={h} animation="scale-fade" delay={200 + i * 100}>
              <span className="badge-brand rounded-full px-4 py-2 text-sm font-medium">
                {h}
              </span>
            </AnimateOnScroll>
          ))}
        </div>
      )}
    </section>
  );
}
