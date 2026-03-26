"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Copy, Plus, Trash2, Key } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from "@/shared/ui";
import {
  createApiKeyAction,
  listApiKeysAction,
  revokeApiKeyAction,
} from "../actions/apiKeyActions";

export function ApiKeyManager() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [newKey, setNewKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { data: keys = [], isLoading } = useQuery({
    queryKey: ["api-keys"],
    queryFn: () => listApiKeysAction(),
  });

  const createMutation = useMutation({
    mutationFn: (name: string) => createApiKeyAction(name),
    onSuccess: (data) => {
      setNewKey(data.rawKey);
      setName("");
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
    },
  });

  const revokeMutation = useMutation({
    mutationFn: (keyId: string) => revokeApiKeyAction(keyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
    },
  });

  const copyKey = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" /> API Keys
        </CardTitle>
        <CardDescription>
          Manage your API keys for programmatic access.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {newKey && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-900 dark:bg-green-950">
            <p className="mb-2 text-sm font-medium text-green-800 dark:text-green-200">
              Key created! Copy it now — it won&apos;t be shown again.
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded bg-white px-2 py-1 font-mono text-xs dark:bg-neutral-900">
                {newKey}
              </code>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyKey(newKey)}
              >
                <Copy className="mr-1 h-3 w-3" />
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (name.trim()) createMutation.mutate(name.trim());
          }}
          className="flex gap-2"
        >
          <Input
            placeholder="Key name (e.g. Production)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={!name.trim() || createMutation.isPending}
          >
            <Plus className="mr-1 h-4 w-4" />
            Create
          </Button>
        </form>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : keys.length === 0 ? (
          <p className="text-sm text-muted-foreground">No API keys yet.</p>
        ) : (
          <div className="space-y-2">
            {keys.map((k) => (
              <div
                key={k.id}
                className="flex items-center justify-between rounded-lg border px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium">{k.name}</p>
                  <p className="font-mono text-xs text-muted-foreground">
                    sk_...{k.key.slice(-8)}
                  </p>
                  {k.lastUsedAt && (
                    <p className="text-xs text-muted-foreground">
                      Last used{" "}
                      {new Date(k.lastUsedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={() => revokeMutation.mutate(k.id)}
                  disabled={revokeMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
