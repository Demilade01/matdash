import { getServerSession, Session } from "next-auth";
import { createServerSupabase } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { Button } from "flowbite-react";
import UploadAvatar from "@/app/components/profile/UploadAvatar";
import ProfileCard from "@/app/components/profile/ProfileCard";
import { authOptions } from "@/utils/authOptions/authOptions";

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
      <ProfileCard profile={profile} />
  );
}

export default ProfilePage;