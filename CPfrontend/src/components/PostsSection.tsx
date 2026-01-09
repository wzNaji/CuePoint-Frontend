/**
 * PostsSection component
 *
 * Renders a list of posts ("Updates") and, when the viewer is the owner,
 * provides controls for:
 * - creating a new post
 * - editing an existing post (inline)
 * - deleting a post
 *
 * This component is intentionally "dumb" about data fetching:
 * - it receives posts + loading state from the parent
 * - it receives handler callbacks for create/edit/delete from the parent
 *
 * Owner rules:
 * - `isOwner` controls whether create + edit/delete actions are shown.
 */

// src/components/PostsSection.tsx
import PostForm from "./PostForm";
import Button from "./button";
import Card from "./Card";
import type { Post } from "../types/post";

interface PostsSectionProps {
  /** List of posts to render (already fetched by the parent). */
  posts: Post[];

  /** Loading flag for posts fetch. */
  postsLoading: boolean;

  /**
   * The post currently being edited (if any).
   * When set, the matching post row swaps into an inline PostForm.
   */
  editingPost: Post | null;

  /** Setter used to start/stop editing a specific post. */
  setEditingPost: (post: Post | null) => void;

  /**
   * Create handler (called by PostForm).
   * Parent is responsible for persisting via API and refreshing the list.
   */
  handleCreatePost: (content: string, imageUrl: string) => void;

  /**
   * Edit handler (called by PostForm).
   * Parent is responsible for persisting via API and refreshing the list.
   */
  handleEditPost: (content: string, imageUrl: string) => void;

  /**
   * Delete handler (called when user clicks Delete).
   * Parent is responsible for persisting via API and refreshing the list.
   */
  handleDeletePost: (postId: number) => void;

  /** Whether an image upload is currently in progress (disables submit buttons). */
  uploading: boolean;

  /** Setter to toggle upload loading state (passed down to PostForm). */
  setUploading: (value: boolean) => void;

  /**
   * Whether the current viewer is the owner of the profile/dashboard.
   * If false, creation and edit/delete controls are hidden.
   */
  isOwner?: boolean;
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
  isOwner = false, // default false for safety when omitted
}: PostsSectionProps) {
  return (
    <section className="space-y-6">
      {/* Section header */}
      <h2 className="text-lg font-semibold text-gray-900">Updates</h2>

      {/* Create form only visible to the owner */}
      {isOwner && (
        <Card>
          <PostForm
            onSubmit={handleCreatePost}
            uploading={uploading}
            setUploading={setUploading}
          />
        </Card>
      )}

      {/* Loading state */}
      {postsLoading && <p className="text-sm text-gray-500">Loading updates…</p>}

      {/* Empty state (different text depending on ownership) */}
      {!postsLoading && posts.length === 0 && (
        <p className="text-sm text-gray-500">
          {isOwner
            ? "You haven’t posted anything yet."
            : "This user hasn’t posted anything yet."}
        </p>
      )}

      {/* Posts list */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id}>
            {/* If this post is currently being edited (and viewer is owner), show inline edit form */}
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
                {/* Post content */}
                <p className="text-sm text-white whitespace-pre-line">
                  {post.content}
                </p>

                {/* Optional post image */}
                {post.image_url && (
                  <div className="mt-3 overflow-hidden rounded-lg border">
                    <img
                      src={post.image_url}
                      alt="Post"
                      className="max-h-72 w-full object-cover"
                    />
                  </div>
                )}

                {/* Footer row: created timestamp + owner actions */}
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-xs text-gray-400">
                    {new Date(post.created_at).toLocaleString()}
                  </p>

                  {/* Edit/Delete controls only available to the owner */}
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
