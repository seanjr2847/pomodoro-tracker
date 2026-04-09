import { auth } from "@/features/auth";
import { validateApiKey } from "./apiKeys";

export interface AuthResult {
  userId: string;
  user: { id: string; email?: string | null; role?: string };
  method: "session" | "api-key";
}

/**
 * API route level authentication helper.
 * 1. Check session via auth()
 * 2. Fallback to X-API-Key header via validateApiKey()
 * Returns null if neither method succeeds.
 */
export async function authenticateRequest(
  request: Request
): Promise<AuthResult | null> {
  // 1. Try session auth
  const session = await auth();
  if (session?.user?.id) {
    return {
      userId: session.user.id,
      user: {
        id: session.user.id,
        email: session.user.email,
        role: (session.user as { role?: string }).role ?? "USER",
      },
      method: "session",
    };
  }

  // 2. Try API key auth
  const apiKeyHeader = request.headers.get("X-API-Key");
  if (apiKeyHeader) {
    const result = await validateApiKey(apiKeyHeader);
    if (result) {
      return {
        userId: result.userId,
        user: {
          id: result.user.id,
          email: result.user.email,
          role: result.user.role ?? "USER",
        },
        method: "api-key",
      };
    }
  }

  return null;
}
