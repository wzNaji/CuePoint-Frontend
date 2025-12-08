import axios from "axios";

// 🔥 Reusable Axios instance with credentials
export const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true, // important: send cookies automatically
});

// ✅ Fetch current authenticated user from cookie
export async function fetchCurrentUser() {
  try {
    const res = await api.get("/me");
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
  const res = await api.post("/login", form);
  return res.data;
}

// ✅ Logout function (optional)
export async function logoutUser() {
  await api.post("/logout"); // you can create a logout endpoint that deletes cookie
}

export const fetchMyPosts = async () => {
  try {
    const response = await api.get("/me/posts"); 
    return response.data;
  } catch (err) {
    console.error("Failed to fetch posts:", err);
    throw err;
  }
};
