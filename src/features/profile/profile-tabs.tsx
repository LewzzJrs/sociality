import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type ProfileTab<T extends string> = {
  value: T;
  label: string;
  icon: LucideIcon;
};

type ProfileTabsProps<T extends string> = {
  tabs: readonly ProfileTab<T>[];
  value: T;
  onChange: (value: T) => void;
};

export function ProfileTabs<T extends string>({
  tabs,
  value,
  onChange,
}: ProfileTabsProps<T>) {
  return (
    <div role="tablist" className="grid grid-cols-2">
      {tabs.map(({ value: tabValue, label, icon: Icon }) => {
        const isActive = tabValue === value;

        return (
          <button
            key={tabValue}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tabValue)}
            className={cn(
              "flex h-12 items-center justify-center gap-3 px-6 text-md tracking-[-0.02em]",
              isActive
                ? "border-b-2 border-neutral-25 font-bold text-neutral-25"
                : "border-b border-neutral-900 font-medium text-neutral-400"
            )}
          >
            <Icon className="size-6" />
            {label}
          </button>
        );
      })}
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-4" aria-hidden="true">
      <div className="flex items-center gap-3">
        <div className="size-16 rounded-full bg-neutral-900" />
        <div className="flex flex-col gap-2">
          <div className="h-4 w-32 rounded-sm bg-neutral-900" />
          <div className="h-3.5 w-24 rounded-sm bg-neutral-900" />
        </div>
      </div>
      <div className="h-4 w-3/4 rounded-sm bg-neutral-900" />
      <div className="h-14 rounded-sm bg-neutral-900" />
    </div>
  );
}
