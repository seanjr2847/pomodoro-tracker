"use server";

import { auth } from "@/features/auth";
import { createApiKey, listApiKeys, revokeApiKey } from "../lib/apiKeys";

export async function createApiKeyAction(name: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return createApiKey(session.user.id, name);
}

export async function listApiKeysAction() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return listApiKeys(session.user.id);
}

export async function revokeApiKeyAction(keyId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  await revokeApiKey(session.user.id, keyId);
}
