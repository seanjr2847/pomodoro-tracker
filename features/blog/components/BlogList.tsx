import { BlogCard } from "./BlogCard";
import type { Post } from "../types";

export function BlogList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-12">
        No posts yet. Check back soon!
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <BlogCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
