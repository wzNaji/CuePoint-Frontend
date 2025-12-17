import axios from "axios";

// a reusable Axios instance with credentials
export const api = axios.create({
  baseURL: "http://localhost:8000",  // Backend API URL
  withCredentials: true,            // Ensures cookies are sent automatically
});
