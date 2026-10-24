"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Smile } from "lucide-react";
import { commentSchema, type CommentInput } from "@/features/comments/schema";
import { useAddComment } from "@/features/comments/use-add-comment";

const EMOJIS = [
  "😀",
  "😂",
  "😍",
  "🥰",
  "😎",
  "🤩",
  "😢",
  "😮",
  "😡",
  "👍",
  "👏",
  "🙌",
  "🔥",
  "💯",
  "❤️",
  "✨",
  "🎉",
  "📸",
];

export function CommentForm({ postId }: { postId: number }) {
  const addComment = useAddComment(postId);
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    setFocus,
    reset,
  } = useForm<CommentInput>({
    resolver: zodResolver(commentSchema),
    defaultValues: { text: "" },
  });
  const text = useWatch({ control, name: "text" });
  const canPost = text.trim().length > 0;

  function addEmoji(emoji: string) {
    setValue("text", getValues("text") + emoji);
    setIsEmojiOpen(false);
    setFocus("text");
  }

  function onSubmit(values: CommentInput) {
    addComment.mutate(values.text);
    reset();
    setIsEmojiOpen(false);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative flex items-center gap-2"
    >
      {isEmojiOpen && (
        <div className="absolute bottom-full left-0 mb-2 grid grid-cols-6 gap-1 rounded-xl border border-neutral-900 bg-neutral-950 p-2">
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => addEmoji(emoji)}
              className="flex size-10 items-center justify-center rounded-md text-xl hover:bg-neutral-900"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        aria-expanded={isEmojiOpen}
        onClick={() => setIsEmojiOpen((open) => !open)}
        className="flex size-12 shrink-0 items-center justify-center"
      >
        <Smile className="size-6" />
        <span className="sr-only">Add emoji</span>
      </button>

      <div className="flex h-12 min-w-0 flex-1 items-center gap-2 rounded-xl border border-neutral-900 bg-neutral-950 px-4 focus-within:border-primary-200">
        <input
          {...register("text")}
          placeholder="Add Comment"
          aria-label="Add comment"
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent text-sm tracking-[-0.02em] outline-none placeholder:text-neutral-600"
        />
        <button
          type="submit"
          disabled={!canPost}
          className="text-sm font-bold tracking-[-0.02em] text-primary-200 disabled:text-neutral-600"
        >
          Post
        </button>
      </div>
    </form>
  );
}
