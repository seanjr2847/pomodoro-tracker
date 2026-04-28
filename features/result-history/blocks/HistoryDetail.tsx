"use client";

import { Copy, RefreshCw } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";
import { copyToClipboard } from "@/shared/utils/clipboard";
import type { HistoryItem } from "../types";

interface HistoryDetailProps {
  item: HistoryItem;
  onRegenerate?: () => void;
  children?: React.ReactNode;
}

export function HistoryDetail({ item, onRegenerate, children }: HistoryDetailProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{item.title}</CardTitle>
        <p className="text-xs text-muted-foreground">
          {item.createdAt.toLocaleString()}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="mb-1 text-xs font-medium uppercase text-muted-foreground">Input</p>
          <div className="rounded-lg bg-muted/50 p-3 text-sm">
            {typeof item.input === "string" ? item.input : JSON.stringify(item.input)}
          </div>
        </div>
        <div>
          <p className="mb-1 text-xs font-medium uppercase text-muted-foreground">Output</p>
          <div className="whitespace-pre-wrap rounded-lg bg-muted/50 p-3 text-sm">
            {item.output}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => copyToClipboard(item.output)}>
            <Copy className="mr-1 h-3 w-3" /> Copy
          </Button>
          {onRegenerate && (
            <Button variant="outline" size="sm" onClick={onRegenerate}>
              <RefreshCw className="mr-1 h-3 w-3" /> Regenerate
            </Button>
          )}
          {children}
        </div>
      </CardContent>
    </Card>
  );
}
