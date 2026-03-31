import { NextResponse } from "next/server";
import { streamText, isAIEnabled } from "@/features/ai-generation/lib/gemini";

export async function POST(request: Request) {
  if (!isAIEnabled) {
    return NextResponse.json(
      { error: "AI generation is not configured. Set GEMINI_API_KEY." },
      { status: 503 },
    );
  }

  const { prompt, model, systemPrompt } = await request.json();

  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ error: "prompt is required" }, { status: 400 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of streamText(prompt, { model, systemPrompt })) {
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
