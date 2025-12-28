// src/pages/DashboardPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import LayoutRenderer from "../layouts/LayoutRenderer";
import { DEFAULT_DASHBOARD_LAYOUT } from "../layouts/defaultLayouts";

import type { Post } from "../types/post";
import type { User } from "../types/user";
import type { WidgetProps } from "../layouts/types";

import {
  fetchCurrentUser,
  fetchMyPosts,
  createPost,
  updatePost,
  deletePost,
  uploadProfileImage,
  logout,
} from "../api/dashboard";

export default function DashboardPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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
    onSuccess: () => queryClient.invalidateQueries(["myPosts"]),
  });

  const updatePostMutation = useMutation({
    mutationFn: ({ postId, content, imageUrl }: { postId: number; content: string; imageUrl?: string }) =>
      updatePost({ postId, content, imageUrl }),
    onSuccess: () => queryClient.invalidateQueries(["myPosts"]),
  });

  const deletePostMutation = useMutation({
    mutationFn: (postId: number) => deletePost(postId),
    onSuccess: () => queryClient.invalidateQueries(["myPosts"]),
  });

  const uploadProfileImageMutation = useMutation({
    mutationFn: (file: File) => uploadProfileImage(file),
    onSuccess: () => queryClient.invalidateQueries(["currentUser"]),
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

  // -------------------- Widget Props --------------------
  const widgetProps: WidgetProps = {
    user,
    posts: posts || [],
    postsLoading,
    editingPost,
    setEditingPost,
    handleCreatePost: (content, imageUrl) => createPostMutation.mutate({ content, imageUrl }),
    handleEditPost: (content, imageUrl) =>
      editingPost && updatePostMutation.mutate({ postId: editingPost.id, content, imageUrl }),
    handleDeletePost: (postId) => deletePostMutation.mutate(postId),
    uploading,
    setUploading,
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto flex gap-6">
        {/* Main Column */}
        <div className="flex-1">
          <LayoutRenderer layout={DEFAULT_DASHBOARD_LAYOUT} contextProps={widgetProps} />
        </div>
      </div>
    </div>
  );
}
