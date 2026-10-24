"use client";

import type { ReactNode } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { copyLink } from "@/lib/copy-link";

type ProfileHeaderProps = {
  name: string;
  username: string;
  avatarUrl: string | null;
  bio: string | null;
  action: ReactNode;
};

export function ProfileHeader({
  name,
  username,
  avatarUrl,
  bio,
  action,
}: ProfileHeaderProps) {
  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <UserAvatar name={name} avatarUrl={avatarUrl} className="size-16" />
          <div className="flex min-w-0 flex-col">
            <h1 className="truncate text-md font-bold tracking-[-0.02em]">
              {name}
            </h1>
            <p className="truncate text-md tracking-[-0.02em]">{username}</p>
          </div>
        </div>
        <div className="flex gap-3">
          {action}
          <Button
            variant="outline"
            onClick={() => copyLink(`/profile/${username}`)}
            className="size-12 rounded-full border-neutral-900 bg-transparent dark:bg-transparent"
          >
            <Send className="size-6" />
            <span className="sr-only">Copy profile link</span>
          </Button>
        </div>
      </div>

      {bio && (
        <p className="text-md tracking-[-0.02em] wrap-break-word whitespace-pre-line">
          {bio}
        </p>
      )}
    </>
  );
}
