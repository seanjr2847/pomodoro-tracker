export const analyticsConfig = {
  posthogKey: process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "",
  posthogHost: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
  gaId: process.env.NEXT_PUBLIC_GA_ID ?? "",
};

export const isPostHogEnabled = analyticsConfig.posthogKey.length > 0;
export const isGAEnabled = analyticsConfig.gaId.length > 0;
export const isAnalyticsEnabled = isPostHogEnabled || isGAEnabled;
