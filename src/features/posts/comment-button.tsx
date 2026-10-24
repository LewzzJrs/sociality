"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { PostDetailDialog } from "@/features/posts/post-detail-dialog";
import type { Post } from "@/types/api";

export function CommentButton({ post }: { post: Post }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5"
      >
        <MessageSquare className="size-6" />
        <span className="sr-only">Comments</span>
        <span className="text-md font-semibold tracking-[-0.02em]">
          {post.commentCount}
        </span>
      </button>
      <PostDetailDialog
        postId={post.id}
        initialPost={post}
        open={isOpen}
        onOpenChange={setIsOpen}
      />
    </>
  );
}
