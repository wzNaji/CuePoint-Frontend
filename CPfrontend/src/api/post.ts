import axios from "axios";

export const postsAPI = {
  getMyPosts: () => axios.get("/me/posts").then(res => res.data),
  createPost: (data: { content: string; image_url?: string }) =>
    axios.post("/me/posts", data).then(res => res.data),
  deletePost: (id: number) =>
    axios.delete(`/me/posts/${id}`).then(res => res.data),
};

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post("http://localhost:8000/upload-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.image_url;
};
