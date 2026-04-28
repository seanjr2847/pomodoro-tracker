#!/usr/bin/env node

/**
 * Feature Removal Script
 *
 * Usage:
 *   node scripts/remove-features.mjs blog billing changelog
 *   node scripts/remove-features.mjs --dry-run blog
 *   node scripts/remove-features.mjs              # interactive mode
 */

import { readFileSync, writeFileSync, rmSync, existsSync, mkdirSync } from "fs";
import { resolve, join, relative } from "path";
import { createInterface } from "readline";

const ROOT = resolve(import.meta.dirname, "..");
const rel = (p) => relative(ROOT, p);
const abs = (...parts) => join(ROOT, ...parts);

// ─── Patch Engine ────────────────────────────────────────

function readFile(filePath) {
  if (!existsSync(filePath)) return null;
  return readFileSync(filePath, "utf-8");
}

function writeFileSafe(filePath, content, dryRun) {
  if (dryRun) return;
  writeFileSync(filePath, content, "utf-8");
}

/** Remove all lines matching regex */
function removeLine(content, regex) {
  return content
    .split("\n")
    .filter((line) => !regex.test(line))
    .join("\n");
}

/** Remove a block from start regex to end regex (inclusive), or a brace-balanced block */
function removeBracedBlock(content, startRegex) {
  const lines = content.split("\n");
  const result = [];
  let i = 0;
  while (i < lines.length) {
    if (startRegex.test(lines[i])) {
      // Count braces to find block end
      let depth = 0;
      let foundOpen = false;
      while (i < lines.length) {
        const line = lines[i];
        for (const ch of line) {
          if (ch === "{") { depth++; foundOpen = true; }
          if (ch === "}") depth--;
        }
        i++;
        if (foundOpen && depth <= 0) break;
        if (!foundOpen && !line.includes("{")) { i++; break; } // single line, no braces
      }
      // Remove trailing blank line
      while (i < lines.length && lines[i].trim() === "") i++;
    } else {
      result.push(lines[i]);
      i++;
    }
  }
  return result.join("\n");
}

/** Remove a named export member from `export { A, B, C }` */
function removeExportMember(content, memberName) {
  return content.replace(
    /export\s*\{([^}]+)\}/g,
    (match, inner) => {
      const members = inner
        .split(",")
        .map((m) => m.trim())
        .filter((m) => m && m !== memberName);
      if (members.length === 0) return "// (empty export)";
      return `export { ${members.join(", ")} }`;
    }
  );
}

/** Remove a named member from import destructure. If last member, remove entire line. */
function removeImportMember(content, memberName, fromPath) {
  const lines = content.split("\n");
  const result = [];
  for (const line of lines) {
    if (fromPath && !line.includes(fromPath)) {
      result.push(line);
      continue;
    }
    if (!line.includes(memberName)) {
      result.push(line);
      continue;
    }
    // Check if this is a destructured import containing the member
    const importMatch = line.match(/import\s*\{([^}]+)\}\s*from/);
    if (!importMatch) {
      result.push(line);
      continue;
    }
    const members = importMatch[1]
      .split(",")
      .map((m) => m.trim())
      .filter((m) => m && m !== memberName && m !== `type ${memberName}`);
    if (members.length === 0) {
      // Remove entire import line
      continue;
    }
    result.push(line.replace(importMatch[1], ` ${members.join(", ")} `));
  }
  return result.join("\n");
}

/** Unwrap a JSX wrapper element, keeping children */
function unwrapJsx(content, componentName) {
  // Handle single-line: <Component>{children}</Component>
  const singleLine = new RegExp(
    `<${componentName}[^>]*>\\{children\\}</${componentName}>`,
    "g"
  );
  if (singleLine.test(content)) {
    return content.replace(singleLine, "{children}");
  }

  // Handle multi-line
  const lines = content.split("\n");
  const result = [];
  let i = 0;
  const openTag = new RegExp(`^\\s*<${componentName}[^>]*>\\s*$`);
  const closeTag = new RegExp(`^\\s*</${componentName}>\\s*$`);

  while (i < lines.length) {
    if (openTag.test(lines[i])) {
      // Skip opening tag, collect children, skip closing tag
      i++;
      const children = [];
      while (i < lines.length && !closeTag.test(lines[i])) {
        children.push(lines[i]);
        i++;
      }
      // Dedent children by 2 spaces
      for (const child of children) {
        result.push(child.replace(/^  /, ""));
      }
      i++; // skip closing tag
    } else {
      result.push(lines[i]);
      i++;
    }
  }
  return result.join("\n");
}

/** Remove JSX self-closing tag line */
function removeJsxTag(content, tagRegex) {
  return content
    .split("\n")
    .filter((line) => !tagRegex.test(line))
    .join("\n");
}

/** Remove a JSX block spanning multiple lines (from line matching start to line matching end, inclusive) */
function removeJsxBlock(content, startRegex, endRegex) {
  const lines = content.split("\n");
  const result = [];
  let i = 0;
  while (i < lines.length) {
    if (startRegex.test(lines[i])) {
      // Skip until end
      while (i < lines.length && !endRegex.test(lines[i])) i++;
      i++; // skip end line
      // Remove trailing blank line
      if (i < lines.length && lines[i].trim() === "") i++;
    } else {
      result.push(lines[i]);
      i++;
    }
  }
  return result.join("\n");
}

/** Clean up consecutive blank lines */
function cleanBlankLines(content) {
  return content.replace(/\n{3,}/g, "\n\n");
}

// ─── Feature Registry ────────────────────────────────────

const CORE_FEATURES = ["database", "auth", "landing", "seo"];

const FEATURES = {
  blog: {
    label: "Blog (MDX posts)",
    dirs: ["features/blog", "app/blog", "content/blog"],
    files: [],
    sitemapPaths: ["/blog"],
    sitemapImports: ["getBlogSitemapEntries"],
    prismaModels: [],
    prismaUserFields: [],
    envPrefixes: [],
    packages: ["next-mdx-remote", "gray-matter", "rehype-pretty-code", "shiki"],
    sharedPackagesWith: ["changelog"],
    dependents: [],
    warnings: [],
  },

  billing: {
    label: "Billing (Paddle subscriptions)",
    dirs: ["features/billing", "app/pricing", "app/api/webhook/paddle"],
    files: ["app/dashboard/settings/BillingSection.tsx"],
    sitemapPaths: ["/pricing"],
    sitemapImports: [],
    prismaModels: ["Subscription"],
    prismaUserFields: ["subscription"],
    envPrefixes: ["PADDLE_", "NEXT_PUBLIC_PADDLE_"],
    packages: [],
    dependents: [],
    warnings: [],
  },

  changelog: {
    label: "Changelog (MDX)",
    dirs: ["features/changelog", "app/changelog", "content/changelog"],
    files: [],
    sitemapPaths: ["/changelog"],
    sitemapImports: [],
    prismaModels: [],
    prismaUserFields: [],
    envPrefixes: [],
    packages: ["next-mdx-remote", "gray-matter", "rehype-pretty-code", "shiki"],
    sharedPackagesWith: ["blog"],
    dependents: [],
    warnings: [],
  },

  contact: {
    label: "Contact form",
    dirs: ["features/contact", "app/contact"],
    files: [],
    sitemapPaths: ["/contact"],
    sitemapImports: [],
    prismaModels: [],
    prismaUserFields: [],
    envPrefixes: [],
    packages: [],
    dependents: ["email"],
    warnings: ["email feature의 app/contact/actions.ts가 함께 삭제됩니다"],
  },

  analytics: {
    label: "Analytics (PostHog + GA4 + Vercel)",
    dirs: ["features/analytics"],
    files: [],
    sitemapPaths: [],
    sitemapImports: [],
    prismaModels: [],
    prismaUserFields: [],
    envPrefixes: ["NEXT_PUBLIC_POSTHOG_", "NEXT_PUBLIC_GA_ID"],
    packages: ["posthog-js", "@vercel/analytics", "@vercel/speed-insights"],
    dependents: [],
    warnings: [],
  },

  monitoring: {
    label: "Error monitoring (Sentry)",
    dirs: ["features/monitoring"],
    files: [],
    sitemapPaths: [],
    sitemapImports: [],
    prismaModels: [],
    prismaUserFields: [],
    envPrefixes: ["NEXT_PUBLIC_SENTRY_DSN", "SENTRY_"],
    packages: ["@sentry/browser", "@sentry/webpack-plugin"],
    dependents: [],
    warnings: [],
  },

  "cookie-consent": {
    label: "Cookie consent banner",
    dirs: ["features/cookie-consent"],
    files: [],
    sitemapPaths: [],
    sitemapImports: [],
    prismaModels: [],
    prismaUserFields: [],
    envPrefixes: [],
    packages: [],
    dependents: [],
    warnings: [],
  },

  pwa: {
    label: "PWA (offline, manifest, service worker)",
    dirs: ["features/pwa", "app/offline", "public/icons"],
    files: ["app/manifest.ts"],
    sitemapPaths: [],
    sitemapImports: [],
    prismaModels: [],
    prismaUserFields: [],
    envPrefixes: ["NEXT_PUBLIC_PWA_ENABLED"],
    packages: ["@serwist/next", "serwist"],
    dependents: [],
    warnings: [],
  },

  og: {
    label: "OG image generation",
    dirs: ["features/og", "app/api/og"],
    files: [],
    sitemapPaths: [],
    sitemapImports: [],
    prismaModels: [],
    prismaUserFields: [],
    envPrefixes: [],
    packages: [],
    dependents: [],
    warnings: [],
  },

  legal: {
    label: "Legal pages (privacy, terms)",
    dirs: ["features/legal", "app/privacy", "app/terms"],
    files: [],
    sitemapPaths: ["/privacy", "/terms"],
    sitemapImports: [],
    prismaModels: [],
    prismaUserFields: [],
    envPrefixes: [],
    packages: [],
    dependents: [],
    warnings: [],
  },

  email: {
    label: "Transactional email (Resend)",
    dirs: ["features/email"],
    files: [],
    sitemapPaths: [],
    sitemapImports: [],
    prismaModels: [],
    prismaUserFields: [],
    envPrefixes: ["RESEND_"],
    packages: ["resend", "@react-email/components"],
    dependents: [],
    warnings: [],
  },

  feedback: {
    label: "Feedback form (dashboard widget)",
    dirs: ["features/feedback"],
    files: [],
    sitemapPaths: [],
    sitemapImports: [],
    prismaModels: [],
    prismaUserFields: [],
    envPrefixes: [],
    packages: [],
    dependents: [],
    warnings: [],
  },

  "api-keys": {
    label: "API key management",
    dirs: ["features/api-keys", "app/dashboard/api-keys"],
    files: [],
    sitemapPaths: [],
    sitemapImports: [],
    prismaModels: ["ApiKey"],
    prismaUserFields: ["apiKeys"],
    envPrefixes: [],
    packages: [],
    dependents: [],
    warnings: [],
  },

  usage: {
    label: "Usage metering (dashboard widget)",
    dirs: ["features/usage"],
    files: [],
    sitemapPaths: [],
    sitemapImports: [],
    prismaModels: ["UsageRecord"],
    prismaUserFields: ["usageRecords"],
    envPrefixes: [],
    packages: [],
    dependents: [],
    warnings: [],
  },

  share: {
    label: "Share links (/s/[slug])",
    dirs: ["features/share", "app/s"],
    files: [],
    sitemapPaths: [],
    sitemapImports: [],
    prismaModels: ["SharedLink"],
    prismaUserFields: ["sharedLinks"],
    envPrefixes: [],
    packages: ["html2canvas", "jspdf"],
    dependents: [],
    warnings: [],
  },

  kanban: {
    label: "Kanban board",
    dirs: ["features/kanban"],
    files: [],
    sitemapPaths: [],
    sitemapImports: [],
    prismaModels: ["KanbanCard"],
    prismaUserFields: ["kanbanCards"],
    envPrefixes: [],
    packages: ["@hello-pangea/dnd"],
    dependents: [],
    warnings: [],
  },

  "result-history": {
    label: "Generation history",
    dirs: ["features/result-history"],
    files: [],
    sitemapPaths: [],
    sitemapImports: [],
    prismaModels: [],
    prismaUserFields: [],
    envPrefixes: [],
    packages: [],
    dependents: [],
    warnings: [],
    sharedPrisma: { model: "Generation", field: "generations", sharedWith: "ai-generation" },
  },

  "ai-generation": {
    label: "AI text generation (Gemini)",
    dirs: ["features/ai-generation", "app/api/generate"],
    files: [],
    sitemapPaths: [],
    sitemapImports: [],
    prismaModels: [],
    prismaUserFields: [],
    envPrefixes: ["GEMINI_API_KEY"],
    packages: ["@google/generative-ai"],
    dependents: [],
    warnings: [],
    sharedPrisma: { model: "Generation", field: "generations", sharedWith: "result-history" },
  },

  "api-client": {
    label: "API client wrapper",
    dirs: ["features/api-client"],
    files: [],
    sitemapPaths: [],
    sitemapImports: [],
    prismaModels: [],
    prismaUserFields: [],
    envPrefixes: [],
    packages: [],
    dependents: [],
    warnings: [],
  },

  "rate-limit": {
    label: "API rate limiting",
    dirs: ["features/rate-limit"],
    files: [],
    sitemapPaths: [],
    sitemapImports: [],
    prismaModels: [],
    prismaUserFields: [],
    envPrefixes: ["UPSTASH_"],
    packages: ["@upstash/ratelimit", "@upstash/redis"],
    dependents: [],
    warnings: [],
  },

  "google-maps": {
    label: "Google Maps",
    dirs: ["features/google-maps"],
    files: [],
    sitemapPaths: [],
    sitemapImports: [],
    prismaModels: [],
    prismaUserFields: [],
    envPrefixes: ["NEXT_PUBLIC_GOOGLE_MAPS_API_KEY"],
    packages: [],
    dependents: [],
    warnings: [],
  },
};

// ─── Special Patch Functions ─────────────────────────────

/** Patch app/providers.tsx (new structure) or app/layout.tsx (old structure) */
function patchProviders(content, removing) {
  let c = content;

  if (removing.has("billing")) {
    c = removeLine(c, /\/\/\s*──\s*billing/);
    c = removeLine(c, /import\s*\{.*PaddleProvider.*\}\s*from\s*"@\/features\/billing"/);
    c = c.replace(/<PaddleProvider>\{children\}<\/PaddleProvider>/g, "{children}");
    c = unwrapJsx(c, "PaddleProvider");
  }

  if (removing.has("analytics")) {
    c = removeLine(c, /\/\/\s*──\s*analytics/);
    c = removeLine(c, /import\s*\{.*AnalyticsProvider.*GAScript.*\}\s*from\s*"@\/features\/analytics"/);
    c = removeLine(c, /import\s*\{.*AnalyticsProvider.*\}\s*from\s*"@\/features\/analytics"/);
    c = removeLine(c, /import\s*\{.*GAScript.*\}\s*from\s*"@\/features\/analytics"/);
    c = removeLine(c, /import\s*\{.*Analytics.*\}\s*from\s*"@vercel\/analytics/);
    c = removeLine(c, /import\s*\{.*SpeedInsights.*\}\s*from\s*"@vercel\/speed-insights/);
    c = unwrapJsx(c, "AnalyticsProvider");
    c = c.replace(/return\s*<GAScript\s*\/>;/, "return null;");
    c = removeJsxTag(c, /^\s*<GAScript\s*\/>/);
    c = removeJsxTag(c, /^\s*<Analytics\s*\/>/);
    c = removeJsxTag(c, /^\s*<SpeedInsights\s*\/>/);
  }

  if (removing.has("monitoring")) {
    c = removeLine(c, /\/\/\s*──\s*monitoring/);
    c = removeLine(c, /import\s*\{.*MonitoringProvider.*\}\s*from\s*"@\/features\/monitoring"/);
    c = unwrapJsx(c, "MonitoringProvider");
  }

  if (removing.has("cookie-consent")) {
    c = removeLine(c, /\/\/\s*──\s*cookie-consent/);
    c = removeLine(c, /import\s*\{.*CookieBanner.*\}\s*from\s*"@\/features\/cookie-consent"/);
    c = removeJsxTag(c, /^\s*<CookieBanner\s*\/>/);
  }

  if (removing.has("pwa")) {
    c = removeLine(c, /\/\/\s*──\s*pwa/);
    c = removeLine(c, /import\s*\{.*PwaUpdater.*\}\s*from\s*"@\/features\/pwa"/);
    c = removeLine(c, /isPwaEnabled\s*&&\s*<PwaUpdater/);
    c = removeJsxTag(c, /^\s*\{isPwaEnabled\s*&&\s*<PwaUpdater\s*\/>\}/);
  }

  // If all providers removed, ensure valid JSX: wrap bare {children} in fragment
  c = c.replace(
    /return\s*\(\s*\n\s*\{children\}\s*\n\s*\);/,
    "return <>{children}</>;"
  );

  return cleanBlankLines(c);
}

function patchSitemap(content, removing) {
  let c = content;

  // Remove feature imports (e.g., getBlogSitemapEntries)
  for (const name of removing) {
    const feat = FEATURES[name];
    if (!feat) continue;
    for (const imp of feat.sitemapImports || []) {
      c = removeLine(c, new RegExp(`import\\s*\\{.*${imp}.*\\}\\s*from`));
      // Remove from featureEntries array
      c = removeLine(c, new RegExp(`\\s*${imp}`));
    }
  }

  // Remove blog-specific: import { getAllPosts } and the blogPosts block (old structure)
  if (removing.has("blog")) {
    c = removeLine(c, /import\s*\{.*getAllPosts.*\}\s*from\s*"@\/features\/blog"/);
    c = removeLine(c, /import\s*\{.*getBlogSitemapEntries.*\}\s*from\s*"@\/features\/blog"/);
    // Remove blogPosts const block
    c = removeBracedBlock(c, /^\s*const blogPosts\s*=/);
    // Remove ...blogPosts from return array
    c = c.replace(/,?\s*\.\.\.blogPosts/g, "");
    // Simplify [...staticPages] to staticPages
    c = c.replace(/\[\.\.\.\s*staticPages\s*\]/, "staticPages");
  }

  // Remove static sitemap entries
  for (const name of removing) {
    const feat = FEATURES[name];
    if (!feat) continue;
    for (const path of feat.sitemapPaths || []) {
      c = removeLine(c, new RegExp(`url:.*${path.replace("/", "\\/")}`));
    }
  }

  // Simplify [...staticPages] to staticPages if no dynamic entries remain
  if (!c.includes("blogPosts") && !c.includes("featureEntries")) {
    c = c.replace(/\[\.\.\.\s*staticPages\s*\]/g, "staticPages");
  }

  // If featureEntries is now empty, simplify
  if (!/\w/.test((c.match(/const featureEntries[^;]*=\s*\[([^\]]*)\]/) || [])[1] || "x")) {
    c = removeLine(c, /const featureEntries/);
    c = removeLine(c, /\/\/\s*──\s*Feature sitemap/);
    c = c.replace(
      /return\s*\[\.\.\.\s*staticPages\s*,\s*\.\.\.\s*featureEntries\.flatMap\([^)]*\)\s*\];/,
      "return staticPages;"
    );
  }

  return cleanBlankLines(c);
}

function patchWidgets(content, removing) {
  let c = content;

  if (removing.has("feedback")) {
    c = removeLine(c, /\/\/\s*──\s*feedback/);
    c = removeLine(c, /import\s*\{.*FeedbackForm.*\}\s*from\s*"@\/features\/feedback"/);
    c = removeExportMember(c, "FeedbackForm");
  }

  if (removing.has("api-keys")) {
    c = removeLine(c, /\/\/\s*──\s*api-keys/);
    c = removeLine(c, /import\s*\{.*ApiKeyManager.*\}\s*from\s*"@\/features\/api-keys"/);
    c = removeExportMember(c, "ApiKeyManager");
  }

  if (removing.has("usage")) {
    c = removeLine(c, /\/\/\s*──\s*usage/);
    c = removeLine(c, /import\s*\{.*UsageDashboard.*\}\s*from\s*"@\/features\/usage"/);
    c = removeExportMember(c, "UsageDashboard");
  }

  return cleanBlankLines(c);
}

function patchDashboardPage(content, removing) {
  let c = content;
  const widgetNames = [];

  if (removing.has("usage")) widgetNames.push("UsageDashboard");
  if (removing.has("api-keys")) widgetNames.push("ApiKeyManager");
  if (removing.has("feedback")) widgetNames.push("FeedbackForm");

  for (const name of widgetNames) {
    // Remove from widgets.tsx import (new structure)
    c = removeImportMember(c, name, "./widgets");
    // Remove from direct feature imports (old structure)
    c = removeImportMember(c, name, `@/features/`);
    // Remove direct feature import lines
    c = removeLine(c, new RegExp(`import\\s*\\{\\s*${name}\\s*\\}\\s*from\\s*"@/features/`));
    // Remove JSX usage
    c = removeLine(c, new RegExp(`^\\s*<${name}[^>]*\\/?>\\s*$`));
  }

  // If all widgets removed, remove import line and grid div
  if (removing.has("usage") && removing.has("api-keys") && removing.has("feedback")) {
    c = removeLine(c, /import.*from\s*"\.\/widgets"/);
    // Remove empty grid div
    c = removeJsxBlock(c, /className="grid gap-6/, /^\s*<\/div>/);
  }

  return cleanBlankLines(c);
}

function patchSettingsPage(content, removing) {
  let c = content;

  if (removing.has("billing")) {
    // New structure: BillingSection.tsx separate component
    c = removeLine(c, /\/\/\s*──\s*billing/);
    c = removeLine(c, /import\s*\{.*isBillingEnabled.*BillingSection.*\}\s*from/);
    // Remove JSX block: {isBillingEnabled && (<BillingSection ... />)}
    c = removeJsxBlock(
      c,
      /\{isBillingEnabled\s*&&\s*\(/,
      /^\s*\)\}\s*$/
    );
    c = removeLine(c, /^\s*\{\/\*\s*billing.*\*\/\}\s*$/);

    // Old structure: inline SubscriptionSection + billing imports
    c = removeLine(c, /import\s*\{.*BillingStatus.*isBillingEnabled.*getSubscriptionByUserId.*\}\s*from\s*"@\/features\/billing"/);
    c = removeLine(c, /import\s*\{.*BillingStatus.*\}\s*from\s*"@\/features\/billing"/);
    c = removeLine(c, /import\s*\{.*isBillingEnabled.*\}\s*from\s*"@\/features\/billing"/);
    c = removeLine(c, /import\s*\{.*getSubscriptionByUserId.*\}\s*from\s*"@\/features\/billing"/);
    // Catch any combined billing import
    c = removeLine(c, /import\s*\{[^}]*\}\s*from\s*"@\/features\/billing"/);
    // Remove {isBillingEnabled && (<SubscriptionSection ... />)} block
    c = removeJsxBlock(
      c,
      /\{isBillingEnabled\s*&&\s*\(/,
      /^\s*\)\}\s*$/
    );
    // Also single-line pattern
    c = removeLine(c, /\{isBillingEnabled\s*&&/);
    // Remove the SubscriptionSection function definition
    c = removeBracedBlock(c, /^async function SubscriptionSection/);
  }

  return cleanBlankLines(c);
}

function patchCsp(content, removing) {
  let c = content;

  for (const feat of ["billing", "analytics", "monitoring"]) {
    if (!removing.has(feat)) continue;
    // Remove the const block
    c = removeBracedBlock(c, new RegExp(`^const ${feat}:\\s*CspDirectives`));
    c = removeLine(c, new RegExp(`\\/\\/\\s*──\\s*${feat}`));
  }

  // Update mergeDirectives call
  c = c.replace(
    /mergeDirectives\(([^)]+)\)/,
    (match, args) => {
      const parts = args
        .split(",")
        .map((a) => a.trim())
        .filter((a) => {
          if (removing.has("billing") && a === "billing") return false;
          if (removing.has("analytics") && a === "analytics") return false;
          if (removing.has("monitoring") && a === "monitoring") return false;
          return true;
        });
      return `mergeDirectives(${parts.join(", ")})`;
    }
  );

  return cleanBlankLines(c);
}

function patchNextConfig(content, removing) {
  let c = content;

  if (removing.has("monitoring")) {
    // Remove webpack block
    c = removeBracedBlock(c, /\/\/\s*──\s*monitoring.*Sentry/);
    // Also try matching the webpack property directly
    if (c.includes("webpack(config,")) {
      c = removeBracedBlock(c, /^\s*webpack\(config,/);
    }
  }

  if (removing.has("pwa")) {
    c = removeLine(c, /import\s*\{.*withSerwist.*\}\s*from/);
    // Unwrap withSerwist from plugin chain
    c = c.replace(/withSerwist\(([^)]+)\)/g, "$1");
  }

  return cleanBlankLines(c);
}

function patchMiddleware(content, removing) {
  let c = content;

  if (removing.has("rate-limit")) {
    c = removeLine(c, /import\s*\{.*rateLimit.*\}\s*from\s*"@\/features\/rate-limit"/);
    c = removeLine(c, /const\s+apiLimiter\s*=/);
    // Remove the rate limit if block
    c = removeJsxBlock(
      c,
      /if\s*\(pathname\.startsWith\("\/api\/"\)\)/,
      /^\s*\}\s*$/
    );
    // Also remove comment
    c = removeLine(c, /\/\/\s*Rate limit API routes/);
  }

  if (removing.has("pwa")) {
    // Remove sw.js and serwist-worker from matcher regex
    c = c.replace(/sw\\\\.js\|serwist-worker\.\*\\\\.js\|/g, "");
  }

  return cleanBlankLines(c);
}

function patchAuthenticateRequest(content, removing) {
  let c = content;

  if (removing.has("api-keys")) {
    c = removeLine(c, /import\s*\{.*validateApiKey.*\}\s*from\s*"@\/features\/api-keys"/);
    // Remove the API key fallback block (from "// 2. Try API key auth" to the closing brace before "return null")
    c = removeJsxBlock(
      c,
      /\/\/\s*2\.\s*Try API key auth/,
      /^\s*\}\s*$/ // closing brace of the outer if(apiKeyHeader)
    );
  }

  return cleanBlankLines(c);
}

function patchPrismaSchema(content, removing) {
  let c = content;

  // Collect models to remove
  const modelsToRemove = new Set();
  const userFieldsToRemove = new Set();

  for (const name of removing) {
    const feat = FEATURES[name];
    if (!feat) continue;

    for (const model of feat.prismaModels) modelsToRemove.add(model);
    for (const field of feat.prismaUserFields) userFieldsToRemove.add(field);

    // Handle shared Prisma models
    if (feat.sharedPrisma) {
      const { model, field, sharedWith } = feat.sharedPrisma;
      if (removing.has(sharedWith)) {
        modelsToRemove.add(model);
        userFieldsToRemove.add(field);
      }
    }
  }

  // Remove model blocks
  for (const model of modelsToRemove) {
    c = removeBracedBlock(c, new RegExp(`^model\\s+${model}\\s*\\{`));
  }

  // Remove User relation fields
  for (const field of userFieldsToRemove) {
    c = removeLine(c, new RegExp(`^\\s+${field}\\s+`));
  }

  return cleanBlankLines(c);
}

function patchEnvExample(content, removing) {
  let c = content;

  const prefixes = [];
  for (const name of removing) {
    const feat = FEATURES[name];
    if (!feat) continue;
    prefixes.push(...feat.envPrefixes);
  }

  if (prefixes.length === 0) return c;

  const lines = c.split("\n");
  const result = [];
  let skipSection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.replace(/^#\s*/, "").trim();

    // Check if this line is an env var or commented env var matching our prefixes
    const isMatch = prefixes.some(
      (prefix) =>
        trimmed.startsWith(prefix) ||
        trimmed.startsWith(`${prefix}`)
    );

    if (isMatch) {
      // Also remove preceding comment line if it's a section header
      if (
        result.length > 0 &&
        result[result.length - 1].trim() === ""
      ) {
        // Check if the line before blank is also being removed
      }
      continue;
    }

    result.push(line);
  }

  // Clean up orphaned section headers (comment lines followed by only blank lines)
  c = result.join("\n");

  // Remove section comments that have no vars after them
  // Pattern: "# Section title (optional — ...)\n\n" with nothing else before next section or EOF
  c = c.replace(/\n# [A-Z][^\n]*\(optional[^\n]*\)\n(?=\n# |\n*$)/g, "\n");

  return cleanBlankLines(c);
}

function patchContactPage(content, removing) {
  let c = content;

  if (removing.has("email") && !removing.has("contact")) {
    c = removeLine(c, /import\s*\{.*submitContactWithEmail.*\}\s*from\s*"\.\/actions"/);
    c = c.replace(/\s*action=\{submitContactWithEmail\}/g, "");
  }

  return c;
}

// ─── Validation ──────────────────────────────────────────

function validate(featureNames) {
  const errors = [];
  const warnings = [];

  for (const name of featureNames) {
    if (CORE_FEATURES.includes(name)) {
      errors.push(`\x1b[31m[ERROR]\x1b[0m '${name}'은 core feature이므로 삭제할 수 없습니다`);
      continue;
    }
    if (!FEATURES[name]) {
      errors.push(`\x1b[31m[ERROR]\x1b[0m '${name}'은 존재하지 않는 feature입니다`);
      continue;
    }
  }

  const removing = new Set(featureNames);

  for (const name of featureNames) {
    const feat = FEATURES[name];
    if (!feat) continue;

    // Check dependents
    for (const dep of feat.dependents) {
      if (!removing.has(dep) && FEATURES[dep]) {
        warnings.push(
          `\x1b[33m[WARN]\x1b[0m '${name}' 삭제 시 '${dep}'도 함께 삭제를 권장합니다`
        );
      }
    }

    // Show feature-specific warnings
    for (const w of feat.warnings) {
      warnings.push(`\x1b[33m[WARN]\x1b[0m ${name}: ${w}`);
    }

    // Shared prisma warning
    if (feat.sharedPrisma && !removing.has(feat.sharedPrisma.sharedWith)) {
      warnings.push(
        `\x1b[33m[WARN]\x1b[0m '${feat.sharedPrisma.model}' Prisma 모델은 '${feat.sharedPrisma.sharedWith}'과 공유 — 둘 다 삭제해야 모델이 제거됩니다`
      );
    }
  }

  return { errors, warnings };
}

// ─── Interactive Mode ────────────────────────────────────

async function interactiveSelect() {
  const names = Object.keys(FEATURES);
  console.log("\n\x1b[1m삭제할 Feature를 선택하세요\x1b[0m (쉼표로 구분, 예: 1,3,5)\n");

  names.forEach((name, i) => {
    const feat = FEATURES[name];
    console.log(`  \x1b[36m${String(i + 1).padStart(2)}.\x1b[0m ${name.padEnd(18)} ${feat.label}`);
  });

  console.log(`\n  \x1b[90mCore (삭제 불가): ${CORE_FEATURES.join(", ")}\x1b[0m\n`);

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await new Promise((resolve) => {
    rl.question("  번호 입력: ", (ans) => {
      rl.close();
      resolve(ans);
    });
  });

  const selected = answer
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => parseInt(s, 10) - 1)
    .filter((i) => i >= 0 && i < names.length)
    .map((i) => names[i]);

  return selected;
}

// ─── Execution ───────────────────────────────────────────

async function execute(featureNames, { dryRun = false, force = false } = {}) {
  const removing = new Set(featureNames);
  const log = (msg) => console.log(msg);
  const stats = { dirsRemoved: 0, filesRemoved: 0, filesPatched: 0 };

  log(`\n${dryRun ? "\x1b[33m[DRY RUN]\x1b[0m " : ""}Feature 삭제: \x1b[1m${featureNames.join(", ")}\x1b[0m\n`);

  // --- Patch files ---

  const patchTargets = [
    {
      path: "app/providers.tsx",
      condition: ["billing", "analytics", "monitoring", "cookie-consent", "pwa"].some((f) => removing.has(f)),
      patch: (c) => patchProviders(c, removing),
    },
    {
      // Old structure: providers live directly in layout.tsx
      path: "app/layout.tsx",
      condition: ["billing", "analytics", "monitoring", "cookie-consent", "pwa"].some((f) => removing.has(f)),
      patch: (c) => patchProviders(c, removing),
    },
    {
      path: "app/sitemap.ts",
      condition: featureNames.some((f) => {
        const feat = FEATURES[f];
        return feat && ((feat.sitemapPaths?.length > 0) || (feat.sitemapImports?.length > 0));
      }),
      patch: (c) => patchSitemap(c, removing),
    },
    {
      path: "app/dashboard/widgets.tsx",
      condition: ["feedback", "api-keys", "usage"].some((f) => removing.has(f)),
      patch: (c) => patchWidgets(c, removing),
    },
    {
      path: "app/dashboard/page.tsx",
      condition: ["feedback", "api-keys", "usage"].some((f) => removing.has(f)),
      patch: (c) => patchDashboardPage(c, removing),
    },
    {
      path: "app/dashboard/settings/page.tsx",
      condition: removing.has("billing"),
      patch: (c) => patchSettingsPage(c, removing),
    },
    {
      path: "config/csp.ts",
      condition: ["billing", "analytics", "monitoring"].some((f) => removing.has(f)),
      patch: (c) => patchCsp(c, removing),
    },
    {
      path: "next.config.ts",
      condition: ["monitoring", "pwa"].some((f) => removing.has(f)),
      patch: (c) => patchNextConfig(c, removing),
    },
    {
      path: "middleware.ts",
      condition: ["rate-limit", "pwa"].some((f) => removing.has(f)),
      patch: (c) => patchMiddleware(c, removing),
    },
    {
      path: "features/auth/lib/authenticateRequest.ts",
      condition: removing.has("api-keys"),
      patch: (c) => patchAuthenticateRequest(c, removing),
    },
    {
      path: "prisma/schema.prisma",
      condition: featureNames.some((f) => {
        const feat = FEATURES[f];
        return feat && (feat.prismaModels?.length > 0 || feat.prismaUserFields?.length > 0 || feat.sharedPrisma);
      }),
      patch: (c) => patchPrismaSchema(c, removing),
    },
    {
      path: ".env.example",
      condition: featureNames.some((f) => FEATURES[f]?.envPrefixes?.length > 0),
      patch: (c) => patchEnvExample(c, removing),
    },
    {
      path: "app/contact/page.tsx",
      condition: removing.has("email") && !removing.has("contact"),
      patch: (c) => patchContactPage(c, removing),
    },
  ];

  for (const target of patchTargets) {
    if (!target.condition) continue;
    const filePath = abs(target.path);
    const content = readFile(filePath);
    if (!content) {
      log(`  \x1b[90mSKIP ${target.path} (not found)\x1b[0m`);
      continue;
    }

    const patched = target.patch(content);
    if (patched === content) {
      log(`  \x1b[90mSKIP ${target.path} (no changes)\x1b[0m`);
      continue;
    }

    log(`  \x1b[34mPATCH\x1b[0m ${target.path}`);
    writeFileSafe(filePath, patched, dryRun);
    stats.filesPatched++;
  }

  // Handle: if all widgets removed, delete widgets.tsx
  if (removing.has("feedback") && removing.has("api-keys") && removing.has("usage")) {
    const widgetsPath = abs("app/dashboard/widgets.tsx");
    if (existsSync(widgetsPath)) {
      log(`  \x1b[31mDELETE\x1b[0m app/dashboard/widgets.tsx (all widgets removed)`);
      if (!dryRun) rmSync(widgetsPath);
      stats.filesRemoved++;
    }
  }

  // Handle: email feature — delete app/contact/actions.ts if contact still exists
  if (removing.has("email") && !removing.has("contact")) {
    const actionsPath = abs("app/contact/actions.ts");
    if (existsSync(actionsPath)) {
      log(`  \x1b[31mDELETE\x1b[0m app/contact/actions.ts`);
      if (!dryRun) rmSync(actionsPath);
      stats.filesRemoved++;
    }
  }

  // --- Delete individual files ---
  for (const name of featureNames) {
    const feat = FEATURES[name];
    if (!feat) continue;
    for (const file of feat.files) {
      const filePath = abs(file);
      if (existsSync(filePath)) {
        log(`  \x1b[31mDELETE\x1b[0m ${file}`);
        if (!dryRun) rmSync(filePath);
        stats.filesRemoved++;
      }
    }
  }

  // --- Delete directories ---
  for (const name of featureNames) {
    const feat = FEATURES[name];
    if (!feat) continue;
    for (const dir of feat.dirs) {
      const dirPath = abs(dir);
      if (existsSync(dirPath)) {
        log(`  \x1b[31mDELETE\x1b[0m ${dir}/`);
        if (!dryRun) rmSync(dirPath, { recursive: true, force: true });
        stats.dirsRemoved++;
      }
    }
  }

  // --- Summary ---
  log("");
  log("\x1b[1m── Summary ──\x1b[0m");
  log(`  Directories removed: ${stats.dirsRemoved}`);
  log(`  Files removed:       ${stats.filesRemoved}`);
  log(`  Files patched:       ${stats.filesPatched}`);

  // Package removal suggestions
  const packagesToRemove = new Set();
  for (const name of featureNames) {
    const feat = FEATURES[name];
    if (!feat?.packages?.length) continue;

    if (feat.sharedPackagesWith) {
      // Only suggest if all sharing features are also being removed
      const allShared = feat.sharedPackagesWith.every((s) => removing.has(s));
      if (allShared) {
        for (const pkg of feat.packages) packagesToRemove.add(pkg);
      }
    } else {
      for (const pkg of feat.packages) packagesToRemove.add(pkg);
    }
  }

  if (packagesToRemove.size > 0) {
    log(`\n  \x1b[36mSuggested:\x1b[0m pnpm remove ${[...packagesToRemove].join(" ")}`);
  }

  // Prisma reminder
  const hasPrismaChanges = featureNames.some((f) => {
    const feat = FEATURES[f];
    return feat && (feat.prismaModels?.length > 0 || feat.prismaUserFields?.length > 0 || feat.sharedPrisma);
  });
  if (hasPrismaChanges) {
    log(`\n  \x1b[36mPrisma:\x1b[0m pnpm db:generate`);
  }

  log(`\n  \x1b[36mVerify:\x1b[0m pnpm lint && pnpm build`);
  log("");
}

// ─── CLI Entry Point ─────────────────────────────────────

async function main() {
  const rawArgs = process.argv.slice(2);
  const dryRun = rawArgs.includes("--dry-run");
  const force = rawArgs.includes("--force");
  const help = rawArgs.includes("--help") || rawArgs.includes("-h");

  const featureArgs = rawArgs.filter((a) => !a.startsWith("--") && !a.startsWith("-"));

  if (help) {
    console.log(`
Usage:
  node scripts/remove-features.mjs [features...] [options]

Options:
  --dry-run     Preview changes without modifying files
  --force       Skip confirmation prompt
  --help        Show this help

Features (${Object.keys(FEATURES).length} removable):
  ${Object.keys(FEATURES).join(", ")}

Core (not removable):
  ${CORE_FEATURES.join(", ")}

Examples:
  node scripts/remove-features.mjs blog billing changelog
  node scripts/remove-features.mjs --dry-run blog
  node scripts/remove-features.mjs              # interactive mode
`);
    process.exit(0);
  }

  let featureNames = featureArgs;

  if (featureNames.length === 0) {
    featureNames = await interactiveSelect();
    if (featureNames.length === 0) {
      console.log("선택된 feature가 없습니다.");
      process.exit(0);
    }
  }

  // Validate
  const { errors, warnings } = validate(featureNames);
  for (const w of warnings) console.log(w);
  if (errors.length > 0) {
    for (const e of errors) console.log(e);
    process.exit(1);
  }

  // Confirm
  if (!force && !dryRun) {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    const answer = await new Promise((resolve) => {
      rl.question(
        `\n삭제할 features: \x1b[1m${featureNames.join(", ")}\x1b[0m\n계속하시겠습니까? (y/N) `,
        (ans) => {
          rl.close();
          resolve(ans);
        }
      );
    });
    if (answer.toLowerCase() !== "y") {
      console.log("취소되었습니다.");
      process.exit(0);
    }
  }

  await execute(featureNames, { dryRun, force });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
