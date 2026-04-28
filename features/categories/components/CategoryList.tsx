"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Edit, Trash, Tag } from "lucide-react";
import { deleteCategoryAction } from "../actions/categoryActions";
import { toast } from "sonner";
import type { Category } from "../types";

interface CategoryListProps {
  categories: Category[];
}

export function CategoryList({ categories }: CategoryListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("이 카테고리를 삭제하시겠습니까?")) {
      return;
    }

    setDeletingId(id);
    const result = await deleteCategoryAction(id);

    if (result.success) {
      toast.success("카테고리가 삭제되었습니다");
    } else {
      toast.error(result.error || "카테고리 삭제에 실패했습니다");
    }
    setDeletingId(null);
  };

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border border-dashed p-12 text-center">
        <Tag className="h-12 w-12 text-muted-foreground" />
        <div>
          <h3 className="font-semibold">카테고리가 없습니다</h3>
          <p className="text-sm text-muted-foreground">
            새 카테고리를 만들어보세요
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {categories.map((category) => (
        <Card key={category.id} className="p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 overflow-hidden">
              <div
                className="h-10 w-10 shrink-0 rounded-lg"
                style={{ backgroundColor: category.color }}
              />
              <span className="truncate font-medium">{category.name}</span>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                disabled={deletingId === category.id}
                onClick={() => handleDelete(category.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
