export const emailConfig = {
  apiKey: process.env.RESEND_API_KEY ?? "",
  from: process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev",
};

export const isEmailEnabled = emailConfig.apiKey.length > 0;
