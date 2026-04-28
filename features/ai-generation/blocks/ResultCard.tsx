"use client";

import { Copy, RefreshCw, Save } from "lucide-react";
import { Button, Card, CardContent } from "@/shared/ui";
import { copyToClipboard } from "@/shared/utils/clipboard";

interface ResultCardProps {
  result: string;
  onRegenerate?: () => void;
  onSave?: () => void;
  children?: React.ReactNode;
}

export function ResultCard({ result, onRegenerate, onSave, children }: ResultCardProps) {
  return (
    <Card>
      <CardContent className="space-y-3 pt-4">
        <div className="whitespace-pre-wrap text-sm">{result}</div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => copyToClipboard(result)}>
            <Copy className="mr-1 h-3 w-3" /> Copy
          </Button>
          {onRegenerate && (
            <Button variant="outline" size="sm" onClick={onRegenerate}>
              <RefreshCw className="mr-1 h-3 w-3" /> Regenerate
            </Button>
          )}
          {onSave && (
            <Button variant="outline" size="sm" onClick={onSave}>
              <Save className="mr-1 h-3 w-3" /> Save
            </Button>
          )}
          {children}
        </div>
      </CardContent>
    </Card>
  );
}
