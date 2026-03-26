import { siteConfig } from "@/config/site";

export function ValueProposition() {
  if (!siteConfig.value) return null;

  const { title, description, highlights } = siteConfig.value;

  return (
    <section className="mx-auto max-w-screen-lg px-3 py-20 text-center lg:px-4 xl:px-0">
      <h2 className="font-sans text-3xl font-medium tracking-tight text-neutral-900 sm:text-4xl dark:text-white">
        {title}
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-lg text-neutral-700 dark:text-neutral-300">
        {description}
      </p>
      {highlights.length > 0 && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {highlights.map((h) => (
            <span
              key={h}
              className="rounded-full bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700 dark:bg-white/10 dark:text-neutral-300"
            >
              {h}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
