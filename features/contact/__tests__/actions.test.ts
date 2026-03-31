import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockSendEmail } = vi.hoisted(() => ({ mockSendEmail: vi.fn() }));

vi.mock("@/config/site", () => ({
  siteConfig: { email: "team@example.com" },
}));

vi.mock("@/features/email", () => ({
  sendEmail: mockSendEmail,
  ContactEmail: vi.fn(() => "react-element"),
}));

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
  it("sends email and returns success", async () => {
    mockSendEmail.mockResolvedValue({ success: true, id: "msg-1" });
    const result = await submitContactAction(validData);
    expect(result).toEqual({ success: true });
    expect(mockSendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "team@example.com",
        subject: "[Contact] Hello there",
        replyTo: "john@example.com",
      }),
    );
  });

  it("returns error on invalid data", async () => {
    const result = await submitContactAction({ ...validData, email: "bad" });
    expect(result).toEqual({ success: false, error: "Invalid form data" });
    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  it("returns error when email send fails", async () => {
    mockSendEmail.mockResolvedValue({ success: false, error: "smtp error" });
    const result = await submitContactAction(validData);
    expect(result).toEqual({ success: false, error: "Failed to send message" });
  });
});
