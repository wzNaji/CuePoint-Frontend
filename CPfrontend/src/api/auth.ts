// src/api/auth.ts
import { api } from "./axios";  // Import the centralized axios instance

// ✅ Fetch current authenticated user from cookie
export async function fetchCurrentUser() {
  try {
    const res = await api.get("/me");  // Use the `api` instance
    return res.data; // user object
  } catch {
    return null; // no cookie / invalid token
  }
}

// ✅ Login function
export async function loginUser(email: string, password: string) {
  const form = new FormData();
  form.append("username", email);
  form.append("password", password);

  // cookie will be set automatically by backend
  const res = await api.post("/login", form);  // Use the `api` instance
  return res.data;
}

// ✅ Logout function (optional)
export async function logoutUser() {
  await api.post("/logout");  // You can create a logout endpoint that deletes the cookie
}

// ✅ Fetch posts from the current user
export const fetchMyPosts = async () => {
  try {
    const response = await api.get("/me/posts");  // Use the `api` instance
    return response.data;
  } catch (err) {
    console.error("Failed to fetch posts:", err);
    throw err;
  }
};
