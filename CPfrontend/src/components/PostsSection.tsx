// src/components/PostsSection.tsx
import PostForm from "./PostForm";
import type { Post } from "../types/post";

export interface PostsSectionProps {
  posts: Post[];
  postsLoading: boolean;
  editingPost: Post | null;
  setEditingPost: (post: Post | null) => void;
  handleCreatePost: (content: string, imageUrl: string) => void;
  handleEditPost: (content: string, imageUrl: string) => void;
  handleDeletePost: (postId: number) => void;
  uploading: boolean;
  setUploading: (value: boolean) => void;
}

export default function PostsSection({
  posts,
  postsLoading,
  editingPost,
  setEditingPost,
  handleCreatePost,
  handleEditPost,
  handleDeletePost,
  uploading,
  setUploading,
}: PostsSectionProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Your Updates</h2>

      <PostForm onSubmit={handleCreatePost} uploading={uploading} setUploading={setUploading} />

      {postsLoading ? (
        <p>Loading your posts...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-500">You haven't posted anything yet.</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="p-4 bg-white border rounded shadow mb-4 relative">
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
        ))
      )}
    </div>
  );
}
