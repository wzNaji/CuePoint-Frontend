// src/components/ProfileCard.tsx
import React from "react";

interface ProfileCardProps {
  user: any; // or User type
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
    <div className="p-4 border rounded bg-blue-50 mb-6 flex items-center space-x-6">
      <div className="relative">
        <img
          src={user.profile_image_url || "/default-avatar.png"}
          alt="Profile"
          className="w-20 h-20 object-cover rounded-full border-2 border-gray-300"
        />
        <label
          htmlFor="file-upload-profile"
          className="absolute bottom-0 right-0 p-1 bg-blue-600 text-white rounded-full cursor-pointer"
        >
          <span className="text-xs">✏️</span>
        </label>
        <input
          id="file-upload-profile"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onProfileImageChange}
        />
      </div>
      <div className="flex-1">
        <p>Email: {user.email}</p>
        <p>Display Name: {user.display_name}</p>
        <p>Bio: {user.bio || "No bio"}</p>
        <p>Verified: {user.is_verified ? "✅" : "❌"}</p>
      </div>
      <div className="flex flex-col space-y-2">
        <button onClick={onUpdateProfile} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Update Profile
        </button>
        <button onClick={onViewBookings} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          View Bookings
        </button>
        <button onClick={onLogout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
          Logout
        </button>
      </div>
    </div>
  );
}
