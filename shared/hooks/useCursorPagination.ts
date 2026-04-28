"use client";

import { useState, useCallback, useMemo } from "react";

export interface CursorPage<T> {
  items: T[];
  nextCursor: string | null;
}

interface UseCursorPaginationOptions<T> {
  fetcher: (cursor: string | null) => Promise<CursorPage<T>>;
}

export function useCursorPagination<T>({ fetcher }: UseCursorPaginationOptions<T>) {
  const [pages, setPages] = useState<CursorPage<T>[]>([]);
  const [cursors, setCursors] = useState<(string | null)[]>([null]);
  const [pageIndex, setPageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const items = useMemo(() => pages[pageIndex]?.items ?? [], [pages, pageIndex]);
  const hasNextPage = pages[pageIndex]?.nextCursor !== null;
  const hasPrevPage = pageIndex > 0;

  const fetchPage = useCallback(
    async (cursor: string | null, index: number) => {
      setIsLoading(true);
      try {
        const page = await fetcher(cursor);
        setPages((prev) => {
          const next = [...prev];
          next[index] = page;
          return next;
        });
        if (page.nextCursor) {
          setCursors((prev) => {
            const next = [...prev];
            next[index + 1] = page.nextCursor;
            return next;
          });
        }
      } finally {
        setIsLoading(false);
      }
    },
    [fetcher],
  );

  const loadFirst = useCallback(() => {
    setPageIndex(0);
    return fetchPage(null, 0);
  }, [fetchPage]);

  const loadNext = useCallback(async () => {
    const nextIndex = pageIndex + 1;
    const cursor = cursors[nextIndex];
    if (cursor === undefined) return;
    if (!pages[nextIndex]) {
      await fetchPage(cursor, nextIndex);
    }
    setPageIndex(nextIndex);
  }, [pageIndex, cursors, pages, fetchPage]);

  const loadPrev = useCallback(() => {
    if (pageIndex > 0) setPageIndex(pageIndex - 1);
  }, [pageIndex]);

  return {
    items,
    pageIndex,
    isLoading,
    hasNextPage,
    hasPrevPage,
    loadFirst,
    loadNext,
    loadPrev,
  };
}
