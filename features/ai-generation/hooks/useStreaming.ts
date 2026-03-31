"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export function useStreaming(stream: ReadableStream<Uint8Array> | null) {
  const [text, setText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!stream) return;

    const controller = new AbortController();
    abortRef.current = controller;
    setIsStreaming(true);
    setText("");

    const decoder = new TextDecoder();
    const reader = stream.getReader();

    (async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done || controller.signal.aborted) break;
          setText((prev) => prev + decoder.decode(value, { stream: true }));
        }
      } finally {
        setIsStreaming(false);
        reader.releaseLock();
      }
    })();

    return () => {
      controller.abort();
      reader.releaseLock();
    };
  }, [stream]);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
  }, []);

  return { text, isStreaming, cancel };
}
