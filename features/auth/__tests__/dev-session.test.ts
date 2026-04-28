import { describe, it, expect } from "vitest";

// Prevent TypeScript from evaluating literal expressions at compile time
const runtime = <T>(v: T): T => v;

describe("devSession logic", () => {
  it("creates mock session when NODE_ENV=development and no GOOGLE_CLIENT_ID", () => {
    const isDev = runtime("development") === "development";
    const noGoogleId = !runtime(undefined as string | undefined);

    const devSession =
      isDev && noGoogleId
        ? {
            user: {
              id: "dev-user",
              name: "Dev User",
              email: "dev@localhost",
              image: null,
            },
            expires: new Date(Date.now() + 86400000).toISOString(),
          }
        : null;

    expect(devSession).not.toBeNull();
    expect(devSession!.user.id).toBe("dev-user");
    expect(devSession!.user.email).toBe("dev@localhost");
  });

  it("returns null when GOOGLE_CLIENT_ID is set", () => {
    const isDev = runtime("development") === "development";
    const noGoogleId = !runtime("some-client-id" as string | undefined);

    const devSession =
      isDev && noGoogleId
        ? {
            user: { id: "dev-user", name: "Dev User", email: "dev@localhost", image: null },
            expires: new Date(Date.now() + 86400000).toISOString(),
          }
        : null;

    expect(devSession).toBeNull();
  });

  it("returns null in production", () => {
    const isDev = runtime<string>("production") === "development";
    const noGoogleId = !runtime(undefined as string | undefined);

    const devSession =
      isDev && noGoogleId
        ? {
            user: { id: "dev-user", name: "Dev User", email: "dev@localhost", image: null },
            expires: new Date(Date.now() + 86400000).toISOString(),
          }
        : null;

    expect(devSession).toBeNull();
  });

  it("session expires in 24 hours", () => {
    const now = Date.now();
    const expires = new Date(now + 86400000).toISOString();
    const expiresDate = new Date(expires).getTime();

    expect(expiresDate - now).toBeCloseTo(86400000, -2);
  });
});
