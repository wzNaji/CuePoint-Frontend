import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCurrentUser, fetchMyPosts } from "../api/auth";
import { uploadImage } from "../api/post";
import { useNavigate } from "react-router-dom";
import { uploadProfileImage } from "../api/user";
import { api } from "../api/axios";
import FeaturedTracks from "../components/FeaturedTracks";
import EventsSidebar from "../components/EventsSidebar";
import SearchBar from "../components/SearchBar";

interface PostFormProps {
  initialContent?: string;
  initialImageUrl?: string;
  onSubmit: (content: string, imageUrl: string) => void;
  onCancel?: () => void;
  uploading?: boolean;
  setUploading?: (value: boolean) => void;
}

function PostForm({
  initialContent = "",
  initialImageUrl = "",
  onSubmit,
  onCancel,
  uploading,
  setUploading,
}: PostFormProps) {
  const [content, setContent] = useState(initialContent);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(initialImageUrl);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
      // Local preview
      setImageUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSave = async () => {
    if (!content.trim()) return;

    let finalImageUrl = imageUrl;

    // Upload the file if one is selected
    if (selectedFile && setUploading) {
      setUploading(true);
      try {
        const uploadedUrl = await uploadImage(selectedFile);
        finalImageUrl = uploadedUrl; // Use the R2 public URL
        setImageUrl(finalImageUrl);
      } catch (err) {
        console.error(err);
        alert("Failed to upload image.");
        setUploading(false);
        return;
      } finally {
        setUploading(false);
      }
    }

    onSubmit(content, finalImageUrl);

    // Reset form
    setContent("");
    setSelectedFile(null);
    setImageUrl("");
  };

  return (
    <div className="mb-4">
      <textarea
        className="w-full p-2 border rounded mb-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Write something..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
      />
      <input
        id="file-upload-post"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <label
        htmlFor="file-upload-post"
        className="inline-block px-4 py-2 bg-green-200 text-gray-700 rounded cursor-pointer hover:bg-gray-300"
      >
        Upload Image
      </label>

      <p className="text-sm text-gray-500 mt-1">
        {selectedFile ? selectedFile.name : "No file selected"}
      </p>

      {imageUrl && (
        <div className="mb-2">
          <p className="text-sm text-gray-600">Preview:</p>
          <img
            src={imageUrl}
            alt="Preview"
            className="rounded max-h-48 w-full object-cover mt-1"
          />
        </div>
      )}
      <div className="flex space-x-2">
        <button
          onClick={handleSave}
          disabled={uploading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {onCancel ? "Save" : "Post"}
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
  });

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ["myPosts"],
    queryFn: fetchMyPosts,
  });

  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [editingPost, setEditingPost] = useState<any | null>(null);

  if (isLoading) return <p>Loading...</p>;
  if (!user) {
    navigate("/login");
    return null;
  }

  const handleLogout = async () => {
    try {
      await api.post("/logout");
      setMessage("Logged out successfully!");
      setTimeout(() => navigate("/"), 1000);
    } catch {
      setMessage("Logout failed, try again.");
    }
  };

  const handleCreatePost = async (content: string, imageUrl: string) => {
    try {
      await api.post("/me/posts", { content, image_url: imageUrl || null });
      await queryClient.invalidateQueries({ queryKey: ["myPosts"] });
      setMessage("Post created!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to create post.");
    }
  };

  const handleEditPost = async (content: string, imageUrl: string) => {
    if (!editingPost) return;
    try {
      await api.put(`/me/posts/${editingPost.id}`, {
        content,
        image_url: imageUrl || null,
      });
      setEditingPost(null);
      await queryClient.invalidateQueries({ queryKey: ["myPosts"] });
      setMessage("Post updated!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to update post.");
    }
  };

  const handleDeletePost = async (postId: number) => {
    try {
      await api.delete(`/me/posts/${postId}`);
      await queryClient.invalidateQueries({ queryKey: ["myPosts"] });
      setMessage("Post deleted successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete post.");
    }
  };

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      await uploadProfileImage(file);
    } catch (error) {
      console.error(error);
      setMessage("Failed to upload profile image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto flex gap-6">
        {/* Main content */}
        <div className="flex-1">
          {/* Header */}
          <div className="bg-white rounded shadow p-6 mb-6">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-lg">Welcome back, {user.display_name} 👋</p>
          </div>

          {/* Profile */}
          <div className="p-4 border rounded bg-blue-50 mb-6">
            <h2 className="font-semibold mb-2">Profile</h2>
            <p>Email: {user.email}</p>
            <p>Display Name: {user.display_name}</p>
            <p>Verified: {user.is_verified ? "✅" : "❌"}</p>
            <p>Bio: {user.bio}</p>

            {/* Profile Image */}
            <div className="flex items-center space-x-4 mt-4">
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
                  onChange={handleProfileImageChange}
                />
              </div>

              {/* Actions Section */}
              <div className="p-4 border rounded bg-green-50 flex flex-col justify-between">
                <h2 className="font-semibold mb-2">Actions</h2>
                <button
                  onClick={() => navigate("/me/update")}
                  className="mb-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Update Profile
                </button>
                {/* View Bookings Button */}
                <button
                  onClick={() => navigate(`/users/${user.id}/bookings`)}
                  className="mb-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  View Bookings
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Featured Tracks */}
          <FeaturedTracks userId={user.id} isOwner={true} />

          {message && <p className="text-red-500">{message}</p>}

          {/* Create Post */}
          <div className="bg-white p-4 border rounded shadow mb-6">
            <h2 className="text-2xl font-bold mb-4">Create a Post</h2>
            <PostForm
              onSubmit={handleCreatePost}
              uploading={uploading}
              setUploading={setUploading}
            />
          </div>
          <SearchBar />

          {/* Posts List */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Your Updates</h2>
            {postsLoading ? (
              <p>Loading your posts...</p>
            ) : posts?.length === 0 ? (
              <p className="text-gray-500">You haven't posted anything yet.</p>
            ) : (
              <div className="space-y-4">
                {posts.map((post: any) => (
                  <div
                    key={post.id}
                    className="p-4 bg-white border rounded shadow relative"
                  >
                    {editingPost?.id === post.id ? (
                      <PostForm
                        initialContent={post.content}
                        initialImageUrl={post.image_url || ""}
                        onSubmit={handleEditPost}
                        onCancel={() => setEditingPost(null)}
                        uploading={uploading}
                        setUploading={setUploading}
                      />
                    ) : (
                      <>
                        <p className="mb-2">{post.content}</p>
                        {post.image_url && (
                          <img
                            src={post.image_url}
                            alt="Post Image"
                            className="rounded max-h-60 w-full object-cover mt-2"
                          />
                        )}
                        <p className="text-sm text-gray-400 mt-2">
                          {new Date(post.created_at).toLocaleString()}
                        </p>
                        <div className="absolute top-2 right-2 flex space-x-2">
                          <button
                            onClick={() => setEditingPost(post)}
                            className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <EventsSidebar userId={user.id} isOwner={true} />
      </div>
    </div>
  );
}
