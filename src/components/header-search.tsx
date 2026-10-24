"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useUserSearch } from "@/features/users/use-user-search";

function ResultSkeleton() {
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

export function HeaderSearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const keyword = useDebouncedValue(query.trim());
  const { data, isPending, isError } = useUserSearch(keyword);

  const users = data?.users ?? [];
  const showResults = isOpen && keyword.length > 0;

  function close() {
    setQuery("");
    setIsOpen(false);
    setIsMobileOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIsMobileOpen(true);
          setIsOpen(true);
        }}
        className="ml-auto flex size-10 items-center justify-center md:hidden"
      >
        <Search className="size-6" />
        <span className="sr-only">Search</span>
      </button>

      <div
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsOpen(false);
            if (!query) setIsMobileOpen(false);
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") close();
        }}
        className={cn(
          "absolute inset-x-0 top-0 z-10 h-full items-center gap-3 bg-background px-4 md:relative md:inset-auto md:mx-auto md:flex md:h-auto md:w-full md:max-w-122.75 md:bg-transparent md:px-0",
          isMobileOpen ? "flex" : "hidden"
        )}
      >
        <div className="flex h-12 flex-1 items-center gap-1.5 rounded-full border border-neutral-900 bg-neutral-950 px-4 focus-within:border-ring">
          <Search className="size-5 shrink-0 text-neutral-500" />
          <input
            type="search"
            value={query}
            autoFocus={isMobileOpen}
            onChange={(event) => {
              setQuery(event.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search"
            aria-label="Search users"
            className="min-w-0 flex-1 bg-transparent text-sm tracking-[-0.02em] outline-none placeholder:text-neutral-600 [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-neutral-600"
            >
              <X className="size-4" />
              <span className="sr-only">Clear search</span>
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={close}
          className="text-sm font-semibold md:hidden"
        >
          Cancel
        </button>

        {showResults && (
          <div className="absolute inset-x-4 top-full mt-2 flex max-h-[60vh] flex-col gap-4 overflow-y-auto rounded-[20px] border border-neutral-900 bg-neutral-950 p-5 md:inset-x-0">
            {isPending ? (
              <>
                <ResultSkeleton />
                <ResultSkeleton />
              </>
            ) : isError ? (
              <p className="py-4 text-center text-sm tracking-[-0.02em] text-neutral-400">
                Failed to search. Please try again.
              </p>
            ) : users.length === 0 ? (
              <div className="flex flex-col items-center gap-1 py-4 text-center">
                <p className="text-md font-bold tracking-[-0.02em]">
                  No results found
                </p>
                <p className="text-sm tracking-[-0.02em] text-neutral-400">
                  Change your keyword
                </p>
              </div>
            ) : (
              users.map((user) => (
                <Link
                  key={user.id}
                  href={`/profile/${user.username}`}
                  onClick={close}
                  className="flex min-w-0 items-center gap-2 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
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
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
}
