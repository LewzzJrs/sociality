"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToggleLike } from "@/features/posts/use-toggle-like";
import type { Post } from "@/types/api";

export function LikeButton({ post }: { post: Post }) {
  const toggleLike = useToggleLike();

  return (
    <button
      type="button"
      aria-pressed={post.likedByMe}
      disabled={toggleLike.isPending}
      onClick={() =>
        toggleLike.mutate({ postId: post.id, liked: !post.likedByMe })
      }
      className="flex items-center gap-1.5"
    >
      <Heart
        className={cn(
          "size-6 transition-colors",
          post.likedByMe && "fill-accent-red text-accent-red"
        )}
      />
      <span className="sr-only">{post.likedByMe ? "Unlike" : "Like"}</span>
      <span className="text-md font-semibold tracking-[-0.02em]">
        {post.likeCount}
      </span>
    </button>
  );
}
