"use client";

import { useState } from "react";
import Link from "next/link";
import { Bookmark, Grid3x3 } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { PostGridSection } from "@/features/posts/post-grid-section";
import { ProfileHeader } from "@/features/profile/profile-header";
import {
  ProfileStats,
  type FollowList,
} from "@/features/profile/profile-stats";
import { ProfileSkeleton, ProfileTabs } from "@/features/profile/profile-tabs";
import { useMe } from "@/features/profile/use-me";
import { useMyPosts } from "@/features/profile/use-my-posts";
import { useSavedPosts } from "@/features/profile/use-saved-posts";
import { UserListDialog } from "@/features/users/user-list-dialog";

const TABS = [
  { value: "gallery", label: "Gallery", icon: Grid3x3 },
  { value: "saved", label: "Saved", icon: Bookmark },
] as const;

type Tab = (typeof TABS)[number]["value"];

function GalleryTab() {
  const query = useMyPosts();

  return (
    <PostGridSection
      query={query}
      posts={query.data?.pages.flatMap((page) => page.items)}
      errorTitle="Failed to load your posts"
      emptyState={
        <EmptyState
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
      }
    />
  );
}

function SavedTab() {
  const query = useSavedPosts();

  return (
    <PostGridSection
      query={query}
      posts={query.data?.pages.flatMap((page) => page.posts)}
      errorTitle="Failed to load saved posts"
      emptyState={
        <EmptyState
          title="No saved posts yet"
          description="Tap the bookmark on any post to keep it here."
        />
      }
    />
  );
}

export function MyProfile() {
  const { data, isPending, isError, refetch } = useMe();
  const [tab, setTab] = useState<Tab>("gallery");
  const [openList, setOpenList] = useState<FollowList | null>(null);

  if (isPending) return <ProfileSkeleton />;

  if (isError || !data) {
    return (
      <EmptyState
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
      <ProfileHeader
        name={profile.name}
        username={profile.username}
        avatarUrl={profile.avatarUrl}
        bio={profile.bio}
        action={
          <Button
            asChild
            variant="outline"
            className="h-12 flex-1 rounded-full border-neutral-900 bg-transparent px-6 text-md font-bold tracking-[-0.02em] md:w-32.5 md:flex-none dark:bg-transparent"
          >
            <Link href="/me/edit">Edit Profile</Link>
          </Button>
        }
      />

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
        <ProfileTabs tabs={TABS} value={tab} onChange={setTab} />
        <div role="tabpanel">
          {tab === "gallery" ? <GalleryTab /> : <SavedTab />}
        </div>
      </div>
    </div>
  );
}
