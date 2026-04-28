export interface ColumnDef {
  id: string;
  title: string;
  color?: string;
}

export interface KanbanCardData {
  id: string;
  column: string;
  title: string;
  content?: string | null;
  position: number;
  metadata?: unknown;
  createdAt: Date;
}

export interface KanbanColumnData {
  def: ColumnDef;
  cards: KanbanCardData[];
}
