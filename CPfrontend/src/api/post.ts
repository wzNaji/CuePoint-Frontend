import axios from "axios";

export const postsAPI = {
  getMyPosts: () => axios.get("/me/posts").then(res => res.data),
  createPost: (data: { content: string; image_url?: string }) =>
    axios.post("/me/posts", data).then(res => res.data),
  deletePost: (id: number) =>
    axios.delete(`/me/posts/${id}`).then(res => res.data),
};
