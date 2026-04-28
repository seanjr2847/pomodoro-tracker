## ADDED Requirements

### Requirement: shadcn/ui based component library
The `shared/ui/` directory SHALL provide common UI components based on shadcn/ui: Button, Card, Input, Badge, and additional primitives as needed.

#### Scenario: Component import
- **WHEN** a feature needs a common UI component
- **THEN** it SHALL import from `@/shared/ui` via the barrel export (`index.ts`)

### Requirement: cn() utility
The `shared/utils/cn.ts` SHALL export a `cn()` function combining `clsx` and `tailwind-merge` for conditional class composition.

#### Scenario: Class merging
- **WHEN** `cn("px-4 py-2", "px-6")` is called
- **THEN** it SHALL return `"px-6 py-2"` (tailwind-merge resolves conflicts)

### Requirement: No feature dependencies
The `shared/` directory SHALL NOT import from any `features/` directory. It SHALL be a pure utility and UI layer with no business logic.

#### Scenario: Import validation
- **WHEN** code in `shared/` attempts to import from `features/`
- **THEN** it SHALL be considered a violation of the architecture rules

### Requirement: Common hooks
The `shared/hooks/` directory SHALL provide `useMediaQuery` and `useDarkMode` hooks for responsive and theme-aware behavior.

#### Scenario: useMediaQuery usage
- **WHEN** a component needs to check viewport size
- **THEN** it SHALL use `useMediaQuery` from `@/shared/hooks`
