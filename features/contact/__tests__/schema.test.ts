import { describe, it, expect } from "vitest";
import { contactSchema } from "../lib/schema";

describe("contactSchema", () => {
  const valid = {
    name: "John Doe",
    email: "john@example.com",
    subject: "Hello there",
    message: "This is a test message with more than twenty characters.",
  };

  it("accepts valid contact data", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects name shorter than 2 chars", () => {
    expect(contactSchema.safeParse({ ...valid, name: "J" }).success).toBe(false);
  });

  it("rejects invalid email", () => {
    expect(contactSchema.safeParse({ ...valid, email: "bad" }).success).toBe(false);
  });

  it("rejects subject shorter than 5 chars", () => {
    expect(contactSchema.safeParse({ ...valid, subject: "Hi" }).success).toBe(false);
  });

  it("rejects message shorter than 20 chars", () => {
    expect(contactSchema.safeParse({ ...valid, message: "Too short" }).success).toBe(false);
  });

  it("accepts exactly min-length values", () => {
    const result = contactSchema.safeParse({
      name: "AB",
      email: "a@b.co",
      subject: "12345",
      message: "12345678901234567890",
    });
    expect(result.success).toBe(true);
  });
});
