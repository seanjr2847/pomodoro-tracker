"use client";

import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { Button, Input } from "@/shared/ui";

interface KanbanAddCardProps {
  onAdd: (title: string) => void;
}

export function KanbanAddCard({ onAdd }: KanbanAddCardProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setTitle("");
    setEditing(false);
  }

  if (!editing) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start text-muted-foreground"
        onClick={() => setEditing(true)}
      >
        <Plus className="mr-1 h-3.5 w-3.5" /> Add card
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-1">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Card title..."
        className="h-7 text-xs"
        autoFocus
        onBlur={() => !title.trim() && setEditing(false)}
      />
      <Button type="submit" size="sm" className="h-7 px-2" disabled={!title.trim()}>
        Add
      </Button>
    </form>
  );
}
