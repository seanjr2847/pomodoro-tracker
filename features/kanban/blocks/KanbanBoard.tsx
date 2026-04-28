"use client";

import { DragDropContext } from "@hello-pangea/dnd";
import { useKanban } from "../hooks/useKanban";
import { KanbanColumn } from "./KanbanColumn";
import type { ColumnDef } from "../types";

interface KanbanBoardProps {
  boardId: string;
  columnDefs: ColumnDef[];
}

export function KanbanBoard({ boardId, columnDefs }: KanbanBoardProps) {
  const { columns, isLoading, addCard, deleteCard, onDragEnd } = useKanban({
    boardId,
    columnDefs,
  });

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading board...</div>;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((col) => (
          <KanbanColumn
            key={col.def.id}
            column={col.def}
            cards={col.cards}
            onAddCard={(title) => addCard(col.def.id, title)}
            onDeleteCard={deleteCard}
          />
        ))}
      </div>
    </DragDropContext>
  );
}
