import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Button } from "@/shared/ui";

export function Integration() {
  if (!siteConfig.integrations) return null;

  const { title, description, cta, items } = siteConfig.integrations;

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
        <p className="mt-4 text-lg text-muted-foreground">{description}</p>
      </div>
      <div className="mt-12 grid grid-cols-3 gap-6 sm:grid-cols-4 md:grid-cols-6">
        {items.map((item) => (
          <a
            key={item.name}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors hover:bg-muted"
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-xs font-medium text-muted-foreground">{item.name}</span>
          </a>
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
