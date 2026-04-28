import { describe, it, expect } from "vitest";
import { ok, okVoid, fail } from "../lib/actionResult";

describe("actionResult", () => {
  it("ok() creates success result with data", () => {
    const result = ok({ id: 1, name: "test" });
    expect(result).toEqual({ success: true, data: { id: 1, name: "test" } });
  });

  it("ok() works with primitive data", () => {
    expect(ok("hello")).toEqual({ success: true, data: "hello" });
    expect(ok(42)).toEqual({ success: true, data: 42 });
    expect(ok(true)).toEqual({ success: true, data: true });
  });

  it("okVoid() creates success result with undefined data", () => {
    const result = okVoid();
    expect(result).toEqual({ success: true, data: undefined });
    expect(result.success).toBe(true);
  });

  it("fail() creates failure result with error message", () => {
    const result = fail("Something went wrong");
    expect(result).toEqual({ success: false, error: "Something went wrong" });
    expect(result.success).toBe(false);
  });
});
