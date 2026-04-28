export interface HistoryItem {
  id: string;
  title: string;
  input: unknown;
  output: string;
  metadata?: unknown;
  createdAt: Date;
}
