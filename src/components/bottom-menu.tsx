"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Plus, User } from "lucide-react";
import { cn } from "@/lib/utils";

const itemClassName =
  "flex w-20 flex-col items-center gap-1 text-md tracking-[-0.02em] md:w-23.5";

export function BottomMenu() {
  const pathname = usePathname();
  const isHome = pathname.startsWith("/feed");
  const isProfile = pathname.startsWith("/me");

  return (
    <nav
      aria-label="Main"
      className="fixed bottom-4 left-1/2 z-40 flex h-16 w-[calc(100%-32px)] max-w-90 -translate-x-1/2 items-center justify-center gap-6 rounded-full border border-neutral-900 bg-neutral-950 md:bottom-8 md:h-20 md:gap-11.25"
    >
      <Link
        href="/feed"
        aria-current={isHome ? "page" : undefined}
        className={cn(
          itemClassName,
          isHome ? "font-bold text-primary-200" : "text-foreground"
        )}
      >
        <House className="size-6" />
        Home
      </Link>
      <Link
        href="/posts/new"
        aria-label="Add post"
        className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-300 text-foreground"
      >
        <Plus className="size-6" />
      </Link>
      <Link
        href="/me"
        aria-current={isProfile ? "page" : undefined}
        className={cn(
          itemClassName,
          isProfile ? "font-bold text-primary-200" : "text-foreground"
        )}
      >
        <User className="size-6" />
        Profile
      </Link>
    </nav>
  );
}
