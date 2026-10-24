"use client";

import type { ReactNode } from "react";
import type { UseInfiniteQueryResult } from "@tanstack/react-query";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { PostGrid, PostGridSkeleton } from "@/features/posts/post-grid";
import type { Post, SavedPost } from "@/types/api";

type GridQuery = Pick<
  UseInfiniteQueryResult<unknown>,
  | "isPending"
  | "isError"
  | "refetch"
  | "hasNextPage"
  | "isFetchingNextPage"
  | "isFetchNextPageError"
  | "fetchNextPage"
>;

type PostGridSectionProps = {
  query: GridQuery;
  posts: (Post | SavedPost)[] | undefined;
  errorTitle: string;
  emptyState: ReactNode;
};

export function PostGridSection({
  query,
  posts,
  errorTitle,
  emptyState,
}: PostGridSectionProps) {
  const sentinelRef = useInfiniteScroll(query);

  if (query.isPending) return <PostGridSkeleton />;

  if (query.isError && !posts) {
    return (
      <EmptyState
        title={errorTitle}
        description="Please check your connection and try again."
        action={
          <Button
            variant="outline"
            onClick={() => query.refetch()}
            className="h-12 rounded-full px-8 text-md font-bold"
          >
            Try again
          </Button>
        }
      />
    );
  }

  if (!posts || posts.length === 0) return emptyState;

  return (
    <div className="flex flex-col gap-1">
      <PostGrid posts={posts} />
      <div ref={sentinelRef} />
      {query.isFetchingNextPage && <PostGridSkeleton />}
    </div>
  );
}
