/**
 * Unified Server Action response type.
 * All Server Actions should return ActionResult<T> instead of throwing.
 */
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

/** Create a success result. */
export function ok<T>(data: T): ActionResult<T> {
  return { success: true, data };
}

/** Create a success result with no data (void actions). */
export function okVoid(): ActionResult<void> {
  return { success: true, data: undefined };
}

/** Create a failure result. */
export function fail(error: string): ActionResult<never> {
  return { success: false, error };
}
