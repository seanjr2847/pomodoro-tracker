import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import { siteConfig } from "@/config/site";
import { Navbar, Footer } from "@/features/landing";
import { JsonLd, articleJsonLd } from "@/features/seo";
import {
  BlogPost,
  getPostBySlug,
  extractHeadings,
  getAllPosts,
  getAdjacentPosts,
  mdxComponents,
} from "@/features/blog";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const ogImage = post.frontmatter.image
    ? post.frontmatter.image
    : `${siteConfig.url}/api/og?title=${encodeURIComponent(post.frontmatter.title)}`;

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      type: "article",
      publishedTime: post.frontmatter.date,
      images: [{ url: ogImage }],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const headings = extractHeadings(post.content);
  const { prev, next } = getAdjacentPosts(slug);

  const ogImage = post.frontmatter.image
    ? post.frontmatter.image
    : `${siteConfig.url}/api/og?title=${encodeURIComponent(post.frontmatter.title)}`;

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          title: post.frontmatter.title,
          description: post.frontmatter.description,
          url: `${siteConfig.url}/blog/${slug}`,
          datePublished: post.frontmatter.date,
          image: ogImage,
        })}
      />
      <Navbar />
      <BlogPost post={post} headings={headings} prev={prev} next={next}>
        <MDXRemote
          source={post.content}
          components={mdxComponents}
          options={{
            mdxOptions: {
              rehypePlugins: [[rehypePrettyCode, { theme: "github-dark-default" }]],
            },
          }}
        />
      </BlogPost>
      <Footer />
    </>
  );
}
