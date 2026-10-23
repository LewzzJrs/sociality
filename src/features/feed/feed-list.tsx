"use client";

import { PostCard } from "@/features/posts/post-card";
import { useFeed } from "@/features/feed/use-feed";

export function FeedList() {
  const { data, isPending, isError } = useFeed();

  if (isPending) {
    return <p className="text-center text-neutral-400">Loading...</p>;
  }

  if (isError) {
    return <p className="text-center text-destructive">Failed to load feed.</p>;
  }

  const posts = data.pages.flatMap((page) => page.items);

  if (posts.length === 0) {
    return <p className="text-center text-neutral-400">No posts yet.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
