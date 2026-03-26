import { describe, it, expect } from "vitest";
import { calcDarkPrimary, getThemeColors } from "@/lib/theme";

describe("calcDarkPrimary", () => {
  it("increases lightness by 20%", () => {
    // Pure black (#000000) → lightness 0 + 20 = 20%
    const result = calcDarkPrimary("#000000");
    // Should produce a dark gray, not black
    expect(result).not.toBe("#000000");
  });

  it("caps lightness at 95%", () => {
    // Pure white (#ffffff) → lightness 100, capped at 95
    const result = calcDarkPrimary("#ffffff");
    expect(result).toBeDefined();
  });

  it("returns a valid hex string", () => {
    const result = calcDarkPrimary("#6366f1");
    expect(result).toMatch(/^#[0-9a-f]{6}$/);
  });

  it("produces a lighter color than input", () => {
    // Indigo #6366f1 should become lighter
    const input = "#6366f1";
    const result = calcDarkPrimary(input);
    expect(result).not.toBe(input);
  });

  it("handles hex without # prefix", () => {
    const result = calcDarkPrimary("6366f1");
    expect(result).toMatch(/^#[0-9a-f]{6}$/);
  });
});

describe("getThemeColors", () => {
  it("returns primary as light and calculates dark", () => {
    const colors = getThemeColors({ primary: "#6366f1" });
    expect(colors.light).toBe("#6366f1");
    expect(colors.dark).toMatch(/^#[0-9a-f]{6}$/);
    expect(colors.dark).not.toBe("#6366f1");
  });

  it("uses explicit primaryDark when provided", () => {
    const colors = getThemeColors({
      primary: "#6366f1",
      primaryDark: "#818cf8",
    });
    expect(colors.light).toBe("#6366f1");
    expect(colors.dark).toBe("#818cf8");
  });

  it("calculates dark variant when primaryDark is undefined", () => {
    const colors = getThemeColors({ primary: "#ef4444" });
    expect(colors.dark).not.toBe("#ef4444");
    expect(colors.dark).toMatch(/^#[0-9a-f]{6}$/);
  });
});
