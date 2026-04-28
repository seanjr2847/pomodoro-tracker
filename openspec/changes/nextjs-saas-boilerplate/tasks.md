## 1. Project Setup & Scaffolding

- [x] 1.1 Initialize Next.js project with App Router, TypeScript, Tailwind CSS, pnpm
- [x] 1.2 Install core dependencies: shadcn/ui, next-themes, next-intl, prisma, @neondatabase/serverless, auth.js, @vercel/og
- [x] 1.3 Create feature-based directory structure: `features/`, `shared/`, `config/`, `content/`, `messages/`, `prisma/`
- [x] 1.4 Configure path aliases in `tsconfig.json` (`@/features/*`, `@/shared/*`, `@/config/*`)
- [x] 1.5 Create `.env.example` with all required and optional environment variables
- [x] 1.6 Configure pnpm scripts: dev, build, start, lint, db:generate, db:migrate, db:studio

## 2. Central Configuration (`config/site.ts`)

- [x] 2.1 Define `SiteConfig` TypeScript interface with all fields (name, description, url, theme, banner, hero, featureTabs, logos, value, sections, testimonials, integrations, cta, pricing, legal, social)
- [x] 2.2 Create default `siteConfig` export with example SaaS content
- [x] 2.3 Implement theme CSS variable generation in `tailwind.config.ts` (primary color, dark mode auto-calculation with HSL +20% lightness)
- [x] 2.4 Configure next-themes with class strategy and system preference default

## 3. Shared UI Layer (`shared/`)

- [x] 3.1 Initialize shadcn/ui and add base components: Button, Card, Input, Badge
- [x] 3.2 Create `shared/utils/cn.ts` with clsx + tailwind-merge utility
- [x] 3.3 Create `shared/hooks/useMediaQuery.ts` hook
- [x] 3.4 Create `shared/hooks/useDarkMode.ts` hook
- [x] 3.5 Create `shared/ui/index.ts` barrel export

## 4. Database Layer (`features/database/`)

- [x] 4.1 Create `prisma/schema.prisma` with Neon datasource and Auth.js default 4 tables (users, accounts, sessions, verification_tokens)
- [x] 4.2 Create `features/database/client.ts` with Prisma Client singleton (globalThis pattern)
- [x] 4.3 Create `features/database/index.ts` barrel export
- [x] 4.4 Run initial migration and verify Prisma Client generation

## 5. Auth System (`features/auth/`)

- [x] 5.1 Create `features/auth/config/auth.ts` with Auth.js configuration: Google OAuth provider, JWT session strategy, Prisma Adapter
- [x] 5.2 Create API route `app/api/auth/[...nextauth]/route.ts`
- [x] 5.3 Create `features/auth/components/SignInButton.tsx`
- [x] 5.4 Create `features/auth/components/SignOutButton.tsx`
- [x] 5.5 Create `features/auth/components/UserMenu.tsx` (avatar + dropdown: profile, settings, logout)
- [x] 5.6 Create `features/auth/hooks/useSession.ts`
- [x] 5.7 Create `features/auth/index.ts` barrel export

## 6. Landing Page (`features/landing/`)

- [x] 6.1 Create `features/landing/components/Navbar.tsx` (logo, nav links, auth buttons, scroll blur, mobile hamburger)
- [x] 6.2 Create `features/landing/components/Banner.tsx` (dismissible notice bar, null check)
- [x] 6.3 Create `features/landing/components/Hero.tsx` (centered headline, subtitle, primary + optional secondary CTA, gradient/grid background)
- [x] 6.4 Create `features/landing/components/FeatureTabs.tsx` (tab switching with slide/fade, single card fallback, empty hide)
- [x] 6.5 Create `features/landing/components/LogoCloud.tsx` (grayscale logos, hover color, empty hide)
- [x] 6.6 Create `features/landing/components/ValueProposition.tsx` (large text, keyword highlights, null hide)
- [x] 6.7 Create `features/landing/components/FeatureSection.tsx` (badge, title, description, image, 3-column cards)
- [x] 6.8 Create `features/landing/components/Testimonial.tsx` (quote, company logo, name/role/avatar)
- [x] 6.9 Create `features/landing/components/Integration.tsx` (icon grid, null hide)
- [x] 6.10 Create `features/landing/components/CTA.tsx` (gradient background, centered text + button)
- [x] 6.11 Create `features/landing/components/Footer.tsx` (4-column: Product, Company, Legal, Social + copyright)
- [x] 6.12 Create `features/landing/lib/renderSections.ts` (section-testimonial interleaving logic)
- [x] 6.13 Create `features/landing/hooks/useScrollSection.ts`
- [x] 6.14 Assemble `LandingPage` component with section rendering order and slot prop for billing
- [x] 6.15 Create `features/landing/index.ts` barrel export
- [x] 6.16 Create `app/page.tsx` thin layer (LandingPage + billing slot composition)

## 7. OG Image (`features/og/`)

- [x] 7.1 Create `features/og/templates/DefaultOG.tsx` (gradient background, app name, description, URL — 1200x630)
- [x] 7.2 Create `features/og/utils/fonts.ts` for font loading
- [x] 7.3 Create `app/api/og/route.tsx` GET endpoint with @vercel/og, siteConfig defaults, query parameter overrides
- [x] 7.4 Create `features/og/index.ts` barrel export

## 8. Legal Documents (`features/legal/`)

- [x] 8.1 Create `features/legal/content/privacy.ts` with Privacy Policy template (9 sections, siteConfig variable substitution, Google OAuth data disclosure)
- [x] 8.2 Create `features/legal/content/terms.ts` with Terms of Service template (9 sections, siteConfig variable substitution)
- [x] 8.3 Create `features/legal/components/PrivacyPolicy.tsx` and `TermsOfService.tsx` rendering components
- [x] 8.4 Create `app/privacy/page.tsx` and `app/terms/page.tsx` routes
- [x] 8.5 Create `features/legal/index.ts` barrel export

## 9. SEO Metadata (`features/seo/`)

- [x] 9.1 Create `features/seo/metadata.ts` with siteConfig-based metadata generator (title, description, openGraph, twitter)
- [x] 9.2 Create `features/seo/sitemap.ts` for dynamic sitemap (static pages + published blog posts)
- [x] 9.3 Create `features/seo/robots.ts` for robots.txt generation
- [x] 9.4 Integrate metadata into `app/layout.tsx` with OG image URL
- [x] 9.5 Create `features/seo/index.ts` barrel export

## 10. Blog System (`features/blog/`)

- [x] 10.1 Install MDX dependencies: contentlayer2 or next-mdx-remote, rehype-pretty-code
- [x] 10.2 Create `features/blog/types/index.ts` with Post and Frontmatter types
- [x] 10.3 Create `features/blog/lib/mdx.ts` for MDX parsing and frontmatter extraction
- [x] 10.4 Create `features/blog/lib/posts.ts` for post listing, sorting, and tag filtering
- [x] 10.5 Create `features/blog/components/BlogCard.tsx` (thumbnail, title, date, tags)
- [x] 10.6 Create `features/blog/components/BlogList.tsx` (card grid with tag filter)
- [x] 10.7 Create `features/blog/components/TableOfContents.tsx` (auto-generated from h2/h3)
- [x] 10.8 Create `features/blog/components/MDXComponents.tsx` (Callout, CodeBlock, Image mappings)
- [x] 10.9 Create `features/blog/components/BlogPost.tsx` (detail layout with TOC, prev/next nav)
- [x] 10.10 Create `app/blog/page.tsx` and `app/blog/[slug]/page.tsx` routes with metadata + JSON-LD
- [x] 10.11 Create `content/blog/hello-world.mdx` example post
- [x] 10.12 Create `features/blog/index.ts` barrel export

## 11. Dashboard Layout

- [x] 11.1 Create `app/dashboard/layout.tsx` with auth guard (session check, redirect), sidebar, and topbar
- [x] 11.2 Create sidebar component (collapsible, Home + Settings menu, mobile overlay)
- [x] 11.3 Create topbar component (app name, UserMenu)
- [x] 11.4 Create `app/dashboard/page.tsx` with empty state UI template (icon + message + CTA)
- [x] 11.5 Create `app/dashboard/settings/page.tsx` (profile info, subscription status conditional, account deletion)
- [x] 11.6 Create `app/dashboard/[...slug]/page.tsx` catch-all route for extensibility

## 12. Billing Integration (`features/billing/`) — Optional

- [x] 12.1 Create `features/billing/config/paddle.ts` with Paddle configuration and environment check
- [x] 12.2 Create `features/billing/components/PricingCard.tsx` and `CheckoutButton.tsx`
- [x] 12.3 Create `features/billing/components/BillingStatus.tsx` for subscription display
- [x] 12.4 Create `features/billing/api/webhook.ts` with Paddle-Signature HMAC-SHA256 verification
- [x] 12.5 Create `app/api/webhook/paddle/route.ts` webhook endpoint
- [x] 12.6 Create `features/billing/hooks/useSubscription.ts`
- [x] 12.7 Create `features/landing/components/PricingPlaceholder.tsx` ("Coming Soon" fallback)
- [x] 12.8 Create `features/billing/index.ts` barrel export
- [x] 12.9 Add Paddle subscription model to `prisma/schema.prisma`

## 13. i18n Support

- [x] 13.1 Configure next-intl in Next.js App Router (middleware, provider)
- [x] 13.2 Create `messages/en.json` with translations for dashboard UI, auth UI, and error/empty states
- [x] 13.3 Apply `useTranslations` hook to all dashboard and auth components (replace hardcoded text)

## 14. Error Handling & Loading States

- [x] 14.1 Create `app/loading.tsx` (global loading indicator)
- [x] 14.2 Create `app/error.tsx` (global error boundary with retry button)
- [x] 14.3 Create `app/not-found.tsx` (global 404 page)
- [x] 14.4 Create `app/dashboard/loading.tsx` (skeleton within sidebar layout)
- [x] 14.5 Create `app/dashboard/error.tsx` (error within sidebar layout with retry)
- [x] 14.6 Create `app/dashboard/not-found.tsx` (404 within sidebar layout)

## 15. Integration & Polish

- [x] 15.1 Wire `app/layout.tsx` root layout with SEO metadata, next-themes, next-intl providers, global styles
- [x] 15.2 Configure dub.co-inspired Tailwind settings (colors, fonts, spacing, animations from dub.co tailwind-config)
- [x] 15.3 Verify dark mode works across all landing + dashboard components
- [x] 15.4 Verify responsive design across all breakpoints (mobile, tablet, desktop)
- [x] 15.5 Verify all nullable sections hide correctly when null/empty
- [x] 15.6 Verify billing toggle: active (checkout flow) vs inactive (Coming Soon fallback)
- [x] 15.7 Create `app/pricing/page.tsx` route
- [x] 15.8 Verify full auth flow: landing → Google OAuth → dashboard → logout → landing
- [x] 15.9 Final build test (`pnpm build`) and fix any type/lint errors
