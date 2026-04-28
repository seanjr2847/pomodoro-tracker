"use client";

import { Link2, Share2, FileText } from "lucide-react";
import {
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/shared/ui";
import { copyToClipboard } from "@/shared/utils/clipboard";
import { useShare } from "../hooks/useShare";
import { exportToPdf } from "../lib/pdf";

interface ShareButtonProps {
  resourceType: string;
  resourceId: string;
  title?: string;
  pdfElementRef?: React.RefObject<HTMLElement | null>;
}

export function ShareButton({ resourceType, resourceId, title, pdfElementRef }: ShareButtonProps) {
  const { isShared, create } = useShare({ resourceType, resourceId });

  async function handleCopyLink() {
    if (isShared) {
      await copyToClipboard(`${window.location.origin}/s/${resourceId}`, "Link copied!");
    } else {
      await create();
    }
  }

  function handleShareTwitter() {
    const text = encodeURIComponent(title ?? "Check this out!");
    const url = encodeURIComponent(`${window.location.origin}/s/${resourceId}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  }

  async function handleExportPdf() {
    if (pdfElementRef?.current) {
      await exportToPdf(pdfElementRef.current, `${title ?? "export"}.pdf`);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Link2 className="mr-1 h-3 w-3" /> Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleCopyLink}>
          <Link2 className="mr-2 h-4 w-4" /> Copy link
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleShareTwitter}>
          <Share2 className="mr-2 h-4 w-4" /> Share on X
        </DropdownMenuItem>
        {pdfElementRef && (
          <DropdownMenuItem onClick={handleExportPdf}>
            <FileText className="mr-2 h-4 w-4" /> Export PDF
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
