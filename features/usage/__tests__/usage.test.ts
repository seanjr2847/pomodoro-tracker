import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    usageRecord: { create: vi.fn(), aggregate: vi.fn(), findMany: vi.fn() },
  },
}));

vi.mock("@/features/database", () => ({ prisma: mockPrisma }));

import {
  recordUsage,
  getMonthlyUsage,
  getUsageHistory,
  checkUsageLimit,
  PLAN_LIMITS,
} from "../lib/usage";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("PLAN_LIMITS", () => {
  it("defines free and pro limits", () => {
    expect(PLAN_LIMITS.free).toEqual({ requests: 100, tokens: 10_000 });
    expect(PLAN_LIMITS.pro).toEqual({ requests: 10_000, tokens: 1_000_000 });
  });
});

describe("recordUsage", () => {
  it("creates a usage record with defaults", async () => {
    mockPrisma.usageRecord.create.mockResolvedValue({ id: "1" });
    await recordUsage("user-1", "chat");
    expect(mockPrisma.usageRecord.create).toHaveBeenCalledWith({
      data: { userId: "user-1", action: "chat", tokens: 0, cost: 0, metadata: undefined },
    });
  });

  it("passes custom tokens, cost, and metadata", async () => {
    mockPrisma.usageRecord.create.mockResolvedValue({ id: "2" });
    await recordUsage("user-1", "generate", 500, 0.02, "gpt-4");
    expect(mockPrisma.usageRecord.create).toHaveBeenCalledWith({
      data: { userId: "user-1", action: "generate", tokens: 500, cost: 0.02, metadata: "gpt-4" },
    });
  });
});

describe("getMonthlyUsage", () => {
  it("aggregates monthly records", async () => {
    mockPrisma.usageRecord.aggregate.mockResolvedValue({
      _count: 42, _sum: { tokens: 5000, cost: 1.5 },
    });
    const usage = await getMonthlyUsage("user-1");
    expect(usage).toEqual({ requests: 42, tokens: 5000, cost: 1.5 });
  });

  it("handles null sums as zero", async () => {
    mockPrisma.usageRecord.aggregate.mockResolvedValue({
      _count: 0, _sum: { tokens: null, cost: null },
    });
    const usage = await getMonthlyUsage("user-1");
    expect(usage).toEqual({ requests: 0, tokens: 0, cost: 0 });
  });
});

describe("getUsageHistory", () => {
  it("fetches recent records", async () => {
    const records = [{ id: "1", action: "chat" }];
    mockPrisma.usageRecord.findMany.mockResolvedValue(records);
    const result = await getUsageHistory("user-1", 7);
    expect(result).toEqual(records);
    expect(mockPrisma.usageRecord.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { createdAt: "desc" }, take: 100 }),
    );
  });
});

describe("checkUsageLimit", () => {
  it("allows usage under free limits", async () => {
    mockPrisma.usageRecord.aggregate.mockResolvedValue({
      _count: 10, _sum: { tokens: 1000, cost: 0.5 },
    });
    const result = await checkUsageLimit("user-1", "free");
    expect(result.allowed).toBe(true);
    expect(result.requestsRemaining).toBe(90);
    expect(result.tokensRemaining).toBe(9000);
  });

  it("blocks usage over request limit", async () => {
    mockPrisma.usageRecord.aggregate.mockResolvedValue({
      _count: 101, _sum: { tokens: 500, cost: 0.1 },
    });
    const result = await checkUsageLimit("user-1", "free");
    expect(result.allowed).toBe(false);
    expect(result.requestsRemaining).toBe(0);
  });

  it("blocks usage over token limit", async () => {
    mockPrisma.usageRecord.aggregate.mockResolvedValue({
      _count: 5, _sum: { tokens: 11_000, cost: 5.0 },
    });
    const result = await checkUsageLimit("user-1", "free");
    expect(result.allowed).toBe(false);
    expect(result.tokensRemaining).toBe(0);
  });

  it("applies pro plan limits", async () => {
    mockPrisma.usageRecord.aggregate.mockResolvedValue({
      _count: 500, _sum: { tokens: 50_000, cost: 10.0 },
    });
    const result = await checkUsageLimit("user-1", "pro");
    expect(result.allowed).toBe(true);
    expect(result.limits).toEqual(PLAN_LIMITS.pro);
  });
});
