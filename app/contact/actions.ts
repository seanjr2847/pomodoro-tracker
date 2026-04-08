"use server";

/**
 * contact + email Feature connection (app layer)
 *
 * When removing email Feature: delete this file and
 * remove the action prop from ContactForm in page.tsx.
 */

import { siteConfig } from "@/config/site";
import { sendEmail, ContactEmail } from "@/features/email";
import { contactSchema, type ContactFormValues } from "@/features/contact";
import { ok, fail, type ActionResult } from "@/shared/lib/actionResult";

export async function submitContactWithEmail(
  data: ContactFormValues
): Promise<ActionResult<void>> {
  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) {
    return fail("Invalid form data");
  }

  const { name, email, subject, message } = parsed.data;

  const result = await sendEmail({
    to: siteConfig.email,
    subject: `[Contact] ${subject}`,
    react: ContactEmail({ name, email, subject, message }),
    replyTo: email,
  });

  if (!result.success) {
    return fail("Failed to send message");
  }

  return ok(undefined);
}
