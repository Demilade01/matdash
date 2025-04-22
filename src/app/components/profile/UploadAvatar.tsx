'use client';

import { useRef, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

interface UploadAvatarProps {
  userId: string;
  initialUrl?: string;
}

const UploadAvatar = ({ userId, initialUrl }: UploadAvatarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(initialUrl || '/images/profile/user-6.jpg');
  const supabase = createClient();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}.${fileExt}`;
    const filePath = `${fileName}`;

    setUploading(true);
    toast.loading('Uploading avatar...');

    // Step 1: Delete existing avatar (if any)
    await supabase.storage.from('avatars').remove([filePath]); // silent fail okay

    // Step 2: Upload new file
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file); // ❌ removed upsert: true (not supported)

    if (uploadError) {
      toast.dismiss();
      toast.error('Upload failed');
      console.error('Upload error:', uploadError);
      setUploading(false);
      return;
    }

    // Step 3: Get public URL
    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    const avatarUrl = `${data.publicUrl}?t=${Date.now()}`; // bust cache

    // Step 4: Update profile in DB
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: avatarUrl })
      .eq('id', userId);

    console.log("Updated avatar URL:", avatarUrl);

    if (updateError) {
      toast.dismiss();
      toast.error('Failed to update profile');
      console.error('DB update error:', updateError);
      setUploading(false);
      return;
    }

    toast.dismiss();
    toast.success('Avatar updated!');
    setPreview(avatarUrl); // updates Image preview
    setUploading(false);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <Image
        src={preview}
        alt="avatar"
        width={96}
        height={96}
        className="rounded-full object-cover w-24 h-24"
      />
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleUpload}
        className="hidden"
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="text-sm text-blue-600 hover:underline disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Change Avatar'}
      </button>
    </div>
  );
};

export default UploadAvatar;
