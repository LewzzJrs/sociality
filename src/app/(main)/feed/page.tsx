import type { Metadata } from "next";
import { FeedList } from "@/features/feed/feed-list";

export const metadata: Metadata = {
  title: "Feed | Sociality",
};

export default function FeedPage() {
  return (
    <main className="mx-auto w-full max-w-150 px-4 py-6 md:px-0 md:py-10">
      <FeedList />
    </main>
  );
}
