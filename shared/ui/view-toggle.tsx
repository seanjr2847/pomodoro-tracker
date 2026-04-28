"use client";

import { LayoutGrid, List } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/shared/utils/cn";

interface ViewToggleProps {
  value: "grid" | "list";
  onChange: (value: "grid" | "list") => void;
  className?: string;
}

export function ViewToggle({ value, onChange, className }: ViewToggleProps) {
  return (
    <div className={cn("inline-flex rounded-lg border p-0.5", className)}>
      <Button
        variant={value === "grid" ? "secondary" : "ghost"}
        size="sm"
        className="h-7 w-7 p-0"
        onClick={() => onChange("grid")}
        aria-label="Grid view"
      >
        <LayoutGrid className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant={value === "list" ? "secondary" : "ghost"}
        size="sm"
        className="h-7 w-7 p-0"
        onClick={() => onChange("list")}
        aria-label="List view"
      >
        <List className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
