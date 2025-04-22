import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createServerSupabase } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { Button } from "flowbite-react";
import UploadAvatar from "@/app/components/profile/UploadAvatar";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

const  ProfilePage = async ({ params }: { params: { id: string } }) => {
  const session = await getServerSession(authOptions);
  const supabase = createServerSupabase();

  // Block access if not the user themselves
  if (!session?.user || session.user.id !== params.id) {
    return notFound(); // 👈 secure route fallback
  }

  // Fetch user profile info from the profiles table
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error) {
    console.error("Profile fetch error:", error);
    return <div className="text-red-500">Failed to load profile.</div>;
  }

  return (
    <section className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-6 text-center relative">
        {/* Avatar */}
          <UploadAvatar userId={profile.id} initialUrl={profile.avatar_url} />

        {/* User Info */}
        <h2 className="text-2xl font-semibold text-gray-800">{profile.name || 'User'}</h2>
        <p className="text-gray-500 text-sm">{profile.email}</p>

        {/* Divider */}
        <div className="my-6 border-t" />

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <Button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition cursor-pointer">
            Edit Profile
          </Button>
          <Button className="text-red-500 border cursor-pointer border-red-200 px-2 py-2 rounded hover:bg-red-50 transition" href="/auth/signin">
            Logout
          </Button>
        </div>
      </div>
    </section>
  );
}

export default ProfilePage;