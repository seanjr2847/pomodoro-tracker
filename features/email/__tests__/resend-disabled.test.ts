import { describe, it, expect, vi } from "vitest";
import React from "react";

vi.mock("resend", () => ({
  Resend: class { emails = { send: vi.fn() }; },
}));

vi.mock("../lib/config", () => ({
  emailConfig: { apiKey: "", from: "test@example.com" },
  isEmailEnabled: false,
}));

import { sendEmail } from "../lib/resend";

describe("sendEmail — disabled", () => {
  it("skips sending and logs to console", async () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    const result = await sendEmail({
      to: "a@b.com",
      subject: "Skip",
      react: React.createElement("div"),
    });
    expect(result).toEqual({ success: true, skipped: true });
    expect(spy).toHaveBeenCalledWith(
      "[email] Resend disabled — skipping:",
      expect.objectContaining({ to: "a@b.com" }),
    );
    spy.mockRestore();
  });
});
