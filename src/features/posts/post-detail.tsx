"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { UserAvatar } from "@/components/user-avatar";
import { ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";
import { fromNow } from "@/lib/date";
import { CommentForm } from "@/features/comments/comment-form";
import { CommentList } from "@/features/comments/comment-list";
import { LikeButton } from "@/features/posts/like-button";
import { PostMenu } from "@/features/posts/post-menu";
import { useMe } from "@/features/profile/use-me";
import { SaveButton } from "@/features/posts/save-button";
import { ShareButton } from "@/features/posts/share-button";
import { usePost } from "@/features/posts/use-post";
import type { Post } from "@/types/api";

const DETAIL_HEIGHT = "lg:h-[min(45rem,calc(100dvh-10rem),calc(100vw-34rem))]";

type PostDetailProps = {
  postId: number;
  initialPost?: Post;
  className?: string;
  onDeleted?: () => void;
};

function PostDetailSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col bg-neutral-950 lg:flex-row",
        DETAIL_HEIGHT,
        className
      )}
      aria-hidden="true"
    >
      <div className="aspect-square w-full animate-pulse bg-neutral-900 lg:h-full lg:w-auto" />
      <div className="flex animate-pulse items-center gap-2 p-4 lg:w-120 lg:items-start">
        <div className="size-10 rounded-full bg-neutral-900" />
        <div className="flex flex-col gap-1.5">
          <div className="h-3.5 w-24 rounded-sm bg-neutral-900" />
          <div className="h-3 w-16 rounded-sm bg-neutral-900" />
        </div>
      </div>
    </div>
  );
}

export function PostDetail({
  postId,
  initialPost,
  className,
  onDeleted,
}: PostDetailProps) {
  const {
    data: post,
    isPending,
    isError,
    error,
  } = usePost(postId, initialPost);
  const { data: me } = useMe();
  const router = useRouter();

  if (isPending) return <PostDetailSkeleton className={className} />;

  if (isError && !post) {
    const isNotFound = error instanceof ApiError && error.status === 404;

    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center">
        <p className="text-md font-bold tracking-[-0.02em]">
          {isNotFound ? "Post not found" : "Failed to load post"}
        </p>
        <p className="text-sm tracking-[-0.02em] text-neutral-400">
          {isNotFound
            ? "This post may have been deleted."
            : "Please check your connection and try again."}
        </p>
      </div>
    );
  }

  const { author } = post;

  return (
    <div
      className={cn(
        "flex flex-col bg-neutral-950 lg:flex-row",
        DETAIL_HEIGHT,
        className
      )}
    >
      <div className="relative aspect-square w-full shrink-0 bg-neutral-900 lg:h-full lg:w-auto">
        <Image
          src={post.imageUrl}
          alt={post.caption ?? `Post by ${author.username}`}
          fill
          sizes="(min-width: 1024px) 720px, 600px"
          className="object-cover"
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col lg:w-120 lg:flex-none">
        <div className="flex flex-col gap-3 border-b border-neutral-900 p-4">
          <div className="flex items-center justify-between gap-3">
            <Link
              href={`/profile/${author.username}`}
              className="flex min-w-0 items-center gap-2"
            >
              <UserAvatar
                name={author.name}
                avatarUrl={author.avatarUrl}
                className="size-10"
              />
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-bold tracking-[-0.01em]">
                  {author.name}
                </span>
                <span className="text-xs text-neutral-400 capitalize">
                  {fromNow(post.createdAt)}
                </span>
              </div>
            </Link>
            {me?.profile.id === author.id && (
              <PostMenu
                postId={post.id}
                onDeleted={onDeleted ?? (() => router.push("/me"))}
              />
            )}
          </div>
          {post.caption && (
            <p className="text-sm tracking-[-0.02em] break-words whitespace-pre-line">
              {post.caption}
            </p>
          )}
        </div>

        <div className="flex min-h-0 flex-1 flex-col px-4 pt-4">
          <h3 className="text-md font-bold tracking-[-0.02em]">Comments</h3>
          <div className="min-h-40 flex-1 overflow-y-auto">
            <CommentList postId={post.id} postAuthorId={author.id} />
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-neutral-900 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <LikeButton post={post} />
              <div className="flex items-center gap-1.5">
                <MessageSquare className="size-6" />
                <span className="sr-only">Comments</span>
                <span className="text-md font-semibold tracking-[-0.02em]">
                  {post.commentCount}
                </span>
              </div>
              <ShareButton postId={post.id} />
            </div>
            <SaveButton postId={post.id} />
          </div>
          <CommentForm postId={post.id} />
        </div>
      </div>
    </div>
  );
}
