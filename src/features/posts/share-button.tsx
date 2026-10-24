"use client";

import { Send } from "lucide-react";
import { copyLink } from "@/lib/copy-link";

export function ShareButton({ postId }: { postId: number }) {
  return (
    <button type="button" onClick={() => copyLink(`/posts/${postId}`)}>
      <Send className="size-6" />
      <span className="sr-only">Copy link</span>
    </button>
  );
}
