import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/features/landing";
import { Footer } from "@/features/landing";
import { BlogList, getAllPosts, getAllTags, getPostsByTag } from "@/features/blog";
import { cn } from "@/shared/utils/cn";

export const metadata: Metadata = {
  title: "Blog",
  description: "Latest articles, tutorials, and updates.",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;
  const posts = tag ? getPostsByTag(tag) : getAllPosts();
  const allTags = getAllTags();

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-screen-lg px-3 py-16 lg:px-4 xl:px-0">
        <h1 className="font-sans text-3xl font-medium tracking-tight text-neutral-900 dark:text-white">
          Blog
        </h1>
        <p className="mt-2 text-neutral-500 dark:text-neutral-400">
          Latest articles, tutorials, and updates.
        </p>

        {allTags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href="/blog"
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                !tag
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-black"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-white/10 dark:text-neutral-400 dark:hover:bg-white/20"
              )}
            >
              All
            </Link>
            {allTags.map((t) => (
              <Link
                key={t}
                href={`/blog?tag=${encodeURIComponent(t)}`}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  tag === t
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-black"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-white/10 dark:text-neutral-400 dark:hover:bg-white/20"
                )}
              >
                {t}
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10">
          <BlogList posts={posts} />
        </div>
      </main>
      <Footer />
    </>
  );
}
