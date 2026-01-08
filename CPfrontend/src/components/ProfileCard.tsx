/**
 * ProfileCard component
 *
 * Displays a user's profile summary (avatar, display name, bio) and relevant actions.
 *
 * Owner behavior:
 * - If `isOwner` is true, the user can upload a new profile image and see the
 *   "Update profile" action button.
 *
 * Notes:
 * - `onLogout` is defined in props but not currently used in this component.
 *   If you intend to expose a logout button here, wire it up in the actions area.
 */

import React from "react";
import Card from "./Card";
import Button from "./button";

interface ProfileCardProps {
  /** User object containing at least `profile_image_url`, `display_name`, and `bio`. */
  user: any;

  /** True while a profile image upload is in progress (disables file input). */
  uploading: boolean;

  /** Whether the viewer is the profile owner (enables editing controls). */
  isOwner: boolean;

  /** File input change handler for selecting a new profile image. */
  onProfileImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  /** Called when the user wants to update profile fields (e.g., open edit modal). */
  onUpdateProfile: () => void;

  /** Called when the user wants to view bookings (e.g., navigate to bookings page). */
  onViewBookings: () => void;

  /** Optional action callback (currently unused in this component). */
  onLogout: () => void;
}

export default function ProfileCard({
  user,
  uploading,
  isOwner,
  onProfileImageChange,
  onUpdateProfile,
  onViewBookings,
}: ProfileCardProps) {
  return (
    <Card className="mb-6 p-6 flex items-center gap-6 bg-gray-900 border-gray-800 text-white">
      {/* AVATAR */}
      <div className="relative shrink-0">
        {/* Profile avatar; falls back to a local default image when missing */}
        <img
          src={user.profile_image_url || "/default-avatar.png"}
          alt="Profile"
          className="h-20 w-20 rounded-full object-cover border border-gray-700"
        />

        {/* Owner-only: profile image upload control */}
        {isOwner && (
          <>
            {/* Label styled as an overlay button to trigger the hidden file input */}
            <label
              htmlFor="file-upload-profile"
              className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center
                         rounded-full bg-red-600
                         text-white text-xs cursor-pointer
                         shadow hover:opacity-90 transition"
              title="Change profile picture"
            >
              {/* Keep this short; avoid icons/emojis to match project style */}
              Edit
            </label>

            {/* Hidden file input; clicking the label opens the file picker */}
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
        {/* Display name */}
        <p className="text-sm text-gray-400">Display name</p>
        <p className="text-lg font-semibold text-white">{user.display_name}</p>

        {/* Bio */}
        <div className="mt-3">
          <p className="text-sm text-gray-400">Bio</p>
          <p className="text-sm text-gray-200">{user.bio || "No bio yet"}</p>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex flex-col gap-2">
        {/* Owner-only: profile update action */}
        {isOwner && (
          <Button variant="secondary" size="md" onClick={onUpdateProfile}>
            Update profile
          </Button>
        )}

        {/* Public/owner: bookings action */}
        <Button variant="secondary" size="md" onClick={onViewBookings}>
          View bookings
        </Button>
      </div>
    </Card>
  );
}
