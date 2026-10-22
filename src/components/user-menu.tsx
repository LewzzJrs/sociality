"use client";

import Link from "next/link";
import { LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/features/auth/use-logout";
import { useMe } from "@/features/profile/use-me";

export function UserMenu() {
  const { data, isPending } = useMe();
  const logout = useLogout();

  if (isPending) {
    return (
      <div className="size-10 animate-pulse rounded-full bg-neutral-900 md:size-12" />
    );
  }

  if (!data) {
    return null;
  }

  const { profile } = data;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Account menu"
        className="flex items-center gap-3.25 rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <Avatar className="size-10 md:size-12">
          <AvatarImage src={profile.avatarUrl ?? undefined} alt="" />
          <AvatarFallback className="bg-neutral-900 text-md font-bold text-foreground">
            {profile.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="hidden text-md font-bold tracking-[-0.02em] md:inline">
          {profile.name}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 border border-neutral-900 bg-neutral-950"
      >
        <DropdownMenuItem asChild>
          <Link href="/me">
            <User />
            My Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onSelect={logout}>
          <LogOut />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
