import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/features/auth", () => ({
  auth: vi.fn(),
}));

import { requireRole } from "../lib/requireRole";
import { auth } from "@/features/auth";

const mockAuth = vi.mocked(auth);

describe("requireRole", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns Unauthorized when no session", async () => {
    mockAuth.mockResolvedValue(null);
    const result = await requireRole("USER");
    expect(result).toEqual({ success: false, error: "Unauthorized" });
  });

  it("returns Unauthorized when session has no user id", async () => {
    mockAuth.mockResolvedValue({ user: {}, expires: "" } as never);
    const result = await requireRole("USER");
    expect(result).toEqual({ success: false, error: "Unauthorized" });
  });

  it("returns success for matching role", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "u1", role: "ADMIN" },
      expires: "",
    } as never);
    const result = await requireRole("ADMIN");
    expect(result).toEqual({ success: true, userId: "u1", role: "ADMIN" });
  });

  it("returns Forbidden when role does not match", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "u2", role: "USER" },
      expires: "",
    } as never);
    const result = await requireRole("ADMIN");
    expect(result).toEqual({ success: false, error: "Forbidden" });
  });

  it("defaults to USER role when not set", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "u3" },
      expires: "",
    } as never);
    const result = await requireRole("USER");
    expect(result).toEqual({ success: true, userId: "u3", role: "USER" });
  });

  it("accepts multiple allowed roles", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "u4", role: "ADMIN" },
      expires: "",
    } as never);
    const result = await requireRole("USER", "ADMIN");
    expect(result).toEqual({ success: true, userId: "u4", role: "ADMIN" });
  });
});
