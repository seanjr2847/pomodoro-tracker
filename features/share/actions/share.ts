"use server";

import { z } from "zod/v4";
import { randomBytes } from "crypto";
import { prisma } from "@/features/database";
import { auth } from "@/features/auth";
import { ok, fail, okVoid } from "@/shared/lib/actionResult";

const createShareSchema = z.object({
  resourceType: z.string().min(1).max(100),
  resourceId: z.string().min(1),
  isPublic: z.boolean().optional(),
  password: z.string().max(200).optional(),
  expiresAt: z.coerce.date().optional(),
});

const getShareSchema = z.object({
  resourceType: z.string().min(1).max(100),
  resourceId: z.string().min(1),
});

const idSchema = z.string().min(1);
const slugSchema = z.string().min(1).max(100);

export async function createShareLinkAction(data: {
  resourceType: string;
  resourceId: string;
  isPublic?: boolean;
  password?: string;
  expiresAt?: Date;
}) {
  const parsed = createShareSchema.safeParse(data);
  if (!parsed.success) {
    return fail(`Validation failed: ${z.prettifyError(parsed.error)}`);
  }

  const session = await auth();
  if (!session?.user?.id) return fail("Unauthorized");

  const slug = randomBytes(6).toString("base64url");

  const link = await prisma.sharedLink.create({
    data: {
      userId: session.user.id,
      resourceType: parsed.data.resourceType,
      resourceId: parsed.data.resourceId,
      slug,
      isPublic: parsed.data.isPublic ?? true,
      password: parsed.data.password,
      expiresAt: parsed.data.expiresAt,
    },
  });

  return ok({ slug: link.slug, url: `/s/${link.slug}` });
}

export async function getShareLinkAction(resourceType: string, resourceId: string) {
  const parsed = getShareSchema.safeParse({ resourceType, resourceId });
  if (!parsed.success) {
    return fail(`Validation failed: ${z.prettifyError(parsed.error)}`);
  }

  const session = await auth();
  if (!session?.user?.id) return ok(null);

  const link = await prisma.sharedLink.findFirst({
    where: { userId: session.user.id, resourceType: parsed.data.resourceType, resourceId: parsed.data.resourceId },
  });

  return ok(link);
}

export async function deleteShareLinkAction(id: string) {
  const parsed = idSchema.safeParse(id);
  if (!parsed.success) {
    return fail(`Validation failed: ${z.prettifyError(parsed.error)}`);
  }

  const session = await auth();
  if (!session?.user?.id) return fail("Unauthorized");

  await prisma.sharedLink.delete({
    where: { id: parsed.data, userId: session.user.id },
  });

  return okVoid();
}

export async function resolveShareSlugAction(slug: string) {
  const parsed = slugSchema.safeParse(slug);
  if (!parsed.success) {
    return fail(`Validation failed: ${z.prettifyError(parsed.error)}`);
  }

  const link = await prisma.sharedLink.findUnique({ where: { slug: parsed.data } });
  if (!link) return ok(null);

  if (link.expiresAt && new Date() > link.expiresAt) {
    return ok({ expired: true as const });
  }

  await prisma.sharedLink.update({
    where: { id: link.id },
    data: { viewCount: { increment: 1 } },
  });

  return ok({
    expired: false as const,
    resourceType: link.resourceType,
    resourceId: link.resourceId,
    isPublic: link.isPublic,
    hasPassword: !!link.password,
  });
}
