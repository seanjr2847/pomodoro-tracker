export const isBillingEnabled = !!process.env.PADDLE_API_KEY;

export const paddleConfig = {
  apiKey: process.env.PADDLE_API_KEY ?? "",
  webhookSecret: process.env.PADDLE_WEBHOOK_SECRET ?? "",
};

export const paddleClientConfig = {
  clientToken: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ?? "",
  priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID ?? "",
  environment: (process.env.NEXT_PUBLIC_PADDLE_ENV ?? "sandbox") as
    | "sandbox"
    | "production",
};
