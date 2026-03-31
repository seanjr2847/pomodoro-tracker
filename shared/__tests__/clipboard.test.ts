import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

import { copyToClipboard } from "@/shared/utils/clipboard";
import { toast } from "sonner";

describe("copyToClipboard", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
  });

  it("copies text and shows success toast", async () => {
    const result = await copyToClipboard("hello");
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("hello");
    expect(toast.success).toHaveBeenCalledWith("Copied to clipboard");
    expect(result).toBe(true);
  });

  it("uses custom success message", async () => {
    await copyToClipboard("key", "API key copied");
    expect(toast.success).toHaveBeenCalledWith("API key copied");
  });

  it("shows error toast on failure", async () => {
    vi.mocked(navigator.clipboard.writeText).mockRejectedValue(
      new Error("denied"),
    );
    const result = await copyToClipboard("text");
    expect(toast.error).toHaveBeenCalledWith("Failed to copy");
    expect(result).toBe(false);
  });
});
