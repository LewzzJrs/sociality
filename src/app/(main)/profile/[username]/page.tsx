import { UserProfileView } from "@/features/users/user-profile";

export default async function ProfilePage({
  params,
}: PageProps<"/profile/[username]">) {
  const { username } = await params;

  return (
    <main className="mx-auto w-full max-w-203 px-4 py-6 md:px-0 md:py-10">
      <UserProfileView username={decodeURIComponent(username)} />
    </main>
  );
}
