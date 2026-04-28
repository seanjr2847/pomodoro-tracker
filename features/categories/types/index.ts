export interface Category {
  id: string;
  userId: string;
  name: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryInput {
  name: string;
  color: string;
}

export interface UpdateCategoryInput {
  id: string;
  name?: string;
  color?: string;
}

export const COLOR_PRESETS = [
  { name: "빨강", value: "#EF4444" },
  { name: "주황", value: "#F97316" },
  { name: "노랑", value: "#EAB308" },
  { name: "초록", value: "#22C55E" },
  { name: "파랑", value: "#3B82F6" },
  { name: "남색", value: "#6366F1" },
  { name: "보라", value: "#A855F7" },
  { name: "분홍", value: "#EC4899" },
] as const;
