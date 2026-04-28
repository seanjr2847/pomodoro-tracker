"use server";

import { auth } from "@/features/auth";
import { db } from "@/features/database";
import { revalidatePath } from "next/cache";
import type { CreateCategoryInput, UpdateCategoryInput } from "../types";

export async function getCategoriesAction() {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  try {
    const categories = await db.category.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: categories };
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return { success: false, error: "카테고리를 불러오는데 실패했습니다." };
  }
}

export async function createCategoryAction(input: CreateCategoryInput) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  try {
    const category = await db.category.create({
      data: {
        userId: session.user.id,
        name: input.name,
        color: input.color,
      },
    });

    revalidatePath("/categories");
    revalidatePath("/dashboard");
    return { success: true, data: category };
  } catch (error) {
    console.error("Failed to create category:", error);
    return { success: false, error: "카테고리 생성에 실패했습니다." };
  }
}

export async function updateCategoryAction(input: UpdateCategoryInput) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  try {
    // 소유권 확인
    const existing = await db.category.findFirst({
      where: {
        id: input.id,
        userId: session.user.id,
      },
    });

    if (!existing) {
      return { success: false, error: "카테고리를 찾을 수 없습니다." };
    }

    const category = await db.category.update({
      where: { id: input.id },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.color !== undefined && { color: input.color }),
      },
    });

    revalidatePath("/categories");
    revalidatePath("/dashboard");
    return { success: true, data: category };
  } catch (error) {
    console.error("Failed to update category:", error);
    return { success: false, error: "카테고리 수정에 실패했습니다." };
  }
}

export async function deleteCategoryAction(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  try {
    // 소유권 확인
    const existing = await db.category.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existing) {
      return { success: false, error: "카테고리를 찾을 수 없습니다." };
    }

    await db.category.delete({
      where: { id },
    });

    revalidatePath("/categories");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete category:", error);
    return { success: false, error: "카테고리 삭제에 실패했습니다." };
  }
}
