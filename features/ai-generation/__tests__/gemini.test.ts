import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockGenerateContent, mockGenerateContentStream, mockGetGenerativeModel } = vi.hoisted(() => {
  const mockGenerateContent = vi.fn();
  const mockGenerateContentStream = vi.fn();
  const mockGetGenerativeModel = vi.fn(() => ({
    generateContent: mockGenerateContent,
    generateContentStream: mockGenerateContentStream,
  }));
  return { mockGenerateContent, mockGenerateContentStream, mockGetGenerativeModel };
});

vi.mock("@google/generative-ai", () => ({
  GoogleGenerativeAI: class { getGenerativeModel = mockGetGenerativeModel; },
}));

import { generateText, streamText, isAIEnabled } from "../lib/gemini";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("generateText", () => {
  it("calls Gemini with default model and returns text", async () => {
    mockGenerateContent.mockResolvedValue({
      response: { text: () => "Hello from Gemini" },
    });
    const result = await generateText("test prompt");
    expect(result).toBe("Hello from Gemini");
    expect(mockGetGenerativeModel).toHaveBeenCalledWith(
      expect.objectContaining({ model: "gemini-2.0-flash" }),
    );
  });

  it("uses custom model and system prompt", async () => {
    mockGenerateContent.mockResolvedValue({
      response: { text: () => "custom" },
    });
    await generateText("prompt", { model: "gemini-pro", systemPrompt: "be helpful" });
    expect(mockGetGenerativeModel).toHaveBeenCalledWith(
      expect.objectContaining({ model: "gemini-pro", systemInstruction: "be helpful" }),
    );
  });
});

describe("streamText", () => {
  it("yields chunks from stream", async () => {
    const chunks = [{ text: () => "Hello " }, { text: () => "World" }];
    mockGenerateContentStream.mockResolvedValue({
      stream: (async function* () {
        for (const c of chunks) yield c;
      })(),
    });
    const result: string[] = [];
    for await (const chunk of streamText("test")) {
      result.push(chunk);
    }
    expect(result).toEqual(["Hello ", "World"]);
  });
});

describe("isAIEnabled", () => {
  it("exports boolean flag", () => {
    expect(typeof isAIEnabled).toBe("boolean");
  });
});
