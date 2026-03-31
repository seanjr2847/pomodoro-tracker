import { describe, it, expect, vi, beforeEach } from "vitest";
import { createHmac } from "crypto";

// Mock paddleConfig before importing the function
vi.mock("@/features/billing/config/paddle", () => ({
  paddleConfig: {
    apiKey: "test-api-key",
    webhookSecret: "test-webhook-secret",
  },
}));

import { verifyPaddleSignature } from "@/features/billing/api/webhook";

function createValidSignature(body: string, secret: string, ts = String(Math.floor(Date.now() / 1000))) {
  const payload = `${ts}:${body}`;
  const hash = createHmac("sha256", secret).update(payload).digest("hex");
  return `ts=${ts};h1=${hash}`;
}

describe("verifyPaddleSignature", () => {
  it("returns true for a valid signature", () => {
    const body = '{"event_type":"subscription.created"}';
    const signature = createValidSignature(body, "test-webhook-secret");
    expect(verifyPaddleSignature(body, signature)).toBe(true);
  });

  it("returns false for an invalid hash", () => {
    const body = '{"event_type":"subscription.created"}';
    const signature = `ts=${Math.floor(Date.now() / 1000)};h1=invalidhash`;
    expect(verifyPaddleSignature(body, signature)).toBe(false);
  });

  it("returns false for null signature", () => {
    expect(verifyPaddleSignature("body", null)).toBe(false);
  });

  it("returns false for empty signature string", () => {
    expect(verifyPaddleSignature("body", "")).toBe(false);
  });

  it("returns false when signature is missing ts", () => {
    expect(verifyPaddleSignature("body", "h1=abc123")).toBe(false);
  });

  it("returns false when signature is missing h1", () => {
    expect(verifyPaddleSignature("body", "ts=123")).toBe(false);
  });

  it("returns false when body is tampered", () => {
    const body = '{"event_type":"subscription.created"}';
    const signature = createValidSignature(body, "test-webhook-secret");
    expect(verifyPaddleSignature(body + "tampered", signature)).toBe(false);
  });

  it("returns false when secret is wrong", () => {
    const body = '{"data":"test"}';
    const signature = createValidSignature(body, "wrong-secret");
    expect(verifyPaddleSignature(body, signature)).toBe(false);
  });

  it("returns false for timestamps older than 5 minutes (replay protection)", () => {
    const body = '{"event_type":"subscription.created"}';
    const oldTs = String(Math.floor(Date.now() / 1000) - 600); // 10 min ago
    const signature = createValidSignature(body, "test-webhook-secret", oldTs);
    expect(verifyPaddleSignature(body, signature)).toBe(false);
  });

  it("returns true for recent timestamps within 5 minutes", () => {
    const body = '{"event_type":"subscription.created"}';
    const recentTs = String(Math.floor(Date.now() / 1000) - 60); // 1 min ago
    const signature = createValidSignature(body, "test-webhook-secret", recentTs);
    expect(verifyPaddleSignature(body, signature)).toBe(true);
  });
});
