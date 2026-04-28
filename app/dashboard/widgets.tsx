/**
 * Dashboard Widget Registry
 *
 * Feature 삭제 시: 해당 import + widgets 배열에서 제거하면 됩니다.
 */

// ── usage ────────────────────────────────────
import { UsageDashboard } from "@/features/usage";

// ── api-keys ─────────────────────────────────
import { ApiKeyManager } from "@/features/api-keys";

// ── feedback ─────────────────────────────────
import { FeedbackForm } from "@/features/feedback";

export { UsageDashboard, ApiKeyManager, FeedbackForm };
