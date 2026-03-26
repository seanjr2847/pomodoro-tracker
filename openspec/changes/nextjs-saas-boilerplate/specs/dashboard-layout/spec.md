## ADDED Requirements

### Requirement: Authentication guard
The dashboard layout SHALL check user session and redirect unauthenticated users to the landing page.

#### Scenario: Authenticated access
- **WHEN** a logged-in user navigates to `/dashboard`
- **THEN** the dashboard layout SHALL render with sidebar and topbar

#### Scenario: Unauthenticated access
- **WHEN** an unauthenticated user navigates to `/dashboard`
- **THEN** the system SHALL redirect to `/`

### Requirement: Sidebar navigation
The dashboard SHALL include a collapsible sidebar with default menu items: Home and Settings. It SHALL support additional menu items definable via siteConfig.

#### Scenario: Desktop sidebar
- **WHEN** viewport is desktop-sized
- **THEN** sidebar SHALL be visible and collapsible

#### Scenario: Mobile sidebar
- **WHEN** viewport is mobile-sized
- **THEN** sidebar SHALL render as an overlay triggered by a menu button

### Requirement: Topbar
The topbar SHALL display the app name/logo (left) and user menu with avatar dropdown (right) containing profile, settings, and logout options.

#### Scenario: User menu interaction
- **WHEN** user clicks their avatar in the topbar
- **THEN** a dropdown menu SHALL appear with profile info, settings link, and logout button

### Requirement: Empty state UI
The dashboard home page SHALL include an empty state template with icon, message, and CTA button when no data is present.

#### Scenario: Empty dashboard
- **WHEN** the dashboard has no data to display
- **THEN** an empty state UI SHALL render with customizable icon, message, and CTA

### Requirement: Settings page
The Settings page at `/dashboard/settings` SHALL display user profile info (name, email, avatar from Auth.js session), subscription status (when Billing is active), and account deletion request option.

#### Scenario: Settings with billing active
- **WHEN** user visits Settings and Billing feature is active
- **THEN** subscription status (plan, renewal date) SHALL be displayed

#### Scenario: Settings with billing inactive
- **WHEN** user visits Settings and Billing feature is inactive
- **THEN** subscription section SHALL be hidden

### Requirement: Catch-all route for extensibility
The dashboard SHALL include a `[...slug]` catch-all route for project-specific page extensions.

#### Scenario: Custom dashboard page
- **WHEN** a developer adds content for `/dashboard/custom-page`
- **THEN** it SHALL render within the dashboard layout with sidebar and topbar
