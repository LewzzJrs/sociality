import { notFound } from "next/navigation";
import { PostDetail } from "@/features/posts/post-detail";

export default async function PostPage({ params }: PageProps<"/posts/[id]">) {
  const { id } = await params;
  const postId = Number(id);

  if (!Number.isInteger(postId) || postId <= 0) notFound();

  return (
    <main className="mx-auto w-full max-w-300 px-4 py-6 md:py-10">
      <PostDetail
        postId={postId}
        className="mx-auto max-w-150 lg:w-fit lg:max-w-none"
      />
    </main>
  );
}
