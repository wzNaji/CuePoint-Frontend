import { api } from "./axios";
import type { Post } from "../types/post";
import type { User } from "../types/user";

// -------------------- Users --------------------
export const fetchCurrentUser = async (): Promise<User | null> => {
  try {
    const res = await api.get("/me");
    return res.data;
  } catch {
    return null;
  }
};

export const uploadProfileImage = async (file: File): Promise<User> => {
  const form = new FormData();
  form.append("file", file);
  const res = await api.put("/me/profile-image", form);
  return res.data;
};

export const logout = async (): Promise<void> => {
  await api.post("/logout");
};

// -------------------- Posts --------------------
export const fetchMyPosts = async (): Promise<Post[]> => {
  const res = await api.get("/me/posts");
  return res.data;
};

export const createPost = async (data: { content: string; imageUrl?: string }): Promise<Post> => {
  const res = await api.post("/me/posts", { content: data.content, image_url: data.imageUrl || null });
  return res.data;
};

export const updatePost = async (data: { postId: number; content: string; imageUrl?: string }): Promise<Post> => {
  const res = await api.put(`/me/posts/${data.postId}`, { content: data.content, image_url: data.imageUrl || null });
  return res.data;
};

export const deletePost = async (postId: number): Promise<void> => {
  await api.delete(`/me/posts/${postId}`);
};
