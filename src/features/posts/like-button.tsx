"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToggleLike } from "@/features/posts/use-toggle-like";
import { UserListDialog } from "@/features/users/user-list-dialog";
import type { Post } from "@/types/api";

export function LikeButton({ post }: { post: Post }) {
  const toggleLike = useToggleLike();
  const [isLikesOpen, setIsLikesOpen] = useState(false);

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        aria-pressed={post.likedByMe}
        disabled={toggleLike.isPending}
        onClick={() =>
          toggleLike.mutate({ postId: post.id, liked: !post.likedByMe })
        }
      >
        <Heart
          className={cn(
            "size-6 transition-colors",
            post.likedByMe && "fill-accent-red text-accent-red"
          )}
        />
        <span className="sr-only">{post.likedByMe ? "Unlike" : "Like"}</span>
      </button>
      <button
        type="button"
        onClick={() => setIsLikesOpen(true)}
        className="text-md font-semibold tracking-[-0.02em] hover:underline"
      >
        {post.likeCount}
        <span className="sr-only"> likes, show who liked this post</span>
      </button>
      <UserListDialog
        title="Likes"
        description="People who liked this post"
        path={`/api/posts/${post.id}/likes`}
        emptyTitle="No likes yet"
        emptyDescription="Be the first to like this post."
        open={isLikesOpen}
        onOpenChange={setIsLikesOpen}
      />
    </div>
  );
}
