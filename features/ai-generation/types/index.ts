export type GenerationStatus = "idle" | "loading" | "streaming" | "done" | "error";

export interface GenerationResult {
  id?: string;
  input: string;
  output: string;
  createdAt?: Date;
}
