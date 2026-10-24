import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import type { FeedData, Post } from "@/types/api";

export const postKey = (postId: number) => ["post", postId];

type PostCacheSnapshot = {
  feed: InfiniteData<FeedData> | undefined;
  post: Post | undefined;
};

export async function snapshotPostCaches(
  queryClient: QueryClient,
  postId: number
): Promise<PostCacheSnapshot> {
  await Promise.all([
    queryClient.cancelQueries({ queryKey: ["feed"] }),
    queryClient.cancelQueries({ queryKey: postKey(postId) }),
  ]);

  return {
    feed: queryClient.getQueryData<InfiniteData<FeedData>>(["feed"]),
    post: queryClient.getQueryData<Post>(postKey(postId)),
  };
}

export function updatePostInCaches(
  queryClient: QueryClient,
  postId: number,
  update: (post: Post) => Post
) {
  queryClient.setQueryData<InfiniteData<FeedData>>(["feed"], (old) =>
    old
      ? {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            items: page.items.map((post) =>
              post.id === postId ? update(post) : post
            ),
          })),
        }
      : old
  );
  queryClient.setQueryData<Post>(postKey(postId), (old) =>
    old ? update(old) : old
  );
}

export function restorePostCaches(
  queryClient: QueryClient,
  postId: number,
  snapshot: PostCacheSnapshot | undefined
) {
  if (!snapshot) return;
  queryClient.setQueryData(["feed"], snapshot.feed);
  queryClient.setQueryData(postKey(postId), snapshot.post);
}
