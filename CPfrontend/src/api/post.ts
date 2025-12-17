// src/api/post.ts
import { api } from "./axios";  // Import the centralized axios instance

export const postsAPI = {
  getMyPosts: () => api.get("/me/posts").then(res => res.data),  // Use the `api` instance
  createPost: (data: { content: string; image_url?: string }) =>
    api.post("/me/posts", data).then(res => res.data),  // Use the `api` instance
  deletePost: (id: number) =>
    api.delete(`/me/posts/${id}`).then(res => res.data),  // Use the `api` instance
};

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/upload-image", formData, {  // Use the `api` instance
    headers: {
      "Content-Type": "multipart/form-data",  // Important for file upload
    },
  });

  return response.data.image_url;
};
