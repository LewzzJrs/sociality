"use client";

import { CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToggleFollow } from "@/features/profile/use-toggle-follow";

type FollowButtonProps = {
  username: string;
  isFollowing: boolean;
  className?: string;
};

export function FollowButton({
  username,
  isFollowing,
  className,
}: FollowButtonProps) {
  const toggleFollow = useToggleFollow();

  return (
    <Button
      variant={isFollowing ? "outline" : "default"}
      disabled={toggleFollow.isPending}
      onClick={() => toggleFollow.mutate({ username, follow: !isFollowing })}
      className={cn(
        "h-10 gap-2 rounded-full px-4 text-sm font-bold tracking-[-0.02em]",
        isFollowing
          ? "border-neutral-900 bg-transparent dark:bg-transparent"
          : "px-6",
        className
      )}
    >
      {isFollowing && <CircleCheck className="size-5" />}
      {isFollowing ? "Following" : "Follow"}
    </Button>
  );
}
