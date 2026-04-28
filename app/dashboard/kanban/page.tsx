"use client";

import { KanbanBoard } from "@/features/kanban";
import type { ColumnDef } from "@/features/kanban";

const DEFAULT_COLUMNS: ColumnDef[] = [
  { id: "todo", title: "To Do", color: "#94a3b8" },
  { id: "in-progress", title: "In Progress", color: "#f59e0b" },
  { id: "done", title: "Done", color: "#22c55e" },
];

const BOARD_ID = "default";

export default function KanbanPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Kanban Board</h1>
        <p className="text-sm text-muted-foreground">
          Organize your tasks with drag-and-drop.
        </p>
      </div>
      <KanbanBoard boardId={BOARD_ID} columnDefs={DEFAULT_COLUMNS} />
    </div>
  );
}
