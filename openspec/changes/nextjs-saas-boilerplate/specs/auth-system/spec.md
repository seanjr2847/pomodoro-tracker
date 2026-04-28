## ADDED Requirements

### Requirement: Google OAuth authentication
The system SHALL implement Google OAuth as the sole authentication provider using Auth.js (NextAuth).

#### Scenario: Sign in flow
- **WHEN** user clicks "Google로 로그인"
- **THEN** the system SHALL redirect to Google OAuth consent screen, handle callback at `/api/auth/callback/google`, create Auth.js session with JWT strategy, persist user to Neon DB via Prisma Adapter, and redirect to dashboard

#### Scenario: Sign out flow
- **WHEN** user clicks sign out
- **THEN** the system SHALL destroy the session and redirect to the landing page

### Requirement: JWT session strategy
The system SHALL use JWT-based session strategy to avoid database lookups on every request.

#### Scenario: Session access in server component
- **WHEN** a server component calls `auth()`
- **THEN** it SHALL receive the decoded JWT session without a database query

### Requirement: User data persistence
The system SHALL persist user data (email, name, profile photo) to the database using Prisma Adapter with Auth.js default tables (users, accounts, sessions, verification_tokens).

#### Scenario: First-time login
- **WHEN** a new user signs in via Google OAuth
- **THEN** a new user record SHALL be created in the database with Google profile data

#### Scenario: Returning user login
- **WHEN** an existing user signs in
- **THEN** the existing user record SHALL be used without creating a duplicate

### Requirement: Route protection
Unauthenticated users SHALL be redirected to the landing page when accessing protected routes.

#### Scenario: Unauthenticated dashboard access
- **WHEN** an unauthenticated user navigates to `/dashboard`
- **THEN** the system SHALL redirect to `/`

### Requirement: Auth UI components
The system SHALL provide SignInButton, SignOutButton, and UserMenu components.

#### Scenario: UserMenu display
- **WHEN** a logged-in user views the dashboard
- **THEN** UserMenu SHALL display the user's avatar with a dropdown containing profile, settings, and logout options
