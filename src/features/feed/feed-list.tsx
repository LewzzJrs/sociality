"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/features/posts/post-card";
import { PostCardSkeleton } from "@/features/posts/post-card-skeleton";
import { useFeed } from "@/features/feed/use-feed";
import type { Post } from "@/types/api";

function uniqueById(posts: Post[]) {
  const seen = new Set<number>();
  return posts.filter((post) => {
    if (seen.has(post.id)) return false;
    seen.add(post.id);
    return true;
  });
}

export function FeedList() {
  const {
    data,
    isPending,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useFeed();
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasNextPage || isFetchNextPageError) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "400px" }
    );
    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, isFetchNextPageError, fetchNextPage]);

  if (isPending) {
    return (
      <div className="flex flex-col gap-6">
        <PostCardSkeleton />
        <PostCardSkeleton />
      </div>
    );
  }

  if (isError && !data) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-md font-bold tracking-[-0.02em]">
          Failed to load your feed
        </p>
        <p className="text-sm tracking-[-0.02em] text-neutral-400">
          Please check your connection and try again.
        </p>
        <Button
          onClick={() => refetch()}
          className="h-12 rounded-full px-8 text-md font-bold tracking-[-0.02em]"
        >
          Try again
        </Button>
      </div>
    );
  }

  const posts = uniqueById(data.pages.flatMap((page) => page.items));

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center">
        <p className="text-lg font-bold tracking-[-0.03em]">
          Your feed is empty
        </p>
        <p className="max-w-113 text-md tracking-[-0.02em] text-neutral-400">
          Follow people to see their posts here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      <div ref={sentinelRef} />

      {isFetchingNextPage && <PostCardSkeleton />}

      {isFetchNextPageError && (
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-sm tracking-[-0.02em] text-neutral-400">
            Failed to load more posts.
          </p>
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            className="h-11 rounded-full px-6 text-sm font-bold"
          >
            Try again
          </Button>
        </div>
      )}

      {!hasNextPage && (
        <p className="text-center text-sm tracking-[-0.02em] text-neutral-400">
          You&apos;re all caught up
        </p>
      )}
    </div>
  );
}
