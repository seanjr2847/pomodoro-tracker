"use server";

import { prisma } from "@/features/database";
import { auth } from "@/features/auth";

export async function saveGenerationAction(data: {
  title: string;
  input: unknown;
  output: string;
  metadata?: unknown;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  return prisma.generation.create({
    data: {
      userId: session.user.id,
      title: data.title,
      input: data.input as object,
      output: data.output,
      metadata: data.metadata as object | undefined,
    },
  });
}

export async function listGenerationsAction(opts?: {
  query?: string;
  cursor?: string;
  pageSize?: number;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const pageSize = opts?.pageSize ?? 20;

  const items = await prisma.generation.findMany({
    where: {
      userId: session.user.id,
      ...(opts?.query ? { title: { contains: opts.query, mode: "insensitive" } } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: pageSize + 1,
    ...(opts?.cursor ? { cursor: { id: opts.cursor }, skip: 1 } : {}),
    select: { id: true, title: true, input: true, output: true, metadata: true, createdAt: true },
  });

  const hasMore = items.length > pageSize;
  if (hasMore) items.pop();

  return {
    items,
    nextCursor: hasMore ? items[items.length - 1]?.id ?? null : null,
  };
}

export async function deleteGenerationAction(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.generation.delete({
    where: { id, userId: session.user.id },
  });
}
