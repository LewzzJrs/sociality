import Image from "next/image";
import Link from "next/link";
import { Bookmark, MessageSquare } from "lucide-react";
import { UserAvatar } from "@/components/user-avatar";
import { LikeButton } from "@/features/posts/like-button";
import { PostCaption } from "@/features/posts/post-caption";
import { ShareButton } from "@/features/posts/share-button";
import { fromNow } from "@/lib/date";
import type { Post } from "@/types/api";

export function PostCard({ post }: { post: Post }) {
  const { author } = post;

  return (
    <article className="flex flex-col gap-3">
      <Link
        href={`/profile/${author.username}`}
        className="flex items-center gap-3"
      >
        <UserAvatar
          name={author.name}
          avatarUrl={author.avatarUrl}
          className="size-11 md:size-16"
        />
        <div className="flex flex-col">
          <span className="text-md font-bold tracking-[-0.02em]">
            {author.username}
          </span>
          <span className="text-sm tracking-[-0.02em] text-neutral-400 capitalize">
            {fromNow(post.createdAt)}
          </span>
        </div>
      </Link>

      <div className="relative aspect-square overflow-hidden rounded-md bg-neutral-900">
        <Image
          src={post.imageUrl}
          alt={post.caption ?? `Post by ${author.username}`}
          fill
          sizes="(min-width: 768px) 600px, 100vw"
          className="object-cover"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <LikeButton post={post} />
          <Link
            href={`/posts/${post.id}`}
            className="flex items-center gap-1.5"
          >
            <MessageSquare className="size-6" />
            <span className="sr-only">Comments</span>
            <span className="text-md font-semibold tracking-[-0.02em]">
              {post.commentCount}
            </span>
          </Link>
          <ShareButton postId={post.id} />
        </div>
        <button type="button">
          <Bookmark className="size-6" />
          <span className="sr-only">Save</span>
        </button>
      </div>

      {post.caption && (
        <PostCaption username={author.username} caption={post.caption} />
      )}
    </article>
  );
}
