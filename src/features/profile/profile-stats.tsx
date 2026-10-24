import type { ProfileStats as Stats } from "@/types/api";

export type FollowList = "followers" | "following";

type ProfileStatsProps = {
  stats: Stats;
  onOpenList?: (list: FollowList) => void;
};

export function ProfileStats({ stats, onOpenList }: ProfileStatsProps) {
  const items = [
    { label: "Post", value: stats.posts },
    { label: "Followers", value: stats.followers, list: "followers" },
    { label: "Following", value: stats.following, list: "following" },
    { label: "Likes", value: stats.likes },
  ] as const;

  return (
    <dl className="grid grid-cols-4 divide-x divide-neutral-900">
      {items.map((item) => {
        const content = (
          <>
            <dt className="text-xs tracking-[-0.02em] text-neutral-400 md:text-md">
              {item.label}
            </dt>
            <dd className="text-lg font-bold md:text-xl">{item.value}</dd>
          </>
        );

        return "list" in item && onOpenList ? (
          <button
            key={item.label}
            type="button"
            onClick={() => onOpenList(item.list)}
            className="flex flex-col-reverse items-center text-center transition-opacity hover:opacity-80"
          >
            {content}
          </button>
        ) : (
          <div
            key={item.label}
            className="flex flex-col-reverse items-center text-center"
          >
            {content}
          </div>
        );
      })}
    </dl>
  );
}
