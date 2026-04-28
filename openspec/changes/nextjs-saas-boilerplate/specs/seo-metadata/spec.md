## ADDED Requirements

### Requirement: Auto-generated metadata
The system SHALL auto-generate page metadata in `app/layout.tsx` from siteConfig including title, description, openGraph, and twitter card properties.

#### Scenario: Root layout metadata
- **WHEN** any page renders
- **THEN** HTML meta tags SHALL include title from `siteConfig.name`, description from `siteConfig.description`, and og:image from `/api/og`

### Requirement: Dynamic sitemap
The system SHALL generate a dynamic sitemap at `/sitemap.xml` including all static pages and all published blog posts.

#### Scenario: Sitemap generation
- **WHEN** `/sitemap.xml` is requested
- **THEN** it SHALL include URLs for `/`, `/privacy`, `/terms`, `/blog`, and all published blog post URLs

### Requirement: Robots.txt
The system SHALL generate a `robots.txt` that allows all crawlers and references the sitemap URL.

#### Scenario: Robots.txt content
- **WHEN** `/robots.txt` is requested
- **THEN** it SHALL contain `User-Agent: *`, `Allow: /`, and `Sitemap: {siteConfig.url}/sitemap.xml`

### Requirement: OG feature integration
SEO metadata SHALL reference the OG image feature for `openGraph.images` configuration.

#### Scenario: OG image URL in metadata
- **WHEN** metadata is generated for any page
- **THEN** `openGraph.images` SHALL point to `{siteConfig.url}/api/og`
