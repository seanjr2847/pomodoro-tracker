## ADDED Requirements

### Requirement: Privacy Policy page
The system SHALL provide a Privacy Policy page at `/privacy` with content auto-populated from `siteConfig.legal` and `siteConfig` root fields.

#### Scenario: Dynamic variable substitution
- **WHEN** the Privacy Policy page renders
- **THEN** it SHALL substitute app name, operator (companyName), email, effective date, service URL, and country from siteConfig

#### Scenario: Google OAuth data disclosure
- **WHEN** the Privacy Policy renders
- **THEN** it SHALL include sections about Google data collection (email, name, profile photo), usage purpose, third-party sharing, and data deletion requests as required for Google OAuth review

### Requirement: Terms of Service page
The system SHALL provide a Terms of Service page at `/terms` with content auto-populated from siteConfig.

#### Scenario: Dynamic variable substitution
- **WHEN** the Terms of Service page renders
- **THEN** it SHALL substitute app name, operator, email, effective date, service URL, and country from siteConfig

### Requirement: Privacy Policy required sections
The Privacy Policy SHALL include: information collected, usage purpose, third-party services (Google, Neon, Vercel, Paddle), cookie policy, data retention and deletion, data security, children's protection (under 13), policy changes, and contact information.

#### Scenario: All required sections present
- **WHEN** Privacy Policy renders
- **THEN** all 9 required sections SHALL be present in the document

### Requirement: Terms of Service required sections
The Terms of Service SHALL include: service description, usage conditions, intellectual property, payment and refund, service changes and termination, disclaimer, limitation of liability, jurisdiction, and contact information.

#### Scenario: All required sections present
- **WHEN** Terms of Service renders
- **THEN** all 9 required sections SHALL be present in the document
