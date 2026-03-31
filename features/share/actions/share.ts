"use server";

import { randomBytes } from "crypto";
import { prisma } from "@/features/database";
import { auth } from "@/features/auth";

export async function createShareLinkAction(data: {
  resourceType: string;
  resourceId: string;
  isPublic?: boolean;
  password?: string;
  expiresAt?: Date;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const slug = randomBytes(6).toString("base64url");

  const link = await prisma.sharedLink.create({
    data: {
      userId: session.user.id,
      resourceType: data.resourceType,
      resourceId: data.resourceId,
      slug,
      isPublic: data.isPublic ?? true,
      password: data.password,
      expiresAt: data.expiresAt,
    },
  });

  return { slug: link.slug, url: `/s/${link.slug}` };
}

export async function getShareLinkAction(resourceType: string, resourceId: string) {
  const session = await auth();
  if (!session?.user?.id) return null;

  return prisma.sharedLink.findFirst({
    where: { userId: session.user.id, resourceType, resourceId },
  });
}

export async function deleteShareLinkAction(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.sharedLink.delete({
    where: { id, userId: session.user.id },
  });
}

export async function resolveShareSlugAction(slug: string) {
  const link = await prisma.sharedLink.findUnique({ where: { slug } });
  if (!link) return null;

  if (link.expiresAt && new Date() > link.expiresAt) return { expired: true } as const;

  await prisma.sharedLink.update({
    where: { id: link.id },
    data: { viewCount: { increment: 1 } },
  });

  return {
    expired: false,
    resourceType: link.resourceType,
    resourceId: link.resourceId,
    isPublic: link.isPublic,
    hasPassword: !!link.password,
  } as const;
}
