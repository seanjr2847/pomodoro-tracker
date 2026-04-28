import { siteConfig } from "@/config/site";

export function LogoCloud() {
  const { logos } = siteConfig;

  if (logos.length === 0) return null;

  return (
    <section className="mx-auto max-w-screen-lg px-3 py-16 lg:px-4 xl:px-0">
      <p className="text-center text-sm font-medium text-neutral-500 dark:text-neutral-400">
        Trusted by leading companies
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-8 sm:gap-12">
        {logos.map((logo) => {
          const img = (
            <img
              src={logo.src}
              alt={logo.alt}
              className="h-8 grayscale transition-all duration-200 hover:grayscale-0 sm:h-10"
            />
          );
          return logo.href ? (
            <a key={logo.alt} href={logo.href} target="_blank" rel="noopener noreferrer">
              {img}
            </a>
          ) : (
            <div key={logo.alt}>{img}</div>
          );
        })}
      </div>
    </section>
  );
}
