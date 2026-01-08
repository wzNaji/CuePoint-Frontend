/**
 * Profile image upload API helper.
 *
 * Uploads a new profile image for the authenticated user using multipart/form-data.
 * The backend stores the image (e.g., in R2) and returns the updated user payload.
 *
 * Notes:
 * - Uses the shared Axios instance (`api`) which should be configured with
 *   `withCredentials: true` so auth cookies are included.
 * - The backend expects the file field name to be `"file"`.
 */

import { api } from "./axios"; 

export const uploadProfileImage = async (file: File) => {
  // Use FormData for file uploads.
  const formData = new FormData();
  formData.append("file", file);

  // Explicit Content-Type header ensures multipart upload handling.
  const response = await api.put("/me/profile-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  // Returns the updated user object (shape depends on backend `UserOut` schema).
  return response.data;
};
