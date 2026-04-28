import { createHmac, timingSafeEqual } from "crypto";
import { paddleConfig } from "../config/paddle";

/**
 * Verify Paddle webhook signature (HMAC-SHA256).
 */
export function verifyPaddleSignature(
  rawBody: string,
  signature: string | null
): boolean {
  if (!signature || !paddleConfig.webhookSecret) return false;

  try {
    // Paddle signature format: ts=<timestamp>;h1=<hash>
    const parts = signature.split(";").reduce(
      (acc, part) => {
        const [key, value] = part.split("=");
        acc[key] = value;
        return acc;
      },
      {} as Record<string, string>
    );

    const ts = parts["ts"];
    const h1 = parts["h1"];
    if (!ts || !h1) return false;

    // Replay protection: reject timestamps older than 5 minutes
    const MAX_AGE_SECONDS = 300;
    const timestampAge = Math.abs(Date.now() / 1000 - parseInt(ts, 10));
    if (timestampAge > MAX_AGE_SECONDS) return false;

    const payload = `${ts}:${rawBody}`;
    const computedHash = createHmac("sha256", paddleConfig.webhookSecret)
      .update(payload)
      .digest("hex");

    return timingSafeEqual(Buffer.from(computedHash), Buffer.from(h1));
  } catch {
    return false;
  }
}
