"use client";

import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createShareLinkAction,
  getShareLinkAction,
  deleteShareLinkAction,
} from "../actions/share";
import { copyToClipboard } from "@/shared/utils/clipboard";

interface UseShareOptions {
  resourceType: string;
  resourceId: string;
}

export function useShare({ resourceType, resourceId }: UseShareOptions) {
  const qc = useQueryClient();
  const queryKey = ["share", resourceType, resourceId];

  const { data: shareLink, isLoading } = useQuery({
    queryKey,
    queryFn: () => getShareLinkAction(resourceType, resourceId),
  });

  const createMut = useMutation({
    mutationFn: createShareLinkAction,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey });
      const url = `${window.location.origin}${data.url}`;
      copyToClipboard(url, "Share link copied!");
    },
  });

  const removeMut = useMutation({
    mutationFn: deleteShareLinkAction,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey });
      toast.success("Share link removed");
    },
  });

  const create = useCallback(
    (options?: { password?: string; expiresAt?: Date }) =>
      createMut.mutateAsync({ resourceType, resourceId, ...options }),
    [createMut, resourceType, resourceId],
  );

  const remove = useCallback(
    () => {
      if (shareLink?.id) return removeMut.mutateAsync(shareLink.id);
    },
    [removeMut, shareLink],
  );

  return {
    shareLink,
    isShared: !!shareLink,
    isLoading,
    create,
    remove,
  };
}
