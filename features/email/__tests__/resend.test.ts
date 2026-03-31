import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";

const { mockSend } = vi.hoisted(() => ({ mockSend: vi.fn() }));

vi.mock("resend", () => ({
  Resend: class { emails = { send: mockSend }; },
}));

vi.mock("../lib/config", () => ({
  emailConfig: { apiKey: "re_test", from: "test@example.com" },
  isEmailEnabled: true,
}));

import { sendEmail } from "../lib/resend";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("sendEmail", () => {
  it("sends email and returns id", async () => {
    mockSend.mockResolvedValue({ data: { id: "msg-1" }, error: null });
    const result = await sendEmail({
      to: "user@example.com",
      subject: "Hello",
      react: React.createElement("div", null, "Hi"),
    });
    expect(result).toEqual({ success: true, id: "msg-1" });
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({ from: "test@example.com", to: ["user@example.com"] }),
    );
  });

  it("returns error on send failure", async () => {
    mockSend.mockResolvedValue({ data: null, error: { message: "fail" } });
    const result = await sendEmail({
      to: "a@b.com",
      subject: "Fail",
      react: React.createElement("div"),
    });
    expect(result.success).toBe(false);
  });

  it("handles array recipients", async () => {
    mockSend.mockResolvedValue({ data: { id: "msg-2" }, error: null });
    await sendEmail({
      to: ["a@b.com", "c@d.com"],
      subject: "Multi",
      react: React.createElement("div"),
    });
    expect(mockSend.mock.calls[0][0].to).toEqual(["a@b.com", "c@d.com"]);
  });

  it("passes replyTo", async () => {
    mockSend.mockResolvedValue({ data: { id: "msg-3" }, error: null });
    await sendEmail({
      to: "a@b.com",
      subject: "Reply",
      react: React.createElement("div"),
      replyTo: "reply@b.com",
    });
    expect(mockSend.mock.calls[0][0].replyTo).toBe("reply@b.com");
  });
});
