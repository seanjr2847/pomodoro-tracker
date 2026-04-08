/**
 * Composable Content Security Policy
 *
 * Feature 삭제 시: 해당 섹션의 변수 + mergeDirectives 호출에서 제거하면 됩니다.
 */

type CspDirectives = Record<string, string[]>;

// ── Base (항상 필요) ─────────────────────────
const base: CspDirectives = {
  "default-src": ["'self'"],
  "worker-src": ["'self'"],
  "script-src": ["'self'", "'unsafe-inline'"],
  "style-src": ["'self'", "'unsafe-inline'"],
  "img-src": ["'self'", "data:", "https:"],
  "font-src": ["'self'", "https://fonts.gstatic.com"],
  "connect-src": ["'self'"],
  "frame-src": [],
};

// ── billing (Paddle) ─────────────────────────
const billing: CspDirectives = {
  "script-src": ["https://cdn.paddle.com"],
  "connect-src": [
    "https://checkout.paddle.com",
    "https://sandbox-checkout.paddle.com",
  ],
  "frame-src": [
    "https://checkout.paddle.com",
    "https://sandbox-checkout.paddle.com",
  ],
};

// ── analytics (PostHog + GA4) ────────────────
const analytics: CspDirectives = {
  "script-src": [
    "https://www.googletagmanager.com",
    "https://us-assets.i.posthog.com",
  ],
  "connect-src": [
    "https://us.i.posthog.com",
    "https://www.google-analytics.com",
  ],
};

// ── monitoring (Sentry) ──────────────────────
const monitoring: CspDirectives = {
  "connect-src": ["https://*.sentry.io"],
};

// ── Merge & Build ────────────────────────────

export function mergeDirectives(...sources: CspDirectives[]): CspDirectives {
  const merged: CspDirectives = {};
  for (const source of sources) {
    for (const [key, values] of Object.entries(source)) {
      if (!merged[key]) merged[key] = [];
      for (const v of values) {
        if (!merged[key].includes(v)) merged[key].push(v);
      }
    }
  }
  return merged;
}

function directivesToString(directives: CspDirectives): string {
  return Object.entries(directives)
    .filter(([, values]) => values.length > 0)
    .map(([key, values]) => `${key} ${values.join(" ")}`)
    .join("; ");
}

/** Feature 삭제 시 여기서 해당 변수를 제거 */
export function buildCsp(): string {
  return directivesToString(
    mergeDirectives(base, billing, analytics, monitoring),
  );
}
