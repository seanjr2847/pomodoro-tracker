import { auth } from "@/features/auth";

/**
 * Role values matching Prisma Role enum.
 */
export type Role = "USER" | "ADMIN";

interface RequireRoleSuccess {
  success: true;
  userId: string;
  role: Role;
}

interface RequireRoleFailure {
  success: false;
  error: string;
}

export type RequireRoleResult = RequireRoleSuccess | RequireRoleFailure;

/**
 * Server-side guard that checks the current session user's role.
 * Returns structured result instead of throwing.
 *
 * @param allowedRoles - One or more roles that are permitted.
 * @returns RequireRoleResult
 *
 * @example
 * const roleCheck = await requireRole("ADMIN");
 * if (!roleCheck.success) return roleCheck; // { success: false, error: "..." }
 * // roleCheck.userId is now available
 */
export async function requireRole(
  ...allowedRoles: Role[]
): Promise<RequireRoleResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const userRole = ((session.user as { role?: string }).role ?? "USER") as Role;

  if (!allowedRoles.includes(userRole)) {
    return { success: false, error: "Forbidden" };
  }

  return { success: true, userId: session.user.id, role: userRole };
}
