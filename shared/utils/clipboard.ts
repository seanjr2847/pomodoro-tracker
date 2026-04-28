import { toast } from "sonner";

export async function copyToClipboard(
  text: string,
  message = "Copied to clipboard",
) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(message);
    return true;
  } catch {
    toast.error("Failed to copy");
    return false;
  }
}
