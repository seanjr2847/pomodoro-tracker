import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button, Separator } from "@/shared/ui";
import { TableOfContents } from "./TableOfContents";
import type { Post } from "../types";

interface BlogPostProps {
  post: Post;
  headings: { level: number; text: string; id: string }[];
  prev: Post | null;
  next: Post | null;
  children: React.ReactNode;
}

export function BlogPost({ post, headings, prev, next, children }: BlogPostProps) {
  const { frontmatter } = post;

  return (
    <div className="mx-auto max-w-screen-lg px-3 py-16 lg:px-4 xl:px-0">
      {/* Header — full width within container */}
      <div className="max-w-2xl">
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-1 text-sm text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to blog
        </Link>
        <div className="flex flex-wrap gap-2">
          {frontmatter.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600 dark:bg-white/10 dark:text-neutral-400"
            >
              {tag}
            </span>
          ))}
        </div>
        <h1 className="mt-4 font-sans text-3xl font-medium tracking-tight text-neutral-900 sm:text-4xl dark:text-white">
          {frontmatter.title}
        </h1>
        <p className="mt-4 text-lg text-neutral-700 dark:text-neutral-300">
          {frontmatter.description}
        </p>
        <p className="mt-2 text-sm text-neutral-400 dark:text-neutral-500">
          {new Date(frontmatter.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Content + TOC — side by side, left-aligned */}
      <div className="mt-12 flex gap-10">
        <article className="min-w-0 max-w-2xl flex-1 prose prose-neutral dark:prose-invert">
          {children}
        </article>
        {headings.length > 0 && (
          <aside className="hidden w-52 shrink-0 lg:block">
            <div className="sticky top-24">
              <TableOfContents headings={headings} />
            </div>
          </aside>
        )}
      </div>

      {/* Previous / Next */}
      <Separator className="mt-16 max-w-2xl" />
      <div className="mt-8 flex max-w-2xl justify-between">
        {prev ? (
          <Button asChild variant="ghost" className="text-neutral-700 dark:text-neutral-300">
            <Link href={`/blog/${prev.slug}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {prev.frontmatter.title}
            </Link>
          </Button>
        ) : (
          <div />
        )}
        {next ? (
          <Button asChild variant="ghost" className="text-neutral-700 dark:text-neutral-300">
            <Link href={`/blog/${next.slug}`}>
              {next.frontmatter.title}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
