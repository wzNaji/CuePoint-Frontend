// src/components/ProfileCard.tsx
import React from "react";

interface ProfileCardProps {
  user: any;
  uploading: boolean;
  onProfileImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpdateProfile: () => void;
  onViewBookings: () => void;
  onLogout: () => void;
}

export default function ProfileCard({
  user,
  uploading,
  onProfileImageChange,
  onUpdateProfile,
  onViewBookings,
  onLogout,
}: ProfileCardProps) {
  return (
    <div className="mb-6 rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-6 p-6">
        {/* AVATAR */}
        <div className="relative shrink-0">
          <img
            src={user.profile_image_url || "/default-avatar.png"}
            alt="Profile"
            className="h-20 w-20 rounded-full object-cover border"
          />

          <label
            htmlFor="file-upload-profile"
            className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center
                       rounded-full bg-gradient-to-r from-indigo-500 to-purple-500
                       text-white text-xs cursor-pointer
                       shadow hover:opacity-90 transition"
            title="Change profile picture"
          >
            ✏️
          </label>

          <input
            id="file-upload-profile"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onProfileImageChange}
            disabled={uploading}
          />
        </div>

        {/* INFO */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-500">Display name</p>
          <p className="text-lg font-semibold text-gray-900">
            {user.display_name}
          </p>

          <div className="mt-3">
            <p className="text-sm text-gray-500">Bio</p>
            <p className="text-sm text-gray-700">
              {user.bio || "No bio yet"}
            </p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col gap-2">
          <button
            onClick={onUpdateProfile}
            className="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500
                       px-4 py-2 text-sm font-medium text-white
                       shadow-sm hover:opacity-90 transition"
          >
            Update profile
          </button>

          <button
            onClick={onViewBookings}
            className="rounded-lg border border-gray-300
                       px-4 py-2 text-sm font-medium
                       hover:bg-gray-100 transition"
          >
            View bookings
          </button>

          <button
            onClick={onLogout}
            className="rounded-lg px-4 py-2 text-sm font-medium
                       text-red-600 hover:bg-red-50 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
