"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type PostCaptionProps = {
  username: string;
  caption: string;
};

export function PostCaption({ username, caption }: PostCaptionProps) {
  const captionRef = useRef<HTMLParagraphElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);

  useLayoutEffect(() => {
    const element = captionRef.current;
    if (element) {
      setIsClamped(element.scrollHeight > element.clientHeight);
    }
  }, [caption]);

  return (
    <div className="flex flex-col gap-1">
      <span className="text-md font-bold tracking-[-0.02em]">{username}</span>
      <p
        ref={captionRef}
        className={cn(
          "text-md tracking-[-0.02em] whitespace-pre-line",
          !isExpanded && "line-clamp-2"
        )}
      >
        {caption}
      </p>
      {isClamped && !isExpanded && (
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="self-start text-md font-semibold tracking-[-0.02em] text-primary-200"
        >
          Show More
        </button>
      )}
    </div>
  );
}
