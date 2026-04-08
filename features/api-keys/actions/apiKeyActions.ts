"use server";

import { z } from "zod/v4";
import { auth } from "@/features/auth";
import { createApiKey, listApiKeys, revokeApiKey } from "../lib/apiKeys";
import { ok, fail, okVoid } from "@/shared/lib/actionResult";

const nameSchema = z.string().min(1).max(100);
const keyIdSchema = z.string().min(1);

export async function createApiKeyAction(name: string) {
  const parsed = nameSchema.safeParse(name);
  if (!parsed.success) {
    return fail(`Validation failed: ${z.prettifyError(parsed.error)}`);
  }

  const session = await auth();
  if (!session?.user?.id) return fail("Unauthorized");

  const key = await createApiKey(session.user.id, parsed.data);
  return ok(key);
}

export async function listApiKeysAction() {
  const session = await auth();
  if (!session?.user?.id) return fail("Unauthorized");

  const keys = await listApiKeys(session.user.id);
  return ok(keys);
}

export async function revokeApiKeyAction(keyId: string) {
  const parsed = keyIdSchema.safeParse(keyId);
  if (!parsed.success) {
    return fail(`Validation failed: ${z.prettifyError(parsed.error)}`);
  }

  const session = await auth();
  if (!session?.user?.id) return fail("Unauthorized");

  await revokeApiKey(session.user.id, parsed.data);
  return okVoid();
}
