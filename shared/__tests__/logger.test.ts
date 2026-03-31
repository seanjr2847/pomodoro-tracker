import { describe, it, expect, vi, beforeEach } from "vitest";
import { logger } from "@/shared/lib/logger";

describe("logger", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("logger.info outputs JSON with level=info", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    logger.info("test message");
    expect(spy).toHaveBeenCalledOnce();
    const output = JSON.parse(spy.mock.calls[0][0] as string);
    expect(output.level).toBe("info");
    expect(output.message).toBe("test message");
    expect(output.timestamp).toBeTruthy();
  });

  it("logger.warn outputs JSON with level=warn", () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    logger.warn("warning message");
    expect(spy).toHaveBeenCalledOnce();
    const output = JSON.parse(spy.mock.calls[0][0] as string);
    expect(output.level).toBe("warn");
    expect(output.message).toBe("warning message");
  });

  it("logger.error outputs JSON with level=error", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    logger.error("error message");
    expect(spy).toHaveBeenCalledOnce();
    const output = JSON.parse(spy.mock.calls[0][0] as string);
    expect(output.level).toBe("error");
    expect(output.message).toBe("error message");
  });

  it("includes metadata in output", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    logger.info("with meta", { userId: "123", action: "login" });
    const output = JSON.parse(spy.mock.calls[0][0] as string);
    expect(output.userId).toBe("123");
    expect(output.action).toBe("login");
  });

  it("timestamp is valid ISO string", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    logger.info("ts check");
    const output = JSON.parse(spy.mock.calls[0][0] as string);
    expect(() => new Date(output.timestamp)).not.toThrow();
    expect(new Date(output.timestamp).toISOString()).toBe(output.timestamp);
  });
});
