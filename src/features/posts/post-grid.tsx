"use client";

import { useState } from "react";
import Image from "next/image";
import { PostDetailDialog } from "@/features/posts/post-detail-dialog";
import type { Post, SavedPost } from "@/types/api";

type PostGridProps = {
  posts: (Post | SavedPost)[];
};

function isFullPost(post: Post | SavedPost): post is Post {
  return "author" in post;
}

export function PostGridSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-1" aria-hidden="true">
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          className="aspect-square animate-pulse rounded-sm bg-neutral-900"
        />
      ))}
    </div>
  );
}

export function PostGrid({ posts }: PostGridProps) {
  const [selectedPost, setSelectedPost] = useState<Post | SavedPost | null>(
    null
  );

  return (
    <>
      <div className="grid grid-cols-3 gap-1">
        {posts.map((post) => (
          <button
            key={post.id}
            type="button"
            onClick={() => setSelectedPost(post)}
            className="relative aspect-square overflow-hidden rounded-sm bg-neutral-900"
          >
            <Image
              src={post.imageUrl}
              alt={post.caption ?? "Post"}
              fill
              sizes="(min-width: 860px) 268px, 33vw"
              className="object-cover transition-opacity hover:opacity-80"
            />
          </button>
        ))}
      </div>

      {selectedPost && (
        <PostDetailDialog
          postId={selectedPost.id}
          initialPost={isFullPost(selectedPost) ? selectedPost : undefined}
          open
          onOpenChange={(open) => {
            if (!open) setSelectedPost(null);
          }}
        />
      )}
    </>
  );
}
