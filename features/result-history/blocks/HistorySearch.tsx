"use client";

import { Search } from "lucide-react";
import { Input } from "@/shared/ui";

interface HistorySearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function HistorySearch({
  onSearch,
  placeholder = "Search history...",
}: HistorySearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        onChange={(e) => onSearch(e.target.value)}
        className="pl-8"
      />
    </div>
  );
}
