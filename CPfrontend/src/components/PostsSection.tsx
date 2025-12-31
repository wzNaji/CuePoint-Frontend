// src/components/PostsSection.tsx
import PostForm from "./PostForm";
import type { Post } from "../types/post";

interface PostsSectionProps {
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
    <section>
      {/* HEADER */}
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        Updates
      </h2>

      {/* CREATE */}
      <PostForm
        onSubmit={handleCreatePost}
        uploading={uploading}
        setUploading={setUploading}
      />

      {/* LOADING */}
      {postsLoading && (
        <p className="mt-4 text-sm text-gray-500">
          Loading updates…
        </p>
      )}

      {/* EMPTY */}
      {!postsLoading && posts.length === 0 && (
        <p className="mt-4 text-sm text-gray-500">
          You haven’t posted anything yet.
        </p>
      )}

      {/* POSTS */}
      <div className="mt-6 space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="relative rounded-xl border border-gray-200 bg-white shadow-sm p-4"
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
                {/* CONTENT */}
                <p className="text-sm text-gray-900 whitespace-pre-line">
                  {post.content}
                </p>

                {/* IMAGE */}
                {post.image_url && (
                  <div className="mt-3 overflow-hidden rounded-lg border">
                    <img
                      src={post.image_url}
                      alt="Post"
                      className="max-h-72 w-full object-cover"
                    />
                  </div>
                )}

                {/* META */}
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-xs text-gray-400">
                    {new Date(post.created_at).toLocaleString()}
                  </p>

                  {/* ACTIONS */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingPost(post)}
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="text-xs font-medium text-red-500 hover:text-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
