"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserAvatar } from "@/components/user-avatar";
import { FollowButton } from "@/features/profile/follow-button";
import { useMe } from "@/features/profile/use-me";
import { useUserList } from "@/features/users/use-user-list";

type UserListDialogProps = {
  title: string;
  description: string;
  path: string;
  emptyTitle: string;
  emptyDescription: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function UserRowSkeleton() {
  return (
    <div className="flex animate-pulse items-center gap-2" aria-hidden="true">
      <div className="size-12 rounded-full bg-neutral-900" />
      <div className="flex flex-col gap-2">
        <div className="h-3.5 w-28 rounded-sm bg-neutral-900" />
        <div className="h-3 w-20 rounded-sm bg-neutral-900" />
      </div>
    </div>
  );
}

export function UserListDialog({
  title,
  description,
  path,
  emptyTitle,
  emptyDescription,
  open,
  onOpenChange,
}: UserListDialogProps) {
  const {
    data,
    isPending,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUserList(path, open);
  const { data: me } = useMe();
  const myId = me?.profile.id;

  const users = data?.pages.flatMap((page) => page.users) ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-137 gap-5 rounded-2xl border border-neutral-900 bg-neutral-950 p-5 ring-0 sm:max-w-137">
        <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
        <DialogDescription className="sr-only">{description}</DialogDescription>

        <div className="-mr-2 flex max-h-[60vh] flex-col gap-5 overflow-y-auto pr-2">
          {isPending ? (
            <>
              <UserRowSkeleton />
              <UserRowSkeleton />
              <UserRowSkeleton />
            </>
          ) : isError && !data ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <p className="text-sm tracking-[-0.02em] text-neutral-400">
                Failed to load this list.
              </p>
              <Button
                variant="outline"
                onClick={() => refetch()}
                className="h-10 rounded-full px-6 text-sm font-bold"
              >
                Try again
              </Button>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center gap-1 py-6 text-center">
              <p className="text-md font-bold tracking-[-0.02em]">
                {emptyTitle}
              </p>
              <p className="text-sm tracking-[-0.02em] text-neutral-400">
                {emptyDescription}
              </p>
            </div>
          ) : (
            <>
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between gap-3"
                >
                  <Link
                    href={`/profile/${user.username}`}
                    onClick={() => onOpenChange(false)}
                    className="flex min-w-0 items-center gap-2"
                  >
                    <UserAvatar
                      name={user.name}
                      avatarUrl={user.avatarUrl}
                      className="size-12"
                    />
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-sm font-bold tracking-[-0.01em]">
                        {user.name}
                      </span>
                      <span className="truncate text-sm tracking-[-0.02em] text-neutral-400">
                        {user.username}
                      </span>
                    </div>
                  </Link>
                  {!user.isMe && user.id !== myId && (
                    <FollowButton
                      username={user.username}
                      isFollowing={user.isFollowedByMe}
                    />
                  )}
                </div>
              ))}

              {hasNextPage && (
                <Button
                  variant="outline"
                  disabled={isFetchingNextPage}
                  onClick={() => fetchNextPage()}
                  className="h-10 self-center rounded-full px-6 text-sm font-bold"
                >
                  {isFetchingNextPage ? "Loading..." : "Load more"}
                </Button>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
