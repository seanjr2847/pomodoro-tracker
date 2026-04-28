"use client";

import { cn } from "@/shared/utils/cn";

interface Heading {
  level: number;
  text: string;
  id: string;
}

export function TableOfContents({ headings }: { headings: Heading[] }) {
  if (headings.length === 0) return null;

  return (
    <nav className="space-y-1">
      <p className="text-sm font-semibold mb-3">On this page</p>
      {headings.map((heading) => (
        <a
          key={heading.id}
          href={`#${heading.id}`}
          className={cn(
            "block text-sm text-muted-foreground transition-colors hover:text-foreground",
            heading.level === 3 && "pl-4"
          )}
        >
          {heading.text}
        </a>
      ))}
    </nav>
  );
}
