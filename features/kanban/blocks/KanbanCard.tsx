"use client";

import { Draggable } from "@hello-pangea/dnd";
import { Trash2 } from "lucide-react";
import { Button } from "@/shared/ui";
import type { KanbanCardData } from "../types";

interface KanbanCardProps {
  card: KanbanCardData;
  index: number;
  onClick?: () => void;
  onDelete?: () => void;
}

export function KanbanCard({ card, index, onClick, onDelete }: KanbanCardProps) {
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`group rounded-md border bg-background p-2.5 text-sm shadow-sm transition-shadow ${
            snapshot.isDragging ? "shadow-md" : ""
          }`}
          onClick={onClick}
        >
          <div className="flex items-start justify-between gap-1">
            <span className="font-medium">{card.title}</span>
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 shrink-0 p-0 opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <Trash2 className="h-3 w-3 text-muted-foreground" />
              </Button>
            )}
          </div>
          {card.content && (
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
              {card.content}
            </p>
          )}
        </div>
      )}
    </Draggable>
  );
}
