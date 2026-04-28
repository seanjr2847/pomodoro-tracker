import { Resend } from "resend";
import { emailConfig, isEmailEnabled } from "./config";

let resendClient: Resend | null = null;

function getResend(): Resend {
  if (!resendClient) {
    resendClient = new Resend(emailConfig.apiKey);
  }
  return resendClient;
}

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  react: React.ReactElement;
  replyTo?: string;
}

export async function sendEmail({ to, subject, react, replyTo }: SendEmailOptions) {
  if (!isEmailEnabled) {
    console.log("[email] Resend disabled — skipping:", { to, subject });
    return { success: true, skipped: true } as const;
  }

  const resend = getResend();
  const { data, error } = await resend.emails.send({
    from: emailConfig.from,
    to: Array.isArray(to) ? to : [to],
    subject,
    react,
    replyTo,
  });

  if (error) {
    console.error("[email] Send failed:", error);
    return { success: false, error } as const;
  }

  return { success: true, id: data?.id } as const;
}
