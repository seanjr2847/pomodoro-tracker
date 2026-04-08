import { siteConfig } from "@/config/site";

export interface ArticleJsonLdProps {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  image?: string;
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/icons/icon-512x512.png`,
    description: siteConfig.description,
    email: siteConfig.email,
    ...(siteConfig.social
      ? {
          sameAs: [siteConfig.social.twitter, siteConfig.social.github].filter(
            Boolean,
          ),
        }
      : {}),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
  };
}

export function articleJsonLd(props: ArticleJsonLdProps) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: props.title,
    description: props.description,
    url: props.url,
    datePublished: props.datePublished,
    dateModified: props.dateModified ?? props.datePublished,
    author: {
      "@type": "Person",
      name: props.authorName ?? siteConfig.creator,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/icons/icon-512x512.png`,
      },
    },
    ...(props.image ? { image: props.image } : {}),
  };
}

export function productJsonLd(overrides?: {
  name?: string;
  description?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: overrides?.name ?? siteConfig.name,
    description: overrides?.description ?? siteConfig.description,
    brand: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: "0",
      offerCount: "2",
    },
  };
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  const safeJson = JSON.stringify(data).replace(/<\/script>/gi, "<\\/script>");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson }}
    />
  );
}
