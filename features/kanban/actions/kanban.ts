"use server";

import { z } from "zod/v4";
import { prisma } from "@/features/database";
import { auth } from "@/features/auth";
import { ok, fail, okVoid, type ActionResult } from "@/shared/lib/actionResult";

const addCardSchema = z.object({
  boardId: z.string().min(1),
  column: z.string().min(1),
  title: z.string().min(1).max(500),
  content: z.string().max(5000).optional(),
});

const moveCardSchema = z.object({
  cardId: z.string().min(1),
  toColumn: z.string().min(1),
  position: z.number().int().min(0),
});

const updateCardSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  content: z.string().max(5000).optional(),
});

const idSchema = z.string().min(1);

export async function listCardsAction(boardId: string) {
  const parsed = idSchema.safeParse(boardId);
  if (!parsed.success) {
    return fail(`Validation failed: ${z.prettifyError(parsed.error)}`);
  }

  const session = await auth();
  if (!session?.user?.id) return fail("Unauthorized");

  const cards = await prisma.kanbanCard.findMany({
    where: { userId: session.user.id, boardId: parsed.data },
    orderBy: { position: "asc" },
  });

  return ok(cards);
}

export async function addCardAction(data: {
  boardId: string;
  column: string;
  title: string;
  content?: string;
}) {
  const parsed = addCardSchema.safeParse(data);
  if (!parsed.success) {
    return fail(`Validation failed: ${z.prettifyError(parsed.error)}`);
  }

  const session = await auth();
  if (!session?.user?.id) return fail("Unauthorized");

  const maxPos = await prisma.kanbanCard.aggregate({
    where: { userId: session.user.id, boardId: parsed.data.boardId, column: parsed.data.column },
    _max: { position: true },
  });

  const card = await prisma.kanbanCard.create({
    data: {
      userId: session.user.id,
      boardId: parsed.data.boardId,
      column: parsed.data.column,
      title: parsed.data.title,
      content: parsed.data.content,
      position: (maxPos._max.position ?? -1) + 1,
    },
  });

  return ok(card);
}

export async function moveCardAction(data: {
  cardId: string;
  toColumn: string;
  position: number;
}) {
  const parsed = moveCardSchema.safeParse(data);
  if (!parsed.success) {
    return fail(`Validation failed: ${z.prettifyError(parsed.error)}`);
  }

  const session = await auth();
  if (!session?.user?.id) return fail("Unauthorized");

  const card = await prisma.kanbanCard.update({
    where: { id: parsed.data.cardId, userId: session.user.id },
    data: { column: parsed.data.toColumn, position: parsed.data.position },
  });

  return ok(card);
}

export async function updateCardAction(cardId: string, data: { title?: string; content?: string }) {
  const parsedId = idSchema.safeParse(cardId);
  const parsedData = updateCardSchema.safeParse(data);
  if (!parsedId.success) {
    return fail(`Validation failed: ${z.prettifyError(parsedId.error)}`);
  }
  if (!parsedData.success) {
    return fail(`Validation failed: ${z.prettifyError(parsedData.error)}`);
  }

  const session = await auth();
  if (!session?.user?.id) return fail("Unauthorized");

  const card = await prisma.kanbanCard.update({
    where: { id: parsedId.data, userId: session.user.id },
    data: parsedData.data,
  });

  return ok(card);
}

export async function deleteCardAction(cardId: string): Promise<ActionResult<void>> {
  const parsed = idSchema.safeParse(cardId);
  if (!parsed.success) {
    return fail(`Validation failed: ${z.prettifyError(parsed.error)}`);
  }

  const session = await auth();
  if (!session?.user?.id) return fail("Unauthorized");

  await prisma.kanbanCard.delete({
    where: { id: parsed.data, userId: session.user.id },
  });

  return okVoid();
}
