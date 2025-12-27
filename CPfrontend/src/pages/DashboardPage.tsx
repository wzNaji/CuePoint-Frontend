import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import DashboardHeader from "../components/DashboardHeader";
import ProfileCard from "../components/ProfileCard";
import PostsSection from "../components/PostsSection";
import FeaturedTracks from "../components/FeaturedTracks";
import EventsSidebar from "../components/EventsSidebar";

import {
  fetchCurrentUser,
  fetchMyPosts,
  createPost,
  updatePost,
  deletePost,
  uploadProfileImage,
  logout,
} from "../api/dashboard";

import type { Post } from "../types/post";
import type { User } from "../types/user";

export default function DashboardPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  // -------------------- Queries --------------------
  const { data: user, isLoading: userLoading } = useQuery<User | null>({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
  });

  const { data: posts, isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: ["myPosts"],
    queryFn: fetchMyPosts,
  });

  // -------------------- Mutations --------------------
  const createPostMutation = useMutation({
    mutationFn: ({ content, imageUrl }: { content: string; imageUrl?: string }) =>
      createPost({ content, imageUrl }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["myPosts"] }),
  });

  const updatePostMutation = useMutation({
    mutationFn: ({ postId, content, imageUrl }: { postId: number; content: string; imageUrl?: string }) =>
      updatePost({ postId, content, imageUrl }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["myPosts"] }),
  });

  const deletePostMutation = useMutation({
    mutationFn: (postId: number) => deletePost(postId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["myPosts"] }),
  });

  const uploadProfileImageMutation = useMutation({
    mutationFn: (file: File) => uploadProfileImage(file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["currentUser"] }),
  });

  const logoutMutation = useMutation({
    mutationFn: () => logout(),
    onSuccess: () => navigate("/login"),
  });

  // -------------------- Loading / Auth Check --------------------
  if (userLoading) return <p>Loading...</p>;
  if (!user) {
    navigate("/login");
    return null;
  }

  // -------------------- Handlers --------------------
  const handleCreatePost = async (content: string, imageUrl: string) => {
    try {
      await createPostMutation.mutateAsync({ content, imageUrl });
      setMessage("Post created!");
    } catch {
      setMessage("Failed to create post.");
    }
  };

  const handleEditPost = async (content: string, imageUrl: string) => {
    if (!editingPost) return;
    try {
      await updatePostMutation.mutateAsync({ postId: editingPost.id, content, imageUrl });
      setEditingPost(null);
      setMessage("Post updated!");
    } catch {
      setMessage("Failed to update post.");
    }
  };

  const handleDeletePost = async (postId: number) => {
    try {
      await deletePostMutation.mutateAsync(postId);
      setMessage("Post deleted!");
    } catch {
      setMessage("Failed to delete post.");
    }
  };

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await uploadProfileImageMutation.mutateAsync(file);
      setMessage("Profile image updated!");
    } catch {
      setMessage("Failed to upload profile image.");
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch {
      setMessage("Logout failed, try again.");
    }
  };

  // -------------------- JSX --------------------
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto flex gap-6">
        {/* Main Column */}
        <div className="flex-1">
          <DashboardHeader displayName={user.display_name} />

          <ProfileCard
            user={user}
            uploading={uploading}
            onProfileImageChange={handleProfileImageChange}
            onUpdateProfile={() => navigate("/me/update")}
            onViewBookings={() => navigate(`/users/${user.id}/bookings`)}
            onLogout={handleLogout}
          />

          <FeaturedTracks userId={user.id} isOwner />

          {message && <p className="text-red-500 mb-4">{message}</p>}

          <PostsSection
            posts={posts || []}
            postsLoading={postsLoading}
            editingPost={editingPost}
            setEditingPost={setEditingPost}
            handleCreatePost={handleCreatePost}
            handleEditPost={handleEditPost}
            handleDeletePost={handleDeletePost}
            uploading={uploading}
            setUploading={setUploading}
          />
        </div>

        {/* Sidebar */}
        <EventsSidebar userId={user.id} isOwner />
      </div>
    </div>
  );
}
