"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { fromNow } from "@/lib/date";
import { useComments } from "@/features/comments/use-comments";
import { useDeleteComment } from "@/features/comments/use-delete-comment";
import { useMe } from "@/features/profile/use-me";
import type { Comment } from "@/types/api";

type CommentListProps = {
  postId: number;
  postAuthorId: number;
};

function uniqueById(comments: Comment[]) {
  const seen = new Set<number>();
  return comments.filter((comment) => {
    if (seen.has(comment.id)) return false;
    seen.add(comment.id);
    return true;
  });
}

function CommentSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-2 py-3" aria-hidden="true">
      <div className="flex items-center gap-2">
        <div className="size-10 rounded-full bg-neutral-900" />
        <div className="flex flex-col gap-1.5">
          <div className="h-3.5 w-24 rounded-sm bg-neutral-900" />
          <div className="h-3 w-16 rounded-sm bg-neutral-900" />
        </div>
      </div>
      <div className="h-3.5 w-48 rounded-sm bg-neutral-900" />
    </div>
  );
}

export function CommentList({ postId, postAuthorId }: CommentListProps) {
  const {
    data,
    isPending,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useComments(postId);
  const { data: me } = useMe();
  const deleteComment = useDeleteComment(postId);
  const myId = me?.profile.id;

  if (isPending) {
    return (
      <div>
        <CommentSkeleton />
        <CommentSkeleton />
        <CommentSkeleton />
      </div>
    );
  }

  if (isError && !data) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <p className="text-sm tracking-[-0.02em] text-neutral-400">
          Failed to load comments.
        </p>
        <Button
          variant="outline"
          onClick={() => refetch()}
          className="h-10 rounded-full px-6 text-sm font-bold"
        >
          Try again
        </Button>
      </div>
    );
  }

  const comments = uniqueById(data.pages.flatMap((page) => page.comments));

  if (comments.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-1 py-8 text-center">
        <p className="text-md font-bold tracking-[-0.02em]">No Comments yet</p>
        <p className="text-sm tracking-[-0.02em] text-neutral-400">
          Start the conversation
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <ul className="divide-y divide-neutral-900">
        {comments.map((comment) => {
          const canDelete =
            myId !== undefined &&
            comment.id > 0 &&
            (comment.author.id === myId || postAuthorId === myId);

          return (
            <li key={comment.id} className="flex flex-col gap-2 py-3">
              <div className="flex items-center gap-2">
                <Link
                  href={`/profile/${comment.author.username}`}
                  className="flex min-w-0 flex-1 items-center gap-2"
                >
                  <UserAvatar
                    name={comment.author.name}
                    avatarUrl={comment.author.avatarUrl}
                    className="size-10"
                  />
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-bold tracking-[-0.01em]">
                      {comment.author.name}
                    </span>
                    <span className="text-xs text-neutral-400 capitalize">
                      {fromNow(comment.createdAt)}
                    </span>
                  </div>
                </Link>
                {canDelete && (
                  <button
                    type="button"
                    onClick={() => deleteComment.mutate(comment.id)}
                    className="text-neutral-500 transition-colors hover:text-accent-red"
                  >
                    <Trash2 className="size-4" />
                    <span className="sr-only">Delete comment</span>
                  </button>
                )}
              </div>
              <p className="text-sm tracking-[-0.02em] break-words whitespace-pre-line">
                {comment.text}
              </p>
            </li>
          );
        })}
      </ul>

      {hasNextPage && (
        <Button
          variant="outline"
          disabled={isFetchingNextPage}
          onClick={() => fetchNextPage()}
          className="mt-2 h-10 self-center rounded-full px-6 text-sm font-bold"
        >
          {isFetchingNextPage ? "Loading..." : "Load more comments"}
        </Button>
      )}
    </div>
  );
}
