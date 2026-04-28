"use client";

import { Square } from "lucide-react";
import { Button } from "@/shared/ui";

interface StreamingTextProps {
  text: string;
  isStreaming?: boolean;
  onCancel?: () => void;
}

export function StreamingText({ text, isStreaming = true, onCancel }: StreamingTextProps) {
  return (
    <div className="space-y-2">
      <div className="whitespace-pre-wrap rounded-lg border bg-muted/50 p-4 text-sm">
        {text}
        {isStreaming && <span className="ml-0.5 inline-block h-4 w-1 animate-pulse bg-foreground" />}
      </div>
      {isStreaming && onCancel && (
        <Button variant="outline" size="sm" onClick={onCancel}>
          <Square className="mr-1 h-3 w-3" /> Stop
        </Button>
      )}
    </div>
  );
}
