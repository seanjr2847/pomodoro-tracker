import { describe, it, expect } from "vitest";
import { feedbackSchema } from "../lib/schema";

describe("feedbackSchema", () => {
  it("accepts valid feedback", () => {
    const result = feedbackSchema.safeParse({
      type: "bug",
      message: "This is a bug report with enough chars",
    });
    expect(result.success).toBe(true);
  });

  it("accepts all feedback types", () => {
    for (const type of ["bug", "feature", "general"] as const) {
      const result = feedbackSchema.safeParse({
        type,
        message: "A valid message here",
      });
      expect(result.success).toBe(true);
    }
  });

  it("rejects invalid feedback type", () => {
    const result = feedbackSchema.safeParse({
      type: "invalid",
      message: "A valid message here",
    });
    expect(result.success).toBe(false);
  });

  it("rejects message shorter than 10 characters", () => {
    const result = feedbackSchema.safeParse({
      type: "general",
      message: "short",
    });
    expect(result.success).toBe(false);
  });

  it("accepts exactly 10 character message", () => {
    const result = feedbackSchema.safeParse({
      type: "general",
      message: "1234567890",
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid optional email", () => {
    const result = feedbackSchema.safeParse({
      type: "general",
      message: "A valid message here",
      email: "user@example.com",
    });
    expect(result.success).toBe(true);
  });

  it("accepts empty string email", () => {
    const result = feedbackSchema.safeParse({
      type: "general",
      message: "A valid message here",
      email: "",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email format", () => {
    const result = feedbackSchema.safeParse({
      type: "general",
      message: "A valid message here",
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("accepts omitted email", () => {
    const result = feedbackSchema.safeParse({
      type: "bug",
      message: "No email provided here",
    });
    expect(result.success).toBe(true);
  });
});
