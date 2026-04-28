"use client";

/**
 * Feature Provider Registry
 *
 * Feature 삭제 시: 해당 import + JSX 사용부를 지우면 됩니다.
 * 이 파일이 Feature Provider의 유일한 등록 지점입니다.
 */

// ── billing ──────────────────────────────────
import { PaddleProvider } from "@/features/billing";

// ── analytics ────────────────────────────────
import { AnalyticsProvider, GAScript } from "@/features/analytics";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

// ── monitoring ───────────────────────────────
import { MonitoringProvider } from "@/features/monitoring";

// ── cookie-consent ───────────────────────────
import { CookieBanner } from "@/features/cookie-consent";

// ── pwa ──────────────────────────────────────
import { PwaUpdater, isPwaEnabled } from "@/features/pwa";

/**
 * Wraps children with all feature providers.
 * 순서: 바깥 → 안쪽 (MonitoringProvider가 가장 먼저 감싸야 에러 캐치 가능)
 */
export function FeatureProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MonitoringProvider>
      <AnalyticsProvider>
        <PaddleProvider>{children}</PaddleProvider>
      </AnalyticsProvider>
    </MonitoringProvider>
  );
}

/** <head>에 삽입되는 Feature 스크립트 */
export function FeatureHeadScripts() {
  return <GAScript />;
}

/** 글로벌 오버레이 (배너, toast 등) */
export function FeatureOverlays() {
  return (
    <>
      <CookieBanner />
      {isPwaEnabled && <PwaUpdater />}
      <Analytics />
      <SpeedInsights />
    </>
  );
}
