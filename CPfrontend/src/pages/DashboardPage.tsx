import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCurrentUser, fetchMyPosts, api } from "../api/auth";
import { uploadImage } from "../api/post"; // upload helper
import { useNavigate } from "react-router-dom";

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
  const [postContent, setPostContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
      // optional local preview before upload
      setImageUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    try {
      const url = await uploadImage(selectedFile);
      setImageUrl(url);
      setMessage("Image uploaded successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!postContent.trim()) return;

    try {
      await api.post("/me/posts", {
        content: postContent,
        image_url: imageUrl || null,
      });

      setPostContent("");
      setImageUrl("");
      setSelectedFile(null);

      await queryClient.invalidateQueries({ queryKey: ["myPosts"] });
      setMessage("Post created!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to create post.");
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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Dashboard Header */}
        <div className="bg-white rounded shadow p-6 mb-6">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-lg">Welcome back, {user.display_name} 👋</p>
        </div>

        {/* Profile + Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 border rounded bg-blue-50">
            <h2 className="font-semibold mb-2">Profile</h2>
            <p>Email: {user.email}</p>
            <p>Display Name: {user.display_name}</p>
            <p>Verified: {user.is_verified ? "✅" : "❌"}</p>
          </div>

          <div className="p-4 border rounded bg-green-50 flex flex-col justify-between">
            <h2 className="font-semibold mb-2">Actions</h2>
            <button
              onClick={() => navigate("/me/update")}
              className="mb-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Update Profile
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>

        {message && <p className="mb-4 text-red-500">{message}</p>}

        {/* Create Post Form */}
        <div className="bg-white p-4 border rounded shadow mb-6">
          <h2 className="text-2xl font-bold mb-4">Create a Post</h2>
          <textarea
            className="w-full p-2 border rounded mb-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Write something..."
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            rows={3}
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mb-2"
          />
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            {uploading ? "Uploading..." : "Upload Image"}
          </button>

          {imageUrl && (
            <div className="mb-2">
              <p className="text-sm text-gray-600">Image ready to post:</p>
              <img
                src={imageUrl}
                alt="Preview"
                className="rounded max-h-48 w-full object-cover mt-1"
              />
            </div>
          )}

          <button
            onClick={handleCreatePost}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Post
          </button>
        </div>

        {/* User Posts */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Your Updates</h2>
          {postsLoading ? (
            <p>Loading your posts...</p>
          ) : posts?.length === 0 ? (
            <p className="text-gray-500">You haven't posted anything yet.</p>
          ) : (
            <div className="space-y-4">
              {posts.map((post: any) => (
                <div key={post.id} className="p-4 bg-white border rounded shadow relative">
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

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
