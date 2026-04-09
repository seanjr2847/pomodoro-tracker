"use server";

import { siteConfig } from "@/config/site";
import { sendEmail, ContactEmail } from "@/features/email";
import { contactSchema, type ContactFormValues } from "../lib/schema";
import { ok, fail, type ActionResult } from "@/shared/lib/actionResult";

/**
 * Contact form action with email integration.
 * Sends the submitted form to siteConfig.email via the email feature.
 * Falls back gracefully when RESEND_API_KEY is not set (email feature disabled).
 */
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
