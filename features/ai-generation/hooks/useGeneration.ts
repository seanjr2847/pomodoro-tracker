"use client";

import { useState, useCallback } from "react";
import type { GenerationStatus } from "../types";

interface UseGenerationOptions {
  apiEndpoint?: string;
}

export function useGeneration({ apiEndpoint = "/api/generate" }: UseGenerationOptions = {}) {
  const [result, setResult] = useState<string | null>(null);
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [error, setError] = useState<Error | null>(null);

  const generate = useCallback(
    async (input: string) => {
      setStatus("loading");
      setError(null);
      setResult(null);

      try {
        const res = await fetch(apiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: input }),
        });

        if (!res.ok) {
          throw new Error((await res.json().catch(() => null))?.error ?? res.statusText);
        }

        if (!res.body) {
          const data = await res.json();
          setResult(data.text);
          setStatus("done");
          return;
        }

        // Streaming response
        setStatus("streaming");
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          setResult(accumulated);
        }
        setStatus("done");
      } catch (e) {
        setError(e instanceof Error ? e : new Error(String(e)));
        setStatus("error");
      }
    },
    [apiEndpoint],
  );

  const reset = useCallback(() => {
    setResult(null);
    setStatus("idle");
    setError(null);
  }, []);

  return { generate, result, status, error, reset };
}
