"use server";

import { siteConfig } from "@/config/site";
import { sendEmail, ContactEmail } from "@/features/email";
import { contactSchema, type ContactFormValues } from "./schema";

export async function submitContactAction(data: ContactFormValues) {
  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Invalid form data" } as const;
  }

  const { name, email, subject, message } = parsed.data;

  const result = await sendEmail({
    to: siteConfig.email,
    subject: `[Contact] ${subject}`,
    react: ContactEmail({ name, email, subject, message }),
    replyTo: email,
  });

  if (!result.success) {
    return { success: false, error: "Failed to send message" } as const;
  }

  return { success: true } as const;
}
