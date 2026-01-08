/**
 * API client helpers for the "me" (authenticated user) area.
 *
 * This module groups common frontend API calls for:
 * - Current user account actions (fetch self, upload profile image, logout)
 * - Post CRUD for the authenticated user
 *
 * Assumptions:
 * - The backend uses an HTTP-only cookie for authentication.
 * - Axios is configured with `withCredentials: true` so cookies are included.
 * - Field naming: backend expects `image_url` (snake_case) even if the frontend
 *   uses `imageUrl` (camelCase) internally.
 */
import { api } from "./axios";
import type { Post } from "../types/post";
import type { User } from "../types/user";

// -------------------- Users --------------------

/**
 * Fetch the currently authenticated user.
 *
 * Returns:
 * - The current user object if authenticated.
 * - `null` if not authenticated (or if the request fails for any reason).
 *
 * Notes:
 * - This function intentionally swallows errors and returns null to simplify
 *   auth-gating logic in UI components.
 */
export const fetchCurrentUser = async (): Promise<User | null> => {
  try {
    const res = await api.get("/me");
    return res.data;
  } catch {
    return null;
  }
};

/**
 * Upload a new profile image for the authenticated user.
 *
 * Args:
 * - file: Browser `File` object selected by the user.
 *
 * Returns:
 * - Updated user object from the backend (typically includes `profile_image_url`).
 *
 * Notes:
 * - Uses multipart form upload (`FormData`) because the backend endpoint expects a file field.
 * - The backend validates the MIME type (must be an image).
 */
export const uploadProfileImage = async (file: File): Promise<User> => {
  const form = new FormData();
  form.append("file", file);
  const res = await api.put("/me/profile-image", form);
  return res.data;
};

/**
 * Log out the current user.
 *
 * Notes:
 * - The backend clears the auth cookie; there is no response payload required here.
 */
export const logout = async (): Promise<void> => {
  await api.post("/logout");
};

// -------------------- Posts --------------------

/**
 * Fetch posts for the authenticated user (newest first on the backend).
 *
 * Returns:
 * - Array of posts authored by the current user.
 */
export const fetchMyPosts = async (): Promise<Post[]> => {
  const res = await api.get("/me/posts");
  return res.data;
};

/**
 * Create a new post for the authenticated user.
 *
 * Args:
 * - data.content: Required post text.
 * - data.imageUrl: Optional public URL for an image (uploaded separately).
 *
 * Returns:
 * - Created post record.
 *
 * Notes:
 * - Converts `imageUrl` (camelCase) to `image_url` (snake_case) expected by the backend.
 * - Sends `null` when no image is provided to keep payload explicit.
 */
export const createPost = async (data: { content: string; imageUrl?: string }): Promise<Post> => {
  const res = await api.post("/me/posts", { content: data.content, image_url: data.imageUrl || null });
  return res.data;
};

/**
 * Update an existing post owned by the authenticated user.
 *
 * Args:
 * - data.postId: ID of the post to update.
 * - data.content: Updated post text.
 * - data.imageUrl: Optional updated image URL. If changed, the backend may clean up the old image.
 *
 * Returns:
 * - Updated post record.
 *
 * Notes:
 * - Converts `imageUrl` (camelCase) to `image_url` (snake_case).
 */
export const updatePost = async (data: { postId: number; content: string; imageUrl?: string }): Promise<Post> => {
  const res = await api.put(`/me/posts/${data.postId}`, { content: data.content, image_url: data.imageUrl || null });
  return res.data;
};

/**
 * Delete a post owned by the authenticated user.
 *
 * Args:
 * - postId: ID of the post to delete.
 *
 * Notes:
 * - Backend may also delete any associated image from object storage as a best-effort cleanup step.
 */
export const deletePost = async (postId: number): Promise<void> => {
  await api.delete(`/me/posts/${postId}`);
};
