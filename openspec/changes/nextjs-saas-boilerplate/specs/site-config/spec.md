## ADDED Requirements

### Requirement: Central configuration object
The system SHALL provide a single TypeScript configuration object (`siteConfig`) in `config/site.ts` that defines all app-level settings including name, description, url, creator, email, theme, banner, hero, featureTabs, logos, value, sections, testimonials, integrations, cta, pricing, legal, and social.

#### Scenario: All components read from siteConfig
- **WHEN** any component needs display text, branding, or content
- **THEN** it SHALL read from `siteConfig` and MUST NOT hardcode any text

#### Scenario: TypeScript interface validation
- **WHEN** `config/site.ts` is edited with invalid data
- **THEN** TypeScript SHALL report type errors at build time

### Requirement: Theme CSS variable generation
The system SHALL generate CSS custom properties from `siteConfig.theme` at build time via `tailwind.config.ts`.

#### Scenario: Light mode primary color
- **WHEN** the app renders in light mode
- **THEN** `--color-primary` SHALL equal `siteConfig.theme.primary`

#### Scenario: Dark mode with explicit primaryDark
- **WHEN** `siteConfig.theme.primaryDark` is provided
- **THEN** `.dark` class SHALL set `--color-primary` to that value

#### Scenario: Dark mode with auto-calculated color
- **WHEN** `siteConfig.theme.primaryDark` is not provided
- **THEN** the system SHALL convert `siteConfig.theme.primary` to HSL, add +20% lightness, and use the result as the dark mode primary color

### Requirement: Nullable sections
Optional configuration fields (banner, value, integrations, social) SHALL be nullable. Components MUST check for null and skip rendering when null.

#### Scenario: Banner is null
- **WHEN** `siteConfig.banner` is `null`
- **THEN** the Banner component SHALL not render

#### Scenario: Social links are null
- **WHEN** `siteConfig.social` is `null`
- **THEN** the Footer SHALL omit the social links column
