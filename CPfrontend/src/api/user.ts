import { api } from "./axios"; 

export const uploadProfileImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.put("/me/profile-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data", // This header is enough
    },
  });

  return response.data; // Assuming your backend returns the updated user object
};
