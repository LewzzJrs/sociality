"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Grid3x3, Heart } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api";
import { PostGridSection } from "@/features/posts/post-grid-section";
import { FollowButton } from "@/features/profile/follow-button";
import { ProfileHeader } from "@/features/profile/profile-header";
import {
  ProfileStats,
  type FollowList,
} from "@/features/profile/profile-stats";
import { ProfileSkeleton, ProfileTabs } from "@/features/profile/profile-tabs";
import { UserListDialog } from "@/features/users/user-list-dialog";
import {
  useUserPosts,
  useUserProfile,
} from "@/features/users/use-user-profile";

const TABS = [
  { value: "posts", label: "Gallery", icon: Grid3x3 },
  { value: "likes", label: "Liked", icon: Heart },
] as const;

type Tab = (typeof TABS)[number]["value"];

function UserPostsTab({ username, kind }: { username: string; kind: Tab }) {
  const query = useUserPosts(username, kind);

  return (
    <PostGridSection
      query={query}
      posts={query.data?.pages.flatMap((page) => page.posts)}
      errorTitle="Failed to load posts"
      emptyState={
        kind === "posts" ? (
          <EmptyState
            title="No posts yet"
            description={`${username} hasn't shared anything yet.`}
          />
        ) : (
          <EmptyState
            title="No liked posts yet"
            description={`Posts ${username} likes will show up here.`}
          />
        )
      }
    />
  );
}

export function UserProfileView({ username }: { username: string }) {
  const router = useRouter();
  const { data, isPending, isError, error, refetch } = useUserProfile(username);
  const [tab, setTab] = useState<Tab>("posts");
  const [openList, setOpenList] = useState<FollowList | null>(null);

  useEffect(() => {
    if (data?.isMe) router.replace("/me");
  }, [data?.isMe, router]);

  if (isPending || data?.isMe) return <ProfileSkeleton />;

  if (isError || !data) {
    const isNotFound = error instanceof ApiError && error.status === 404;

    return (
      <EmptyState
        title={isNotFound ? "User not found" : "Failed to load this profile"}
        description={
          isNotFound
            ? "This account may have been removed or the link is wrong."
            : "Please check your connection and try again."
        }
        action={
          !isNotFound && (
            <Button
              onClick={() => refetch()}
              className="h-12 rounded-full px-8 text-md font-bold"
            >
              Try again
            </Button>
          )
        }
      />
    );
  }

  const { counts } = data;
  const basePath = `/api/users/${encodeURIComponent(data.username)}`;

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <ProfileHeader
        name={data.name}
        username={data.username}
        avatarUrl={data.avatarUrl}
        bio={data.bio}
        action={
          <FollowButton
            username={data.username}
            isFollowing={data.isFollowing}
            className="h-12 flex-1 px-6 text-md md:w-32.5 md:flex-none"
          />
        }
      />

      <ProfileStats
        stats={{
          posts: counts.post,
          followers: counts.followers,
          following: counts.following,
          likes: counts.likes,
        }}
        onOpenList={setOpenList}
      />

      <UserListDialog
        title="Followers"
        description={`People who follow ${data.username}`}
        path={`${basePath}/followers`}
        emptyTitle="No followers yet"
        emptyDescription={`Be the first to follow ${data.username}.`}
        open={openList === "followers"}
        onOpenChange={(open) => setOpenList(open ? "followers" : null)}
      />
      <UserListDialog
        title="Following"
        description={`People ${data.username} follows`}
        path={`${basePath}/following`}
        emptyTitle="Not following anyone yet"
        emptyDescription={`${data.username} isn't following anyone yet.`}
        open={openList === "following"}
        onOpenChange={(open) => setOpenList(open ? "following" : null)}
      />

      <div className="flex flex-col gap-6">
        <ProfileTabs tabs={TABS} value={tab} onChange={setTab} />
        <div role="tabpanel">
          <UserPostsTab key={tab} username={data.username} kind={tab} />
        </div>
      </div>
    </div>
  );
}
