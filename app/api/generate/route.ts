import { NextResponse } from "next/server";
import { authenticateRequest } from "@/features/api-keys";
import { streamText, isAIEnabled } from "@/features/ai-generation";

export async function POST(request: Request) {
  const authResult = await authenticateRequest(request);
  if (!authResult) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isAIEnabled) {
    return NextResponse.json(
      { error: "AI generation is not configured. Set GEMINI_API_KEY." },
      { status: 503 },
    );
  }

  let body: { prompt?: unknown; model?: unknown; systemPrompt?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { prompt, model, systemPrompt } = body;

  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ error: "prompt is required" }, { status: 400 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of streamText(prompt, { model: model as string | undefined, systemPrompt: systemPrompt as string | undefined })) {
          controller.enqueue(encoder.encode(chunk));
        }
      } catch (e) {
        controller.enqueue(
          encoder.encode(`\n\n[Error: ${e instanceof Error ? e.message : "Generation failed"}]`),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}
