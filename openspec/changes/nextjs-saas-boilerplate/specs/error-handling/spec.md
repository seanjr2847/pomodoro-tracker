## ADDED Requirements

### Requirement: Global error boundary
The system SHALL provide `app/error.tsx` as a global error boundary with a user-friendly error message and retry button.

#### Scenario: Runtime error on any page
- **WHEN** a runtime error occurs on any page
- **THEN** the global error boundary SHALL render with an error message and a retry button

### Requirement: Global not-found page
The system SHALL provide `app/not-found.tsx` as a global 404 page.

#### Scenario: Invalid URL
- **WHEN** a user navigates to a non-existent route
- **THEN** the 404 page SHALL render with a message and link to home

### Requirement: Global loading state
The system SHALL provide `app/loading.tsx` as a global loading indicator for server component transitions.

#### Scenario: Page transition loading
- **WHEN** a server component is loading
- **THEN** the global loading indicator SHALL display

### Requirement: Dashboard-specific error states
The dashboard SHALL have its own `loading.tsx`, `error.tsx`, and `not-found.tsx` that maintain the sidebar layout.

#### Scenario: Dashboard error
- **WHEN** a runtime error occurs in a dashboard page
- **THEN** the dashboard error boundary SHALL render within the sidebar layout with a retry button

#### Scenario: Dashboard loading
- **WHEN** a dashboard page is loading
- **THEN** a skeleton UI SHALL display within the sidebar layout

#### Scenario: Dashboard 404
- **WHEN** a user navigates to a non-existent dashboard route
- **THEN** a 404 page SHALL render within the sidebar layout
