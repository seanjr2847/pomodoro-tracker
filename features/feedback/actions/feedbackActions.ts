"use server";

import { createElement } from "react";
import { feedbackSchema, type FeedbackFormValues } from "../lib/schema";
import { ok, fail, type ActionResult } from "@/shared/lib/actionResult";
import { sendEmail, isEmailEnabled } from "@/features/email";

export async function submitFeedbackAction(
  data: FeedbackFormValues
): Promise<ActionResult<void>> {
  const parsed = feedbackSchema.safeParse(data);
  if (!parsed.success) {
    return fail("Invalid feedback data");
  }

  const { type, message, email } = parsed.data;

  if (isEmailEnabled) {
    await sendEmail({
      to: process.env.FEEDBACK_TO_EMAIL ?? "feedback@example.com",
      subject: `[Feedback] ${type}`,
      react: createElement(
        "div",
        null,
        createElement("p", null, `Type: ${type}`),
        createElement("p", null, `Message: ${message}`),
        email ? createElement("p", null, `From: ${email}`) : null
      ),
      ...(email ? { replyTo: email } : {}),
    });
  }

  return ok(undefined);
}
