import { toast } from "sonner";

export async function copyLink(path: string) {
  try {
    await navigator.clipboard.writeText(`${window.location.origin}${path}`);
    toast.success("Link copied");
  } catch {
    toast.error("Failed to copy link");
  }
}
