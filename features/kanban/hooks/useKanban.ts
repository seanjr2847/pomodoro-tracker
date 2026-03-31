"use client";

import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { DropResult } from "@hello-pangea/dnd";
import {
  listCardsAction,
  addCardAction,
  moveCardAction,
  deleteCardAction,
} from "../actions/kanban";
import type { ColumnDef, KanbanColumnData, KanbanCardData } from "../types";

interface UseKanbanOptions {
  boardId: string;
  columnDefs: ColumnDef[];
}

export function useKanban({ boardId, columnDefs }: UseKanbanOptions) {
  const qc = useQueryClient();
  const queryKey = ["kanban", boardId];

  const { data: rawCards = [], isLoading } = useQuery({
    queryKey,
    queryFn: () => listCardsAction(boardId),
  });

  const columns: KanbanColumnData[] = columnDefs.map((def) => ({
    def,
    cards: (rawCards as KanbanCardData[])
      .filter((c) => c.column === def.id)
      .sort((a, b) => a.position - b.position),
  }));

  const addMut = useMutation({
    mutationFn: addCardAction,
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const moveMut = useMutation({
    mutationFn: moveCardAction,
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const deleteMut = useMutation({
    mutationFn: deleteCardAction,
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const addCard = useCallback(
    (columnId: string, title: string, content?: string) =>
      addMut.mutateAsync({ boardId, column: columnId, title, content }),
    [addMut, boardId],
  );

  const moveCard = useCallback(
    (cardId: string, toColumn: string, position: number) =>
      moveMut.mutateAsync({ cardId, toColumn, position }),
    [moveMut],
  );

  const deleteCard = useCallback(
    (cardId: string) => deleteMut.mutateAsync(cardId),
    [deleteMut],
  );

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;
      const { draggableId, destination } = result;
      moveCard(draggableId, destination.droppableId, destination.index);
    },
    [moveCard],
  );

  return { columns, isLoading, addCard, moveCard, deleteCard, onDragEnd };
}
