"use client";

import { useState } from "react";
import { Ellipsis, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeletePost } from "@/features/posts/use-delete-post";

type PostMenuProps = {
  postId: number;
  onDeleted: () => void;
};

export function PostMenu({ postId, onDeleted }: PostMenuProps) {
  const deletePost = useDeletePost();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex size-8 items-center justify-center rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
          <Ellipsis className="size-6" />
          <span className="sr-only">Post options</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-44 border border-neutral-900 bg-neutral-950"
        >
          <DropdownMenuItem
            variant="destructive"
            onSelect={() => setIsConfirmOpen(true)}
          >
            <Trash2 />
            Delete Post
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="max-w-100 gap-5 rounded-2xl border border-neutral-900 bg-neutral-950 p-6 ring-0 sm:max-w-100">
          <div className="flex flex-col gap-1">
            <DialogTitle className="text-lg font-bold">
              Delete post?
            </DialogTitle>
            <DialogDescription className="text-sm tracking-[-0.02em] text-neutral-400">
              This post and its comments will be removed. This can&apos;t be
              undone.
            </DialogDescription>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setIsConfirmOpen(false)}
              className="h-11 flex-1 rounded-full border-neutral-900 bg-transparent text-sm font-bold dark:bg-transparent"
            >
              Cancel
            </Button>
            <Button
              disabled={deletePost.isPending}
              onClick={() =>
                deletePost.mutate(postId, {
                  onSuccess: () => {
                    setIsConfirmOpen(false);
                    onDeleted();
                  },
                })
              }
              className="h-11 flex-1 rounded-full bg-accent-red text-sm font-bold text-white hover:bg-accent-red/80"
            >
              {deletePost.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
