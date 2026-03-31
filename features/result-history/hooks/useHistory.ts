"use client";

import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  saveGenerationAction,
  listGenerationsAction,
  deleteGenerationAction,
} from "../actions/history";
import type { HistoryItem } from "../types";

interface UseHistoryOptions {
  pageSize?: number;
}

export function useHistory({ pageSize = 20 }: UseHistoryOptions = {}) {
  const qc = useQueryClient();
  const [query, setQuery] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["generations", query],
    queryFn: () => listGenerationsAction({ query, pageSize }),
  });

  const items: HistoryItem[] = (data?.items ?? []).map((i) => ({
    ...i,
    createdAt: new Date(i.createdAt),
  }));

  const saveMutation = useMutation({
    mutationFn: saveGenerationAction,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["generations"] }),
  });

  const removeMutation = useMutation({
    mutationFn: deleteGenerationAction,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["generations"] }),
  });

  const save = useCallback(
    (input: unknown, output: string, metadata?: unknown) => {
      const title =
        typeof input === "string"
          ? input.slice(0, 80)
          : "Generation";
      return saveMutation.mutateAsync({ title, input, output, metadata });
    },
    [saveMutation],
  );

  const remove = useCallback(
    (id: string) => removeMutation.mutateAsync(id),
    [removeMutation],
  );

  const search = useCallback((q: string) => setQuery(q), []);

  return {
    items,
    total: items.length,
    isLoading,
    save,
    remove,
    search,
    hasMore: data?.nextCursor !== null,
  };
}
