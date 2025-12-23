import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/axios";
import FeaturedTracks from "../components/FeaturedTracks";
import EventsSidebar from "../components/EventsSidebar";

interface Post {
  id: number;
  content: string;
  image_url?: string;
  created_at: string;
}

interface PublicProfile {
  id: number;
  display_name: string;
  bio: string;
  profile_image_url?: string;
}

export default function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const numericUserId = userId ? parseInt(userId) : undefined;
  const navigate = useNavigate();

  const { data: profile, isLoading: profileLoading } = useQuery<PublicProfile>({
    queryKey: ["profile", numericUserId],
    queryFn: async () => {
      if (!numericUserId) throw new Error("Invalid user ID");
      const res = await api.get(`/profiles/${numericUserId}`);
      return res.data;
    },
  });

  const { data: posts = [], isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: ["profilePosts", numericUserId],
    queryFn: async () => {
      if (!numericUserId) return [];
      const res = await api.get(`/users/${numericUserId}/posts`);
      return res.data;
    },
    enabled: !!numericUserId, // only fetch if ID is valid
  });

  if (profileLoading) return <p>Loading profile...</p>;
  if (!profile) return <p>Profile not found.</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto flex gap-6">
        {/* Main content */}
        <div className="flex-1">
          {/* Profile Header */}
          <div className="bg-white rounded shadow p-6 mb-6 flex items-center gap-6">
            <img
              src={profile.profile_image_url || "/default-avatar.png"}
              alt="Profile"
              className="w-24 h-24 object-cover rounded-full border-2 border-gray-300"
            />
            <div>
              <h1 className="text-3xl font-bold">{profile.display_name}</h1>
              <p className="text-gray-600">{profile.bio}</p>
              {numericUserId && (
                <button
                  onClick={() => navigate(`/users/${numericUserId}/bookings`)}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  View Bookings
                </button>
              )}
            </div>
          </div>

          {/* Featured Tracks */}
          {numericUserId && <FeaturedTracks userId={numericUserId} isOwner={false} />}

          {/* Posts */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Posts</h2>
            {postsLoading ? (
              <p>Loading posts...</p>
            ) : posts.length === 0 ? (
              <p className="text-gray-500">No posts yet.</p>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="bg-white p-4 rounded shadow">
                    <p className="mb-2">{post.content}</p>
                    {post.image_url && (
                      <img
                        src={post.image_url}
                        alt="Post"
                        className="rounded max-h-60 w-full object-cover mt-2"
                      />
                    )}
                    <p className="text-sm text-gray-400 mt-2">
                      {new Date(post.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        {numericUserId && <EventsSidebar userId={numericUserId} isOwner={false} />}
      </div>
    </div>
  );
}
