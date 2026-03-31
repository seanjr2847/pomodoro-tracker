import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    subscription: { upsert: vi.fn(), findUnique: vi.fn() },
    user: { findUnique: vi.fn() },
  },
}));

vi.mock("@/features/database", () => ({ prisma: mockPrisma }));

import {
  upsertSubscription,
  getSubscriptionByUserId,
  findUserByEmail,
} from "../lib/subscription";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("upsertSubscription", () => {
  it("upserts with all fields", async () => {
    const end = new Date("2026-12-31");
    mockPrisma.subscription.upsert.mockResolvedValue({ id: "sub-1" });
    await upsertSubscription({
      userId: "user-1",
      paddleSubscriptionId: "paddle-123",
      paddleCustomerId: "cust-456",
      plan: "pro",
      status: "active",
      currentPeriodEnd: end,
    });
    expect(mockPrisma.subscription.upsert).toHaveBeenCalledWith({
      where: { paddleSubscriptionId: "paddle-123" },
      update: expect.objectContaining({ status: "active", plan: "pro" }),
      create: expect.objectContaining({
        userId: "user-1",
        paddleSubscriptionId: "paddle-123",
        paddleCustomerId: "cust-456",
      }),
    });
  });

  it("handles optional fields as undefined", async () => {
    mockPrisma.subscription.upsert.mockResolvedValue({ id: "sub-2" });
    await upsertSubscription({
      userId: "user-1",
      paddleSubscriptionId: "paddle-789",
      plan: "free",
      status: "trialing",
    });
    const call = mockPrisma.subscription.upsert.mock.calls[0][0];
    expect(call.update.paddleCustomerId).toBeUndefined();
    expect(call.update.currentPeriodEnd).toBeUndefined();
  });
});

describe("getSubscriptionByUserId", () => {
  it("queries by userId", async () => {
    mockPrisma.subscription.findUnique.mockResolvedValue({ plan: "pro" });
    const result = await getSubscriptionByUserId("user-1");
    expect(result).toEqual({ plan: "pro" });
  });

  it("returns null for non-existent user", async () => {
    mockPrisma.subscription.findUnique.mockResolvedValue(null);
    expect(await getSubscriptionByUserId("no-one")).toBeNull();
  });
});

describe("findUserByEmail", () => {
  it("queries by email", async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: "user-1", email: "a@b.com" });
    const result = await findUserByEmail("a@b.com");
    expect(result).toEqual({ id: "user-1", email: "a@b.com" });
  });

  it("returns null for unknown email", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    expect(await findUserByEmail("no@one.com")).toBeNull();
  });
});
