// src/components/PostsSection.tsx
import PostForm from "./PostForm";
import Button from "./button";
import Card from "./Card";
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
  isOwner?: boolean; // NEW
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
  isOwner = false, // default false
}: PostsSectionProps) {
  return (
    <section className="space-y-6">
      {/* HEADER */}
      <h2 className="text-lg font-semibold text-gray-900">Updates</h2>

      {/* CREATE (only for owner) */}
      {isOwner && (
        <Card>
          <PostForm
            onSubmit={handleCreatePost}
            uploading={uploading}
            setUploading={setUploading}
          />
        </Card>
      )}

      {/* LOADING */}
      {postsLoading && <p className="text-sm text-gray-500">Loading updates…</p>}

      {/* EMPTY */}
      {!postsLoading && posts.length === 0 && (
        <p className="text-sm text-gray-500">
          {isOwner
            ? "You haven’t posted anything yet."
            : "This user hasn’t posted anything yet."}
        </p>
      )}

      {/* POSTS */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id}>
            {editingPost?.id === post.id && isOwner ? (
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
                <p className="text-sm text-gray-900 whitespace-pre-line">{post.content}</p>

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

                {/* META & ACTIONS */}
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-xs text-gray-400">
                    {new Date(post.created_at).toLocaleString()}
                  </p>

                  {/** ACTIONS ONLY FOR OWNER */}
                  {isOwner && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setEditingPost(post)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleDeletePost(post.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
}
