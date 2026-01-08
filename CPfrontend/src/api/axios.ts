/**
 * Shared Axios HTTP client.
 *
 * This file exports a preconfigured Axios instance used across the frontend for
 * calling the backend API.
 *
 * Notes:
 * - `withCredentials: true` is required so the browser will include cookies
 *   (e.g., the HTTP-only `access_token` cookie used for authentication).
 * - `baseURL` should point to your backend API root.
 */
import axios from "axios";

// Reusable Axios instance that automatically includes cookies on requests.
export const api = axios.create({
  baseURL: "http://localhost:8000",  // Backend API URL
  withCredentials: true,            // Ensures cookies are sent automatically
});
