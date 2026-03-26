"use client";

import { ApiKeyManager } from "@/features/api-keys";

export default function ApiKeysPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">API Keys</h1>
        <p className="text-muted-foreground">
          Manage your API keys for programmatic access.
        </p>
      </div>
      <ApiKeyManager />
    </div>
  );
}
