import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@sentry/browser", () => ({
  init: vi.fn(),
  captureException: vi.fn(),
  captureMessage: vi.fn(),
  setUser: vi.fn(),
}));

vi.mock("../lib/config", () => ({
  sentryConfig: { dsn: "", environment: "test", tracesSampleRate: 1.0 },
  isSentryEnabled: false,
}));

import { captureException, captureMessage, setUser } from "../lib/sentry";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("sentry disabled fallbacks", () => {
  it("captureException logs to console when disabled", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    captureException(new Error("test"));
    expect(spy).toHaveBeenCalledWith("[monitoring]", expect.any(Error));
    spy.mockRestore();
  });

  it("captureMessage logs to console when disabled", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    captureMessage("hello", "warning");
    expect(spy).toHaveBeenCalledWith("[monitoring:warning]", "hello");
    spy.mockRestore();
  });

  it("setUser does nothing when disabled", () => {
    // Should not throw
    setUser({ id: "user-1" });
  });
});
