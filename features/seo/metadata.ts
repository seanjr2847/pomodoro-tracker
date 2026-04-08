import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export function generateSiteMetadata(): Metadata {
  return {
    title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: "/",
      languages: {
        "x-default": siteConfig.url,
        en: siteConfig.url,
      },
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteConfig.url,
      title: siteConfig.name,
      description: siteConfig.description,
      siteName: siteConfig.name,
      images: [
        {
          url: `${siteConfig.url}/api/og`,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.name,
      description: siteConfig.description,
      images: [`${siteConfig.url}/api/og`],
      creator: siteConfig.social?.twitter
        ? `@${siteConfig.social.twitter.split("/").pop()}`
        : undefined,
    },
    robots: {
      index: true,
      follow: true,
    },
    other: {
      "theme-color": siteConfig.theme.primary,
    },
  };
}
