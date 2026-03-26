import Link from "next/link";
import { Card, CardContent } from "@/shared/ui";
import type { Post } from "../types";

export function BlogCard({ post }: { post: Post }) {
  const { frontmatter, slug } = post;

  return (
    <Link href={`/blog/${slug}`}>
      <Card className="h-full overflow-hidden border-neutral-200 bg-white transition-shadow hover:shadow-md dark:border-white/10 dark:bg-neutral-900">
        {frontmatter.image && (
          <div className="aspect-video overflow-hidden">
            <img
              src={frontmatter.image}
              alt={frontmatter.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <CardContent className="p-5">
          <div className="flex flex-wrap gap-2">
            {frontmatter.tags.map((tag) => (
              <span
                key={tag}
                className="mr-1 inline-block rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600 last:mr-0 dark:bg-white/10 dark:text-neutral-400"
              >
                {tag}
              </span>
            ))}
          </div>
          <h3 className="mt-3 font-medium leading-snug text-neutral-900 dark:text-white">
            {frontmatter.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-neutral-500 dark:text-neutral-400">
            {frontmatter.description}
          </p>
          <p className="mt-3 text-xs text-neutral-400 dark:text-neutral-500">
            {new Date(frontmatter.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
