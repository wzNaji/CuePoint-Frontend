import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "../api/auth";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });
}
