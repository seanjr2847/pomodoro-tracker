export interface Frontmatter {
  title: string;
  description: string;
  date: string;
  tags: string[];
  image?: string;
  published: boolean;
}

export interface Post {
  slug: string;
  frontmatter: Frontmatter;
  content: string;
}
