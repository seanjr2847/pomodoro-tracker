"use server";

import { z } from "zod/v4";
import { prisma } from "@/features/database";
import { auth } from "@/features/auth";
import { ok, fail, okVoid } from "@/shared/lib/actionResult";

const saveGenerationSchema = z.object({
  title: z.string().min(1).max(500),
  input: z.unknown(),
  output: z.string().min(1),
  metadata: z.unknown().optional(),
});

const listGenerationsSchema = z.object({
  query: z.string().max(200).optional(),
  cursor: z.string().min(1).optional(),
  pageSize: z.number().int().min(1).max(100).optional(),
}).optional();

const idSchema = z.string().min(1);

export async function saveGenerationAction(data: {
  title: string;
  input: unknown;
  output: string;
  metadata?: unknown;
}) {
  const parsed = saveGenerationSchema.safeParse(data);
  if (!parsed.success) {
    return fail(`Validation failed: ${z.prettifyError(parsed.error)}`);
  }

  const session = await auth();
  if (!session?.user?.id) return fail("Unauthorized");

  const generation = await prisma.generation.create({
    data: {
      userId: session.user.id,
      title: parsed.data.title,
      input: parsed.data.input as object,
      output: parsed.data.output,
      metadata: parsed.data.metadata as object | undefined,
    },
  });

  return ok(generation);
}

export async function listGenerationsAction(opts?: {
  query?: string;
  cursor?: string;
  pageSize?: number;
}) {
  const parsed = listGenerationsSchema.safeParse(opts);
  if (!parsed.success) {
    return fail(`Validation failed: ${z.prettifyError(parsed.error)}`);
  }

  const session = await auth();
  if (!session?.user?.id) return fail("Unauthorized");

  const pageSize = parsed.data?.pageSize ?? 20;

  const items = await prisma.generation.findMany({
    where: {
      userId: session.user.id,
      ...(parsed.data?.query ? { title: { contains: parsed.data.query, mode: "insensitive" } } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: pageSize + 1,
    ...(parsed.data?.cursor ? { cursor: { id: parsed.data.cursor }, skip: 1 } : {}),
    select: { id: true, title: true, input: true, output: true, metadata: true, createdAt: true },
  });

  const hasMore = items.length > pageSize;
  if (hasMore) items.pop();

  return ok({
    items,
    nextCursor: hasMore ? items[items.length - 1]?.id ?? null : null,
  });
}

export async function deleteGenerationAction(id: string) {
  const parsed = idSchema.safeParse(id);
  if (!parsed.success) {
    return fail(`Validation failed: ${z.prettifyError(parsed.error)}`);
  }

  const session = await auth();
  if (!session?.user?.id) return fail("Unauthorized");

  await prisma.generation.delete({
    where: { id: parsed.data, userId: session.user.id },
  });

  return okVoid();
}
