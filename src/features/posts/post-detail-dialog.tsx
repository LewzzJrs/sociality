"use client";

import { X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { PostDetail } from "@/features/posts/post-detail";
import type { Post } from "@/types/api";

type PostDetailDialogProps = {
  postId: number;
  initialPost?: Post;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function PostDetailDialog({
  postId,
  initialPost,
  open,
  onOpenChange,
}: PostDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="block max-h-[90dvh] w-full max-w-[calc(100%-2rem)] overflow-y-auto rounded-none bg-transparent p-0 ring-0 sm:max-w-150 lg:w-auto lg:max-w-none lg:overflow-visible"
      >
        <DialogTitle className="sr-only">Post detail</DialogTitle>
        <DialogDescription className="sr-only">
          Post detail with comments
        </DialogDescription>
        <PostDetail
          postId={postId}
          initialPost={initialPost}
          onDeleted={() => onOpenChange(false)}
        />
        <DialogClose className="absolute top-3 right-3 z-10 rounded-full bg-black/60 p-1.5 lg:-top-12 lg:right-0 lg:bg-transparent lg:p-0">
          <X className="size-6" />
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
