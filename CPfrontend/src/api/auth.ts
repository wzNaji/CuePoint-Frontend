/**
 * Auth-related API helpers.
 *
 * This module contains thin wrapper functions around the shared Axios instance
 * (`api`) for authentication and "current user" endpoints.
 *
 * Notes:
 * - The backend stores the JWT access token in an HTTP-only cookie, so these
 *   requests rely on cookies being sent with requests (Axios `withCredentials`
 *   should be configured in `./axios` if needed).
 * - Login uses form-encoded fields (`username`, `password`) to match
 *   FastAPI's `OAuth2PasswordRequestForm`.
 */
import { api } from "./axios";

/**
 * Fetch the currently authenticated user.
 *
 * The backend identifies the user from the access token stored in an HTTP-only
 * cookie. If the cookie is missing/invalid, this returns `null`.
 *
 * Returns:
 * - User object (shape depends on backend `UserOut` schema) or `null` if not logged in.
 */
export async function fetchCurrentUser() {
  try {
    const res = await api.get("/me");
    return res.data;
  } catch {
    // Treat any error as "not authenticated" for consumer convenience.
    return null;
  }
}

/**
 * Log in a user using email + password.
 *
 * Uses `FormData` and the fields `username`/`password` to match FastAPI's
 * `OAuth2PasswordRequestForm` expectation.
 *
 * Args:
 * - email: User's email address (sent as `username` field).
 * - password: Plaintext password.
 *
 * Returns:
 * - Token response payload from the backend (typically `{ access_token, token_type }`).
 */
export async function loginUser(email: string, password: string) {
  const form = new FormData();
  form.append("username", email);
  form.append("password", password);

  const res = await api.post("/login", form);
  return res.data;
}

/**
 * Register a new user account.
 *
 * Args:
 * - email: User's email address.
 * - displayName: Public display name to be shown in profiles.
 * - password: Plaintext password (will be hashed server-side).
 *
 * Returns:
 * - Newly created user payload (shape depends on backend `UserOut` schema).
 */
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

/**
 * Log out the current user.
 *
 * The backend clears the auth cookie. No value is returned.
 */
export async function logoutUser() {
  await api.post("/logout");
}

/**
 * Fetch posts for the currently authenticated user.
 *
 * Returns:
 * - Array of posts (shape depends on backend `PostOut` schema).
 *
 * Throws:
 * - Re-throws the underlying error so callers can handle UI notifications, retries, etc.
 */
export const fetchMyPosts = async () => {
  try {
    const response = await api.get("/me/posts");
    return response.data;
  } catch (err) {
    console.error("Failed to fetch posts:", err);
    throw err;
  }
};
