"use client";

import { Droppable } from "@hello-pangea/dnd";
import { KanbanCard } from "./KanbanCard";
import { KanbanAddCard } from "./KanbanAddCard";
import type { ColumnDef, KanbanCardData } from "../types";

interface KanbanColumnProps {
  column: ColumnDef;
  cards: KanbanCardData[];
  onAddCard: (title: string) => void;
  onDeleteCard: (id: string) => void;
}

export function KanbanColumn({ column, cards, onAddCard, onDeleteCard }: KanbanColumnProps) {
  return (
    <div className="flex w-72 shrink-0 flex-col rounded-lg border bg-muted/30">
      <div className="flex items-center gap-2 border-b px-3 py-2">
        {column.color && (
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: column.color }}
          />
        )}
        <h3 className="text-sm font-semibold">{column.title}</h3>
        <span className="ml-auto text-xs text-muted-foreground">{cards.length}</span>
      </div>
      <Droppable droppableId={column.id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex min-h-[120px] flex-col gap-2 p-2"
          >
            {cards.map((card, i) => (
              <KanbanCard
                key={card.id}
                card={card}
                index={i}
                onDelete={() => onDeleteCard(card.id)}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <div className="border-t p-2">
        <KanbanAddCard onAdd={onAddCard} />
      </div>
    </div>
  );
}
