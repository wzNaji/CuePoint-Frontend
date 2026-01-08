/**
 * Post and upload API helpers.
 *
 * This module centralizes API calls related to:
 * - Managing the authenticated user's posts (`/me/posts`)
 * - Uploading images to object storage via the backend (`/upload-image`)
 *
 * Notes:
 * - All requests use the shared Axios instance (`api`), which should be configured
 *   with `withCredentials: true` so the browser includes auth cookies.
 * - File uploads use `multipart/form-data` via `FormData`.
 */
import { api } from "./axios";  // Import the centralized axios instance

/**
 * Convenience wrapper around post-related endpoints for the authenticated user.
 *
 * Endpoints:
 * - GET    /me/posts        -> list posts for current user
 * - POST   /me/posts        -> create a new post
 * - DELETE /me/posts/{id}   -> delete a post by id
 */
export const postsAPI = {
  /** Fetch posts for the currently authenticated user. */
  getMyPosts: () => api.get("/me/posts").then(res => res.data), 
  
   /**
   * Create a new post for the authenticated user.
   *
   * Args:
   * - data.content: Required post text.
   * - data.image_url: Optional public URL for an image (uploaded separately).
   */
  createPost: (data: { content: string; image_url?: string }) =>
    api.post("/me/posts", data).then(res => res.data),  

  /**
   * Delete a post owned by the authenticated user.
   *
   * Args:
   * - id: Post ID to delete.
   */
  deletePost: (id: number) =>
    api.delete(`/me/posts/${id}`).then(res => res.data),  
};

/**
 * Upload an image file via the backend and return its public URL.
 *
 * The backend stores the file in object storage (e.g., R2) and responds with:
 * `{ image_url: string }`.
 *
 * Args:
 * - file: Browser `File` object (should be an image).
 *
 * Returns:
 * - Public URL string to the uploaded image.
 */
export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  // `Content-Type: multipart/form-data` is required for file uploads.
  const response = await api.post("/upload-image", formData, {  // Use the `api` instance
    headers: {
      "Content-Type": "multipart/form-data",  // Important for file upload
    },
  });

  return response.data.image_url;
};
