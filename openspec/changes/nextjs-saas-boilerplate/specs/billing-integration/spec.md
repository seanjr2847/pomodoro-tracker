## ADDED Requirements

### Requirement: Environment-based feature toggle
The Billing feature SHALL activate only when `PADDLE_API_KEY` environment variable is present. When absent, the entire feature SHALL be disabled.

#### Scenario: Billing active
- **WHEN** `PADDLE_API_KEY` is set
- **THEN** Paddle.js SHALL load, checkout overlay SHALL be available, and webhook endpoint SHALL process events

#### Scenario: Billing inactive
- **WHEN** `PADDLE_API_KEY` is not set
- **THEN** Pricing card Pro button SHALL display "Coming Soon" instead of checkout functionality

### Requirement: Slot-based integration pattern
The billing components SHALL be injected into the landing page via the app/ layer slot pattern. The landing feature SHALL NOT directly import billing.

#### Scenario: App layer composition
- **WHEN** `app/page.tsx` renders the landing page
- **THEN** it SHALL check `PADDLE_API_KEY` and inject either `PricingCard` or `PricingPlaceholder` as a slot prop to `LandingPage`

### Requirement: Webhook security
The Paddle webhook handler SHALL verify the `Paddle-Signature` header using `PADDLE_WEBHOOK_SECRET` with HMAC-SHA256 via Paddle SDK's built-in verification.

#### Scenario: Valid webhook signature
- **WHEN** a webhook arrives with valid `Paddle-Signature`
- **THEN** the handler SHALL process the event and return 200

#### Scenario: Invalid webhook signature
- **WHEN** a webhook arrives with invalid or missing `Paddle-Signature`
- **THEN** the handler SHALL return 401 Unauthorized and stop processing

### Requirement: Subscription state management
The system SHALL track subscription status per user in the database and provide a `useSubscription` hook for client-side access.

#### Scenario: Subscription status display
- **WHEN** a subscribed user visits Settings
- **THEN** the subscription status (plan name, renewal date) SHALL be displayed
