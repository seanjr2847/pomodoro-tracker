import { z } from "zod/v3";

export const feedbackSchema = z.object({
  type: z.enum(["bug", "feature", "general"]),
  message: z.string().min(10, "Message must be at least 10 characters"),
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
});

export type FeedbackFormValues = z.infer<typeof feedbackSchema>;
