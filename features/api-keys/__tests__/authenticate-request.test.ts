import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock dependencies before importing
vi.mock("@/features/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("../lib/apiKeys", () => ({
  validateApiKey: vi.fn(),
}));

import { authenticateRequest } from "../lib/authenticateRequest";
import { auth } from "@/features/auth";
import { validateApiKey } from "../lib/apiKeys";

const mockAuth = vi.mocked(auth);
const mockValidateApiKey = vi.mocked(validateApiKey);

function createRequest(headers: Record<string, string> = {}): Request {
  return {
    headers: new Headers(headers),
  } as unknown as Request;
}

describe("authenticateRequest", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns session auth when session exists", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "user-1", email: "test@test.com", role: "ADMIN" },
      expires: "",
    } as never);

    const result = await authenticateRequest(createRequest());
    expect(result).toEqual({
      userId: "user-1",
      user: { id: "user-1", email: "test@test.com", role: "ADMIN" },
      method: "session",
    });
    expect(mockValidateApiKey).not.toHaveBeenCalled();
  });

  it("defaults role to USER when session has no role", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "user-2", email: "no-role@test.com" },
      expires: "",
    } as never);

    const result = await authenticateRequest(createRequest());
    expect(result).toEqual({
      userId: "user-2",
      user: { id: "user-2", email: "no-role@test.com", role: "USER" },
      method: "session",
    });
  });

  it("falls back to API key when no session", async () => {
    mockAuth.mockResolvedValue(null as never);
    mockValidateApiKey.mockResolvedValue({
      userId: "user-3",
      user: { id: "user-3", email: "api@test.com", role: "USER" },
    });

    const result = await authenticateRequest(
      createRequest({ "X-API-Key": "sk_test_123" })
    );
    expect(result).toEqual({
      userId: "user-3",
      user: { id: "user-3", email: "api@test.com", role: "USER" },
      method: "api-key",
    });
    expect(mockValidateApiKey).toHaveBeenCalledWith("sk_test_123");
  });

  it("defaults API key user role to USER when null", async () => {
    mockAuth.mockResolvedValue(null as never);
    mockValidateApiKey.mockResolvedValue({
      userId: "user-4",
      user: { id: "user-4", email: "api2@test.com", role: null as never },
    });

    const result = await authenticateRequest(
      createRequest({ "X-API-Key": "sk_test_456" })
    );
    expect(result!.user.role).toBe("USER");
  });

  it("returns null when no session and no API key header", async () => {
    mockAuth.mockResolvedValue(null as never);

    const result = await authenticateRequest(createRequest());
    expect(result).toBeNull();
    expect(mockValidateApiKey).not.toHaveBeenCalled();
  });

  it("returns null when API key is invalid", async () => {
    mockAuth.mockResolvedValue(null as never);
    mockValidateApiKey.mockResolvedValue(null);

    const result = await authenticateRequest(
      createRequest({ "X-API-Key": "invalid" })
    );
    expect(result).toBeNull();
  });

  it("prefers session auth over API key", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "session-user", email: "s@t.com" },
      expires: "",
    } as never);
    mockValidateApiKey.mockResolvedValue({
      userId: "api-user",
      user: { id: "api-user", email: "a@t.com", role: "USER" },
    });

    const result = await authenticateRequest(
      createRequest({ "X-API-Key": "sk_test" })
    );
    expect(result!.method).toBe("session");
    expect(result!.userId).toBe("session-user");
    expect(mockValidateApiKey).not.toHaveBeenCalled();
  });
});
