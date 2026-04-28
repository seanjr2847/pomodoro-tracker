"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Plus, Check } from "lucide-react";
import { COLOR_PRESETS } from "../types";
import { createCategoryAction } from "../actions/categoryActions";
import { toast } from "sonner";

type ColorPreset = typeof COLOR_PRESETS[number]["value"];

export function CategoryForm() {
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState<ColorPreset>(COLOR_PRESETS[0].value);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("카테고리 이름을 입력하세요");
      return;
    }

    setIsSubmitting(true);
    const result = await createCategoryAction({
      name: name.trim(),
      color: selectedColor,
    });

    if (result.success) {
      toast.success("카테고리가 생성되었습니다");
      setName("");
      setSelectedColor(COLOR_PRESETS[0].value);
    } else {
      toast.error(result.error || "카테고리 생성에 실패했습니다");
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="category-name">카테고리 이름</Label>
        <Input
          id="category-name"
          placeholder="예: 공부, 코딩, 운동"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label>색상 선택</Label>
        <div className="grid grid-cols-4 gap-2">
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => setSelectedColor(preset.value)}
              className="relative flex items-center justify-center rounded-lg border-2 p-3 transition-all hover:scale-105"
              style={{
                backgroundColor: preset.value,
                borderColor: selectedColor === preset.value ? preset.value : "transparent",
              }}
              disabled={isSubmitting}
            >
              {selectedColor === preset.value && (
                <Check className="h-5 w-5 text-white" />
              )}
              <span className="sr-only">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        {isSubmitting ? "생성 중..." : "카테고리 생성"}
      </Button>
    </form>
  );
}
