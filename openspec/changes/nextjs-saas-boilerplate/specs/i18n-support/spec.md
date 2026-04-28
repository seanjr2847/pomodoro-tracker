## ADDED Requirements

### Requirement: next-intl integration
The system SHALL use `next-intl` for internationalization, integrated with Next.js App Router server components.

#### Scenario: Translation in server component
- **WHEN** a server component needs translated text
- **THEN** it SHALL use `next-intl` server-side API to access translations

#### Scenario: Translation in client component
- **WHEN** a client component needs translated text
- **THEN** it SHALL use `useTranslations` hook from `next-intl`

### Requirement: Selective i18n scope
i18n SHALL apply only to Dashboard UI, Auth UI, and error/empty state messages. Landing page and Legal documents SHALL NOT use i18n (landing uses siteConfig, legal is English-fixed).

#### Scenario: Dashboard text
- **WHEN** dashboard UI renders buttons, labels, or messages
- **THEN** all user-facing text SHALL come from translation files, not hardcoded

#### Scenario: Landing page text
- **WHEN** landing page renders
- **THEN** text SHALL come from `siteConfig`, not from i18n translation files

### Requirement: Default English locale
The boilerplate SHALL include `messages/en.json` as the default and only translation file. Additional languages are added per-project.

#### Scenario: Default locale
- **WHEN** the app starts without locale configuration changes
- **THEN** English (`en`) SHALL be the default locale

### Requirement: No-refactor extensibility
The i18n structure SHALL allow adding new languages by only adding new JSON files in `messages/` without refactoring existing code.

#### Scenario: Adding Korean
- **WHEN** a developer adds `messages/ko.json` and updates locale config
- **THEN** Korean translations SHALL work without modifying any component code
