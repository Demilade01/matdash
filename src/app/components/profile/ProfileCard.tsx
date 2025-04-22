'use client';

import { useState } from 'react';
import Image from 'next/image';
import EditProfileForm from './EditProfileForm';
import { Modal, Button } from 'flowbite-react';

type Profile = {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
};

const ProfileCard = ({ profile }: { profile: Profile }) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <section className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-6 text-center relative space-y-6">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full mx-auto overflow-hidden border-4 border-blue-300 shadow-md">
          <Image
            src={profile.avatar_url || '/images/profile/user-6.jpg'}
            alt="avatar"
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Basic Info */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">{profile.name || 'Unnamed User'}</h2>
          <p className="text-gray-500 text-sm">{profile.email}</p>
        </div>

        {/* Edit Button */}
        <Button onClick={() => setOpenModal(true)} className="w-full bg-black">
          Edit Profile
        </Button>

        {/* Modal for Edit Form */}
        <Modal show={openModal} onClose={() => setOpenModal(false)}>
          <Modal.Header>Edit Your Profile</Modal.Header>
          <Modal.Body>
            <EditProfileForm
              userId={profile.id}
              initialName={profile.name}
              initialEmail={profile.email}
              onSuccess={() => setOpenModal(false)}
            />
          </Modal.Body>
        </Modal>
      </div>
    </section>
  );
};

export default ProfileCard;
