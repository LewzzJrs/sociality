export function PostCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-3" aria-hidden="true">
      <div className="flex items-center gap-3">
        <div className="size-11 rounded-full bg-neutral-900 md:size-16" />
        <div className="flex flex-col gap-2">
          <div className="h-4 w-28 rounded-sm bg-neutral-900" />
          <div className="h-3 w-20 rounded-sm bg-neutral-900" />
        </div>
      </div>
      <div className="aspect-square rounded-md bg-neutral-900" />
      <div className="h-4 w-40 rounded-sm bg-neutral-900" />
    </div>
  );
}
