import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "../api/auth";

/**
 * Custom hook to fetch the currently logged-in user.
 * Wraps React Query's useQuery for easier reuse across components.
 */

export function useCurrentUser() {
  return useQuery({
    // Unique key for caching this query
    queryKey: ["currentUser"],

    // Function to fetch the current user from the backend
    queryFn: fetchCurrentUser,
    // Consider the data fresh for 5 minutes to avoid unnecessary refetches
    staleTime: 1000 * 60 * 5, // 5 minutes

    // Do not retry automatically on failure (useful for auth endpoints)
    retry: false,
  });
}
