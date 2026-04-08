"use server";

import { contactSchema, type ContactFormValues } from "./schema";
import { ok, fail, type ActionResult } from "@/shared/lib/actionResult";

/**
 * contact Feature's default server action.
 * Works without email Feature (console log).
 * Override in app/contact/actions.ts if email integration is needed.
 */
export async function submitContactAction(
  data: ContactFormValues
): Promise<ActionResult<void>> {
  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) {
    return fail("Invalid form data");
  }

  console.log("[contact] Message received:", {
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject,
  });

  return ok(undefined);
}
