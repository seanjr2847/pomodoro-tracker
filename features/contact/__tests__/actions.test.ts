import { describe, it, expect, vi, beforeEach } from "vitest";

import { submitContactAction } from "../lib/actions";

beforeEach(() => {
  vi.clearAllMocks();
});

const validData = {
  name: "John Doe",
  email: "john@example.com",
  subject: "Hello there",
  message: "This is a test message that is long enough to pass validation.",
};

describe("submitContactAction", () => {
  it("returns success for valid data", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const result = await submitContactAction(validData);
    expect(result).toEqual({ success: true, data: undefined });
    expect(consoleSpy).toHaveBeenCalledWith(
      "[contact] Message received:",
      expect.objectContaining({
        name: "John Doe",
        email: "john@example.com",
        subject: "Hello there",
      }),
    );
    consoleSpy.mockRestore();
  });

  it("returns error on invalid data", async () => {
    const result = await submitContactAction({ ...validData, email: "bad" });
    expect(result).toEqual({ success: false, error: "Invalid form data" });
  });
});
