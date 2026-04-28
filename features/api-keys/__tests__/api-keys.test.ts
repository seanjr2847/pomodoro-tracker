import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    apiKey: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
  },
}));

vi.mock("@/features/database", () => ({ prisma: mockPrisma }));

import {
  generateApiKey,
  hashKey,
  createApiKey,
  listApiKeys,
  revokeApiKey,
  validateApiKey,
} from "../lib/apiKeys";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("generateApiKey", () => {
  it("returns raw key with sk_ prefix and hash", () => {
    const { raw, hash } = generateApiKey();
    expect(raw).toMatch(/^sk_[a-f0-9]{48}$/);
    expect(hash).toHaveLength(64); // SHA-256 hex
  });

  it("generates unique keys", () => {
    const a = generateApiKey();
    const b = generateApiKey();
    expect(a.raw).not.toBe(b.raw);
  });
});

describe("hashKey", () => {
  it("returns consistent SHA-256 hash", () => {
    const hash1 = hashKey("sk_test123");
    const hash2 = hashKey("sk_test123");
    expect(hash1).toBe(hash2);
    expect(hash1).toHaveLength(64);
  });

  it("different inputs produce different hashes", () => {
    expect(hashKey("sk_a")).not.toBe(hashKey("sk_b"));
  });
});

describe("createApiKey", () => {
  it("creates key in DB and returns rawKey", async () => {
    mockPrisma.apiKey.create.mockResolvedValue({ id: "key-1", name: "test" });
    const result = await createApiKey("user-1", "test");
    expect(result.rawKey).toMatch(/^sk_/);
    expect(mockPrisma.apiKey.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ userId: "user-1", name: "test" }),
    });
  });
});

describe("listApiKeys", () => {
  it("lists non-revoked keys", async () => {
    mockPrisma.apiKey.findMany.mockResolvedValue([{ id: "1" }]);
    const result = await listApiKeys("user-1");
    expect(result).toEqual([{ id: "1" }]);
    expect(mockPrisma.apiKey.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: "user-1", revoked: false } }),
    );
  });
});

describe("revokeApiKey", () => {
  it("marks key as revoked", async () => {
    mockPrisma.apiKey.updateMany.mockResolvedValue({ count: 1 });
    await revokeApiKey("user-1", "key-1");
    expect(mockPrisma.apiKey.updateMany).toHaveBeenCalledWith({
      where: { id: "key-1", userId: "user-1" },
      data: { revoked: true },
    });
  });
});

describe("validateApiKey", () => {
  it("returns user for valid key", async () => {
    const hash = hashKey("sk_testkey");
    mockPrisma.apiKey.findUnique.mockResolvedValue({
      id: "key-1",
      userId: "user-1",
      revoked: false,
      expiresAt: null,
      user: { id: "user-1", email: "a@b.com", role: "USER" },
    });
    mockPrisma.apiKey.update.mockResolvedValue({});

    const result = await validateApiKey("sk_testkey");
    expect(result).toEqual({
      userId: "user-1",
      user: { id: "user-1", email: "a@b.com", role: "USER" },
    });
  });

  it("returns null for revoked key", async () => {
    mockPrisma.apiKey.findUnique.mockResolvedValue({ revoked: true });
    expect(await validateApiKey("sk_revoked")).toBeNull();
  });

  it("returns null for expired key", async () => {
    mockPrisma.apiKey.findUnique.mockResolvedValue({
      revoked: false,
      expiresAt: new Date("2020-01-01"),
    });
    expect(await validateApiKey("sk_expired")).toBeNull();
  });

  it("returns null when key not found", async () => {
    mockPrisma.apiKey.findUnique.mockResolvedValue(null);
    expect(await validateApiKey("sk_missing")).toBeNull();
  });
});
