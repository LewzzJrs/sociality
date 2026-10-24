"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Bookmark, Grid3x3, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { PostGrid, PostGridSkeleton } from "@/features/posts/post-grid";
import {
  ProfileStats,
  type FollowList,
} from "@/features/profile/profile-stats";
import { useMe } from "@/features/profile/use-me";
import { useMyPosts } from "@/features/profile/use-my-posts";
import { useSavedPosts } from "@/features/profile/use-saved-posts";
import { UserListDialog } from "@/features/users/user-list-dialog";

type Tab = "gallery" | "saved";

const TABS = [
  { value: "gallery", label: "Gallery", icon: Grid3x3 },
  { value: "saved", label: "Saved", icon: Bookmark },
] as const;

function ProfileHeaderSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-4" aria-hidden="true">
      <div className="flex items-center gap-3">
        <div className="size-16 rounded-full bg-neutral-900" />
        <div className="flex flex-col gap-2">
          <div className="h-4 w-32 rounded-sm bg-neutral-900" />
          <div className="h-3.5 w-24 rounded-sm bg-neutral-900" />
        </div>
      </div>
      <div className="h-4 w-3/4 rounded-sm bg-neutral-900" />
      <div className="h-14 rounded-sm bg-neutral-900" />
    </div>
  );
}

function GridState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-113 flex-col items-center gap-6 py-12 text-center">
      <div className="flex flex-col gap-1">
        <p className="text-lg font-bold tracking-[-0.03em]">{title}</p>
        <p className="text-md tracking-[-0.02em] text-neutral-400">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}

function GalleryTab() {
  const {
    data,
    isPending,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useMyPosts();
  const sentinelRef = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
  });

  if (isPending) return <PostGridSkeleton />;

  if (isError && !data) {
    return (
      <GridState
        title="Failed to load your posts"
        description="Please check your connection and try again."
        action={
          <Button
            variant="outline"
            onClick={() => refetch()}
            className="h-12 rounded-full px-8 text-md font-bold"
          >
            Try again
          </Button>
        }
      />
    );
  }

  const posts = data.pages.flatMap((page) => page.items);

  if (posts.length === 0) {
    return (
      <GridState
        title="Your story starts here"
        description="Share your first post and let the world see your moments, passions, and memories. Make this space truly yours."
        action={
          <Button
            asChild
            className="h-12 w-full max-w-65 rounded-full text-md font-bold tracking-[-0.02em]"
          >
            <Link href="/posts/new">Upload My First Post</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <PostGrid posts={posts} />
      <div ref={sentinelRef} />
      {isFetchingNextPage && <PostGridSkeleton />}
    </div>
  );
}

function SavedTab() {
  const {
    data,
    isPending,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useSavedPosts();
  const sentinelRef = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
  });

  if (isPending) return <PostGridSkeleton />;

  if (isError && !data) {
    return (
      <GridState
        title="Failed to load saved posts"
        description="Please check your connection and try again."
        action={
          <Button
            variant="outline"
            onClick={() => refetch()}
            className="h-12 rounded-full px-8 text-md font-bold"
          >
            Try again
          </Button>
        }
      />
    );
  }

  const posts = data.pages.flatMap((page) => page.posts);

  if (posts.length === 0) {
    return (
      <GridState
        title="No saved posts yet"
        description="Tap the bookmark on any post to keep it here."
      />
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <PostGrid posts={posts} />
      <div ref={sentinelRef} />
      {isFetchingNextPage && <PostGridSkeleton />}
    </div>
  );
}

export function MyProfile() {
  const { data, isPending, isError, refetch } = useMe();
  const [tab, setTab] = useState<Tab>("gallery");
  const [openList, setOpenList] = useState<FollowList | null>(null);

  async function copyProfileLink(username: string) {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/profile/${username}`
      );
      toast.success("Link copied");
    } catch {
      toast.error("Failed to copy link");
    }
  }

  if (isPending) return <ProfileHeaderSkeleton />;

  if (isError || !data) {
    return (
      <GridState
        title="Failed to load your profile"
        description="Please check your connection and try again."
        action={
          <Button
            onClick={() => refetch()}
            className="h-12 rounded-full px-8 text-md font-bold"
          >
            Try again
          </Button>
        }
      />
    );
  }

  const { profile, stats } = data;

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <UserAvatar
            name={profile.name}
            avatarUrl={profile.avatarUrl}
            className="size-16"
          />
          <div className="flex min-w-0 flex-col">
            <h1 className="truncate text-md font-bold tracking-[-0.02em]">
              {profile.name}
            </h1>
            <p className="truncate text-md tracking-[-0.02em]">
              {profile.username}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            asChild
            variant="outline"
            className="h-12 flex-1 rounded-full border-neutral-900 bg-transparent px-6 text-md font-bold tracking-[-0.02em] md:w-32.5 md:flex-none dark:bg-transparent"
          >
            <Link href="/me/edit">Edit Profile</Link>
          </Button>
          <Button
            variant="outline"
            onClick={() => copyProfileLink(profile.username)}
            className="size-12 rounded-full border-neutral-900 bg-transparent dark:bg-transparent"
          >
            <Send className="size-6" />
            <span className="sr-only">Copy profile link</span>
          </Button>
        </div>
      </div>

      {profile.bio && (
        <p className="text-md tracking-[-0.02em] wrap-break-word whitespace-pre-line">
          {profile.bio}
        </p>
      )}

      <ProfileStats stats={stats} onOpenList={setOpenList} />

      <UserListDialog
        title="Followers"
        description="People who follow you"
        path="/api/me/followers"
        emptyTitle="No followers yet"
        emptyDescription="Share your profile so people can find you."
        open={openList === "followers"}
        onOpenChange={(open) => setOpenList(open ? "followers" : null)}
      />
      <UserListDialog
        title="Following"
        description="People you follow"
        path="/api/me/following"
        emptyTitle="You are not following anyone yet"
        emptyDescription="Follow people to see their posts in your feed."
        open={openList === "following"}
        onOpenChange={(open) => setOpenList(open ? "following" : null)}
      />

      <div className="flex flex-col gap-6">
        <div role="tablist" className="grid grid-cols-2">
          {TABS.map(({ value, label, icon: Icon }) => {
            const isActive = tab === value;

            return (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setTab(value)}
                className={cn(
                  "flex h-12 items-center justify-center gap-3 px-6 text-md tracking-[-0.02em]",
                  isActive
                    ? "border-b-2 border-neutral-25 font-bold text-neutral-25"
                    : "border-b border-neutral-900 font-medium text-neutral-400"
                )}
              >
                <Icon className="size-6" />
                {label}
              </button>
            );
          })}
        </div>

        <div role="tabpanel">
          {tab === "gallery" ? <GalleryTab /> : <SavedTab />}
        </div>
      </div>
    </div>
  );
}
