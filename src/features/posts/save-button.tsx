"use client";

import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSavedIds } from "@/features/posts/use-saved-ids";
import { useToggleSave } from "@/features/posts/use-toggle-save";

export function SaveButton({ postId }: { postId: number }) {
  const savedIds = useSavedIds();
  const toggleSave = useToggleSave();
  const isSaved = savedIds.data?.includes(postId) ?? false;

  return (
    <button
      type="button"
      aria-pressed={isSaved}
      disabled={savedIds.isPending || toggleSave.isPending}
      onClick={() => toggleSave.mutate({ postId, saved: !isSaved })}
    >
      <Bookmark
        className={cn("size-6 transition-colors", isSaved && "fill-current")}
      />
      <span className="sr-only">{isSaved ? "Unsave" : "Save"}</span>
    </button>
  );
}
