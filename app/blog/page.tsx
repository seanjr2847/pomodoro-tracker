import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Navbar, Footer } from "@/features/landing";
import { BlogList, getAllPosts, getPostsByTag, getAllTags } from "@/features/blog";

interface BlogPageProps {
  searchParams: Promise<{ tag?: string }>;
}

export const metadata: Metadata = {
  title: "Blog",
  description: `Articles and updates from ${siteConfig.name}`,
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { tag } = await searchParams;
  const tags = getAllTags();
  const posts = tag ? getPostsByTag(tag) : getAllPosts();

  return (
    <div className="min-h-screen bg-neutral-50/80 dark:bg-black">
      <Navbar />

      <main className="mx-auto max-w-screen-lg px-3 py-16 lg:px-4 xl:px-0">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-sans text-4xl font-medium tracking-tight text-neutral-900 sm:text-5xl dark:text-white">
            Blog
          </h1>
          <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
            Thoughts, updates, and deep dives from the team.
          </p>
        </div>

        {tags.length > 0 && (
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            <Link
              href="/blog"
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                !tag
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
              }`}
            >
              All
            </Link>
            {tags.map((t) => (
              <Link
                key={t}
                href={`/blog?tag=${encodeURIComponent(t)}`}
                className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
                  tag === t
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                }`}
              >
                {t}
              </Link>
            ))}
          </div>
        )}

        <div className="mt-12">
          <BlogList posts={posts} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
