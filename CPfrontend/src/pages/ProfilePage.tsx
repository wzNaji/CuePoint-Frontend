/**
 * ProfilePage.tsx
 *
 * Displays a public user profile.
 *
 * Features:
 * - Shows profile info (display name, bio, profile image)
 * - Lists user's posts
 * - Displays featured tracks
 * - Includes events sidebar
 *
 * Uses React Query for fetching profile and posts.
 * All profile interactions (update, bookings, etc.) are disabled for public view.
 */
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/axios";
import FeaturedTracks from "../components/FeaturedTracks";
import EventsSidebar from "../components/EventsSidebar";
import ProfileCard from "../components/ProfileCard";


/** Type representing a user post */
interface Post {
  id: number;
  content: string;
  image_url?: string;
  created_at: string;
}

/** Type representing a public user profile */
interface PublicProfile {
  id: number;
  display_name: string;
  bio: string;
  profile_image_url?: string;
}

/**
 * ProfilePage Component
 *
 * Fetches and displays a public user profile, their posts, featured tracks, and events.
 *
 * @returns JSX.Element
 */
export default function ProfilePage() {
  // ------------------------------
  // URL params and navigation
  // ------------------------------
  const { userId } = useParams<{ userId: string }>();
  const numericUserId = userId ? Number(userId) : undefined;
  const navigate = useNavigate();

  // ------------------------------
  // Fetch profile data
  // ------------------------------
  const { data: profile, isLoading: profileLoading } = useQuery<PublicProfile>({
    queryKey: ["profile", numericUserId],
    queryFn: async () => {
      if (!numericUserId) throw new Error("Invalid user ID");
      const res = await api.get(`/profiles/${numericUserId}`);
      return res.data;
    },
    enabled: !!numericUserId,
  });

  // ------------------------------
  // Fetch user's posts
  // ------------------------------
  const { data: posts = [], isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: ["profilePosts", numericUserId],
    queryFn: async () => {
      if (!numericUserId) return [];
      const res = await api.get(`/users/${numericUserId}/posts`);
      return res.data;
    },
    enabled: !!numericUserId,
  });

  // ------------------------------
  // Loading & error handling
  // ------------------------------
  if (profileLoading) {
    return <p className="p-6 text-white">Loading profile...</p>;
  }

  if (!profile) {
    return <p className="p-6 text-white">Profile not found.</p>;
  }
  // ------------------------------
  // Main UI
  // ------------------------------
  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <div className="max-w-7xl mx-auto flex gap-6">
        {/* MAIN */}
        <div className="flex-1 space-y-6">
          {/* PROFILE CARD (REUSED) */}
          <ProfileCard
            user={profile}
            uploading={true} // disables file input
            isOwner={false}
            onProfileImageChange={() => {}}
            onUpdateProfile={() => {}}
            onViewBookings={() =>
              navigate(`/users/${numericUserId}/bookings`)
            }
            onLogout={() => {}}
          />

          {/* FEATURED TRACKS */}
          <FeaturedTracks userId={numericUserId!} isOwner={false} />

          {/* POSTS */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Posts</h2>

            {postsLoading ? (
              <p>Loading posts...</p>
            ) : posts.length === 0 ? (
              <p className="text-gray-400">No posts yet.</p>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-gray-800 p-4 rounded-xl border border-gray-700"
                  >
                    <p className="mb-2 whitespace-pre-line">{post.content}</p>

                    {post.image_url && (
                      <img
                        src={post.image_url}
                        alt="Post"
                        className="mt-2 rounded-lg max-h-60 w-full object-cover border border-gray-700"
                      />
                    )}

                    <p className="mt-2 text-xs text-gray-400">
                      {new Date(post.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SIDEBAR */}
        <EventsSidebar userId={numericUserId!} isOwner={false} />
      </div>
    </div>
  );
}
