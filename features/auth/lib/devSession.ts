import { isDevelopment } from "@/shared/lib/env";

/**
 * Dev-only mock session — used when GOOGLE_CLIENT_ID is absent in development.
 * Import this instead of duplicating the object in each layout/page.
 */
export const devSession =
  isDevelopment && !process.env.GOOGLE_CLIENT_ID
    ? {
        user: {
          id: "dev-user",
          name: "Dev User",
          email: "dev@localhost",
          image: null as string | null,
          role: "USER",
        },
        expires: new Date(Date.now() + 86400000).toISOString(),
      }
    : null;
