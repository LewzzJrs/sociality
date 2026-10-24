"use client";

import { Send } from "lucide-react";
import { toast } from "sonner";

export function ShareButton({ postId }: { postId: number }) {
  async function copyLink() {
    const url = `${window.location.origin}/posts/${postId}`;

    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch {
      toast.error("Failed to copy link");
    }
  }

  return (
    <button type="button" onClick={copyLink}>
      <Send className="size-6" />
      <span className="sr-only">Copy link</span>
    </button>
  );
}
