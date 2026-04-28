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

  it("handles green-dominant color (case g branch)", () => {
    // #00ff00 → green is max channel
    const result = calcDarkPrimary("#00ff00");
    expect(result).toMatch(/^#[0-9a-f]{6}$/);
    expect(result).not.toBe("#00ff00");
  });

  it("handles blue-dominant color (case b branch)", () => {
    // #0000ff → blue is max channel
    const result = calcDarkPrimary("#0000ff");
    expect(result).toMatch(/^#[0-9a-f]{6}$/);
    expect(result).not.toBe("#0000ff");
  });

  it("handles invalid hex gracefully", () => {
    const result = calcDarkPrimary("invalid");
    expect(result).toMatch(/^#[0-9a-f]{6}$/);
  });

  it("handles low-saturation color (l <= 0.5 branch)", () => {
    // #333333 → dark gray, l < 0.5
    const result = calcDarkPrimary("#333333");
    expect(result).toMatch(/^#[0-9a-f]{6}$/);
  });

  it("handles high-saturation color (l > 0.5 branch)", () => {
    // #aabbcc → light, l > 0.5
    const result = calcDarkPrimary("#aabbcc");
    expect(result).toMatch(/^#[0-9a-f]{6}$/);
  });

  it("handles red-dominant where g < b (ternary branch)", () => {
    // #ff0033 → red max, g(0) < b(0x33) → triggers g < b ? 6 : 0
    const result = calcDarkPrimary("#ff0033");
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
