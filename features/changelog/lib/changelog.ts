import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CHANGELOG_DIR = path.join(process.cwd(), "content", "changelog");

export interface ChangelogEntry {
  slug: string;
  title: string;
  date: string;
  version: string;
  description: string;
  content: string;
}

export function getChangelogEntry(slug: string): ChangelogEntry | null {
  const filePath = path.join(CHANGELOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title,
    date: data.date,
    version: data.version,
    description: data.description ?? "",
    content,
  };
}

export function getAllChangelogs(): ChangelogEntry[] {
  if (!fs.existsSync(CHANGELOG_DIR)) return [];

  return fs
    .readdirSync(CHANGELOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => getChangelogEntry(f.replace(/\.mdx$/, "")))
    .filter((e): e is ChangelogEntry => e !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
