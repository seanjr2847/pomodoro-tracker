// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";

const { mockSave, mockAddImage, mockGetWidth } = vi.hoisted(() => ({
  mockSave: vi.fn(),
  mockAddImage: vi.fn(),
  mockGetWidth: vi.fn(() => 210),
}));

vi.mock("html2canvas", () => ({
  default: vi.fn(() =>
    Promise.resolve({
      toDataURL: () => "data:image/png;base64,abc",
      height: 1000,
      width: 800,
    }),
  ),
}));

vi.mock("jspdf", () => ({
  jsPDF: class {
    internal = { pageSize: { getWidth: mockGetWidth } };
    addImage = mockAddImage;
    save = mockSave;
  },
}));

import { exportToPdf } from "../lib/pdf";

describe("exportToPdf", () => {
  it("generates and saves PDF from element", async () => {
    const el = document.createElement("div");
    await exportToPdf(el, "test.pdf");
    expect(mockAddImage).toHaveBeenCalledWith(
      "data:image/png;base64,abc", "PNG", 10, 10, 190, expect.any(Number),
    );
    expect(mockSave).toHaveBeenCalledWith("test.pdf");
  });

  it("uses default filename", async () => {
    const el = document.createElement("div");
    await exportToPdf(el);
    expect(mockSave).toHaveBeenCalledWith("export.pdf");
  });
});
