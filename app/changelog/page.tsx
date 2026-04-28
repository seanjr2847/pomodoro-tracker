import type { Metadata } from "next";
import { Navbar, Footer } from "@/features/landing";
import { getAllChangelogs } from "@/features/changelog";

export const metadata: Metadata = {
  title: "Changelog",
  description: "What's new and improved.",
};

export default function ChangelogPage() {
  const entries = getAllChangelogs();

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-screen-lg px-3 py-16 lg:px-4 xl:px-0">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Changelog
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          What&apos;s new and improved.
        </p>

        <div className="mt-12 space-y-12">
          {entries.length === 0 ? (
            <p className="text-muted-foreground">No changelog entries yet.</p>
          ) : (
            entries.map((entry) => (
              <article key={entry.slug} className="relative pl-8 before:absolute before:left-0 before:top-2 before:h-2 before:w-2 before:rounded-full before:bg-neutral-900 dark:before:bg-white">
                <div className="flex items-baseline gap-3">
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium dark:bg-white/10">
                    v{entry.version}
                  </span>
                  <time className="text-sm text-muted-foreground">
                    {new Date(entry.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
                <h2 className="mt-2 text-xl font-semibold">{entry.title}</h2>
                {entry.description && (
                  <p className="mt-1 text-muted-foreground">{entry.description}</p>
                )}
              </article>
            ))
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
