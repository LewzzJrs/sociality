import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EditProfileForm } from "@/features/profile/edit-profile-form";

export default function EditProfilePage() {
  return (
    <main className="mx-auto flex w-full max-w-200 flex-col gap-6 px-4 py-6 md:px-0 md:py-10">
      <div className="flex items-center gap-3">
        <Link href="/me">
          <ArrowLeft className="size-8" />
          <span className="sr-only">Back to profile</span>
        </Link>
        <h1 className="text-display-xs font-bold">Edit Profile</h1>
      </div>
      <EditProfileForm />
    </main>
  );
}
