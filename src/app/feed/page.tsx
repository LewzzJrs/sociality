import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feed | Sociality",
};

export default function FeedPage() {
  return (
    <main className="p-4">
      <h1 className="text-display-xs font-bold">Feed</h1>
    </main>
  );
}