import { randomBytes, createHash } from "crypto";
import { prisma } from "@/features/database";

const PREFIX = "sk_";

export function generateApiKey(): { raw: string; hash: string } {
  const raw = PREFIX + randomBytes(24).toString("hex");
  const hash = hashKey(raw);
  return { raw, hash };
}

export function hashKey(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

export async function createApiKey(userId: string, name: string) {
  const { raw, hash } = generateApiKey();
  const apiKey = await prisma.apiKey.create({
    data: { userId, name, key: hash },
  });
  return { ...apiKey, rawKey: raw };
}

export async function listApiKeys(userId: string) {
  return prisma.apiKey.findMany({
    where: { userId, revoked: false },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      key: true,
      lastUsedAt: true,
      createdAt: true,
    },
  });
}

export async function revokeApiKey(userId: string, keyId: string) {
  return prisma.apiKey.updateMany({
    where: { id: keyId, userId },
    data: { revoked: true },
  });
}

export async function validateApiKey(raw: string) {
  const hash = hashKey(raw);
  const apiKey = await prisma.apiKey.findUnique({
    where: { key: hash },
    include: { user: { select: { id: true, email: true, role: true } } },
  });

  if (!apiKey || apiKey.revoked) return null;
  if (apiKey.expiresAt && apiKey.expiresAt < new Date()) return null;

  await prisma.apiKey.update({
    where: { id: apiKey.id },
    data: { lastUsedAt: new Date() },
  });

  return { userId: apiKey.userId, user: apiKey.user };
}
