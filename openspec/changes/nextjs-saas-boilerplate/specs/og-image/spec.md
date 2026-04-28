## ADDED Requirements

### Requirement: Dynamic OG image endpoint
The system SHALL provide a GET endpoint at `/api/og` that generates 1200x630px OG images using `@vercel/og`.

#### Scenario: Default OG image
- **WHEN** `/api/og` is called without query parameters
- **THEN** the image SHALL display `siteConfig.name`, `siteConfig.description`, and `siteConfig.url` on a gradient background based on `siteConfig.theme.gradient`

#### Scenario: Custom title and description
- **WHEN** `/api/og?title=Custom&description=Text` is called
- **THEN** the image SHALL use the provided title and description instead of siteConfig defaults

### Requirement: Layout metadata integration
The OG image endpoint SHALL be automatically referenced in `app/layout.tsx` metadata via `openGraph.images`.

#### Scenario: Page metadata includes OG image
- **WHEN** any page is rendered
- **THEN** the HTML meta tags SHALL include `og:image` pointing to `/api/og`
