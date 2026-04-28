"use client";

import { useState } from "react";
import {
  useHistory,
  HistoryItem,
  HistoryDetail,
  HistorySearch,
} from "@/features/result-history";
import type { HistoryItemType } from "@/features/result-history";

export default function HistoryPage() {
  const { items, isLoading, remove, search } = useHistory({ pageSize: 20 });
  const [selected, setSelected] = useState<HistoryItemType | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Generation History</h1>
        <p className="text-sm text-muted-foreground">
          Browse and review your past AI generation results.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <div className="space-y-3">
          <HistorySearch onSearch={search} />
          {isLoading && (
            <p className="text-sm text-muted-foreground">Loading...</p>
          )}
          {!isLoading && items.length === 0 && (
            <p className="text-sm text-muted-foreground">No history found.</p>
          )}
          {items.map((item) => (
            <HistoryItem
              key={item.id}
              item={item}
              onClick={setSelected}
              onDelete={remove}
            />
          ))}
        </div>

        <div>
          {selected ? (
            <HistoryDetail
              item={selected}
              onRegenerate={() => setSelected(null)}
            />
          ) : (
            <div className="flex h-40 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
              Select an item to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
