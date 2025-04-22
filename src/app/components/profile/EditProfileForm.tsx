'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'react-hot-toast';

type Props = {
  userId: string;
  initialName?: string;
  initialEmail?: string;
  onSuccess?: () => void;
};

const EditProfileForm = ({ userId, initialName, initialEmail, onSuccess }: Props) => {
  const [name, setName] = useState(initialName || '');
  const [email] = useState(initialEmail || '');
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  const handleSave = async () => {
    setSaving(true);
    toast.loading('Saving changes...');

    const { error } = await supabase
      .from('profiles')
      .update({ name })
      .eq('id', userId);

    toast.dismiss();
    if (!error) {
      toast.success('Profile updated successfully!');
      if (onSuccess) onSuccess();
    }

    if (error) {
      toast.error('Failed to save changes');
      console.error('Profile update error:', error);
    } else {
      toast.success('Profile updated successfully!');
    }

    setSaving(false);
  };

  return (
    <div className="space-y-4 text-left">
      <div>
        <label className="block mb-1 font-medium">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 rounded-md text-sm border"
          placeholder="Name"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Email</label>
        <input
          type="email"
          value={email}
          disabled
          className="w-full p-2 border rounded-md text-sm bg-gray-100 cursor-not-allowed"
        />
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-black text-white px-4 py-2 rounded-md transition text-sm"
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
};

export default EditProfileForm;
