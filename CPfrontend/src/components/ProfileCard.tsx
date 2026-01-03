import React from "react";
import Card from "./Card";
import Button from "./button";

interface ProfileCardProps {
  user: any;
  uploading: boolean;
  isOwner: boolean; // NEW
  onProfileImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpdateProfile: () => void;
  onViewBookings: () => void;
  onLogout: () => void;
}

export default function ProfileCard({
  user,
  uploading,
  isOwner,
  onProfileImageChange,
  onUpdateProfile,
  onViewBookings
}: ProfileCardProps) {
  return (
    <Card className="mb-6 p-6 flex items-center gap-6 bg-gray-900 border-gray-800 text-white">
      {/* AVATAR */}
      <div className="relative shrink-0">
        <img
          src={user.profile_image_url || "/default-avatar.png"}
          alt="Profile"
          className="h-20 w-20 rounded-full object-cover border border-gray-700"
        />

        {isOwner && (
          <>
            <label
              htmlFor="file-upload-profile"
              className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center
                         rounded-full bg-red-600
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
          </>
        )}
      </div>

      {/* INFO */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-400">Display name</p>
        <p className="text-lg font-semibold text-white">{user.display_name}</p>

        <div className="mt-3">
          <p className="text-sm text-gray-400">Bio</p>
          <p className="text-sm text-gray-200">{user.bio || "No bio yet"}</p>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex flex-col gap-2">
        {isOwner && (
          <Button
            variant="secondary"
            size="md"
            onClick={onUpdateProfile}
          >
            Update profile
          </Button>
        )}

        <Button
          variant="secondary"
          size="md"
          onClick={onViewBookings}
        >
          View bookings
        </Button>

      </div>
    </Card>
  );
}
