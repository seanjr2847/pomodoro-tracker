"use server";

import { prisma } from "@/features/database";
import { auth } from "@/features/auth";

export async function listCardsAction(boardId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  return prisma.kanbanCard.findMany({
    where: { userId: session.user.id, boardId },
    orderBy: { position: "asc" },
  });
}

export async function addCardAction(data: {
  boardId: string;
  column: string;
  title: string;
  content?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const maxPos = await prisma.kanbanCard.aggregate({
    where: { userId: session.user.id, boardId: data.boardId, column: data.column },
    _max: { position: true },
  });

  return prisma.kanbanCard.create({
    data: {
      userId: session.user.id,
      boardId: data.boardId,
      column: data.column,
      title: data.title,
      content: data.content,
      position: (maxPos._max.position ?? -1) + 1,
    },
  });
}

export async function moveCardAction(data: {
  cardId: string;
  toColumn: string;
  position: number;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  return prisma.kanbanCard.update({
    where: { id: data.cardId, userId: session.user.id },
    data: { column: data.toColumn, position: data.position },
  });
}

export async function updateCardAction(cardId: string, data: { title?: string; content?: string }) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  return prisma.kanbanCard.update({
    where: { id: cardId, userId: session.user.id },
    data,
  });
}

export async function deleteCardAction(cardId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.kanbanCard.delete({
    where: { id: cardId, userId: session.user.id },
  });
}
