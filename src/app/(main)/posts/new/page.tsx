import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AddPostForm } from "@/features/posts/add-post-form";

export default function NewPostPage() {
  return (
    <main className="mx-auto flex w-full max-w-113 flex-col gap-6 px-4 py-6 md:px-0 md:py-10">
      <div className="flex items-center gap-3">
        <Link href="/feed">
          <ArrowLeft className="size-8" />
          <span className="sr-only">Back to feed</span>
        </Link>
        <h1 className="text-display-xs font-bold">Add Post</h1>
      </div>
      <AddPostForm />
    </main>
  );
}
