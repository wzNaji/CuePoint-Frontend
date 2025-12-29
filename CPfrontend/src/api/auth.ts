// src/api/auth.ts
import { api } from "./axios";

// ✅ Fetch current authenticated user from cookie
export async function fetchCurrentUser() {
  try {
    const res = await api.get("/me");
    return res.data;
  } catch {
    return null;
  }
}

// ✅ Login function
export async function loginUser(email: string, password: string) {
  const form = new FormData();
  form.append("username", email);
  form.append("password", password);

  const res = await api.post("/login", form);
  return res.data;
}

// ✅ Register function
export async function registerUser(
  email: string,
  displayName: string,
  password: string
) {
  const res = await api.post("/register", {
    email,
    display_name: displayName,
    password,
  });

  return res.data;
}

// ✅ Logout function
export async function logoutUser() {
  await api.post("/logout");
}

// ✅ Fetch posts from the current user
export const fetchMyPosts = async () => {
  try {
    const response = await api.get("/me/posts");
    return response.data;
  } catch (err) {
    console.error("Failed to fetch posts:", err);
    throw err;
  }
};
