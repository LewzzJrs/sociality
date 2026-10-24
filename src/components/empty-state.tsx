import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="mx-auto flex max-w-113 flex-col items-center gap-6 py-12 text-center">
      <div className="flex flex-col gap-1">
        <p className="text-lg font-bold tracking-[-0.03em]">{title}</p>
        <p className="text-md tracking-[-0.02em] text-neutral-400">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}
