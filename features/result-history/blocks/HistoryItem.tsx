"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/shared/ui";
import type { HistoryItem as HistoryItemType } from "../types";

interface HistoryItemProps {
  item: HistoryItemType;
  onClick?: (item: HistoryItemType) => void;
  onDelete?: (id: string) => void;
}

export function HistoryItem({ item, onClick, onDelete }: HistoryItemProps) {
  return (
    <div
      className="flex cursor-pointer items-center justify-between rounded-lg border px-3 py-2 transition-colors hover:bg-muted/50"
      onClick={() => onClick?.(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.(item)}
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{item.title}</p>
        <p className="text-xs text-muted-foreground">
          {item.createdAt.toLocaleDateString()}
        </p>
      </div>
      {onDelete && (
        <Button
          variant="ghost"
          size="sm"
          className="ml-2 h-7 w-7 shrink-0 p-0 text-muted-foreground hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item.id);
          }}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}
