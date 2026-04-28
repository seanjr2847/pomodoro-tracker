import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockSentry } = vi.hoisted(() => ({
  mockSentry: {
    init: vi.fn(),
    captureException: vi.fn(),
    captureMessage: vi.fn(),
    setUser: vi.fn(),
  },
}));

vi.mock("@sentry/browser", () => mockSentry);

vi.mock("../lib/config", () => ({
  sentryConfig: { dsn: "https://test@sentry.io/1", environment: "test", tracesSampleRate: 1.0 },
  isSentryEnabled: true,
}));

import { initSentry, captureException, captureMessage, setUser } from "../lib/sentry";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("initSentry", () => {
  it("calls Sentry.init with config", () => {
    initSentry();
    expect(mockSentry.init).toHaveBeenCalledWith(
      expect.objectContaining({ dsn: "https://test@sentry.io/1" }),
    );
  });
});

describe("captureException", () => {
  it("sends exception to Sentry", () => {
    captureException(new Error("test"), { page: "/home" });
    expect(mockSentry.captureException).toHaveBeenCalledWith(
      expect.any(Error),
      { extra: { page: "/home" } },
    );
  });
});

describe("captureMessage", () => {
  it("sends message with severity level", () => {
    captureMessage("deploy complete", "info");
    expect(mockSentry.captureMessage).toHaveBeenCalledWith("deploy complete", "info");
  });
});

describe("setUser", () => {
  it("sets user context", () => {
    setUser({ id: "user-1", email: "a@b.com" });
    expect(mockSentry.setUser).toHaveBeenCalledWith({ id: "user-1", email: "a@b.com" });
  });

  it("clears user with null", () => {
    setUser(null);
    expect(mockSentry.setUser).toHaveBeenCalledWith(null);
  });
});
