## ADDED Requirements

### Requirement: Prisma Client singleton
The system SHALL provide a single Prisma Client instance via `features/database/client.ts` using the `globalThis` pattern to prevent multiple instances in development.

#### Scenario: Client reuse in development
- **WHEN** hot module replacement triggers in development
- **THEN** the existing Prisma Client instance SHALL be reused from `globalThis`

#### Scenario: Client creation in production
- **WHEN** the app starts in production
- **THEN** a new Prisma Client instance SHALL be created and connected to Neon via `DATABASE_URL`

### Requirement: Schema location
The Prisma schema SHALL reside at `prisma/schema.prisma` (project root) following Prisma conventions. `features/database/` SHALL NOT own the schema file.

#### Scenario: Schema discovery
- **WHEN** Prisma CLI commands are executed
- **THEN** they SHALL find the schema at the default `prisma/schema.prisma` location

### Requirement: Auth.js default tables
The Prisma schema SHALL include the 4 Auth.js required tables: users, accounts, sessions, verification_tokens.

#### Scenario: Auth.js migration
- **WHEN** `pnpm db:migrate` is run
- **THEN** the database SHALL contain all 4 Auth.js tables with correct columns

### Requirement: npm scripts for database operations
The system SHALL provide pnpm scripts: `db:generate` (Prisma Client generation), `db:migrate` (migration application), `db:studio` (Prisma Studio).

#### Scenario: Running db:generate
- **WHEN** `pnpm db:generate` is executed
- **THEN** Prisma Client SHALL be regenerated with current schema types
