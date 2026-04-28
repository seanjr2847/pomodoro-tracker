import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY ?? "";

export const isAIEnabled = apiKey.length > 0;

let client: GoogleGenerativeAI | null = null;

function getClient() {
  if (!client) client = new GoogleGenerativeAI(apiKey);
  return client;
}

export async function generateText(
  prompt: string,
  opts?: { model?: string; systemPrompt?: string },
) {
  const model = getClient().getGenerativeModel({
    model: opts?.model ?? "gemini-2.0-flash",
    systemInstruction: opts?.systemPrompt,
  });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function* streamText(
  prompt: string,
  opts?: { model?: string; systemPrompt?: string },
) {
  const model = getClient().getGenerativeModel({
    model: opts?.model ?? "gemini-2.0-flash",
    systemInstruction: opts?.systemPrompt,
  });
  const result = await model.generateContentStream(prompt);
  for await (const chunk of result.stream) {
    yield chunk.text();
  }
}
