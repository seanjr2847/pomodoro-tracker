"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Send } from "lucide-react";
import { Button, Textarea } from "@/shared/ui";

interface GenerationInputProps {
  onSubmit: (input: string) => void;
  placeholder?: string;
  disabled?: boolean;
  children?: ReactNode;
}

export function GenerationInput({
  onSubmit,
  placeholder = "Enter your prompt...",
  disabled = false,
  children,
}: GenerationInputProps) {
  const [input, setInput] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setInput("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {children}
      <div className="flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="min-h-[80px] flex-1 resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit(e);
          }}
        />
        <Button type="submit" size="icon" disabled={disabled || !input.trim()} className="self-end">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
