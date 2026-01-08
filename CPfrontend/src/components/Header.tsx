/**
 * Header component
 *
 * Top navigation bar shown across the app.
 *
 * Responsibilities:
 * - Provide brand/home navigation
 * - Render the global search input
 * - Show auth-aware actions:
 *   - If logged in: Dashboard, Logout, and profile avatar
 *   - If logged out: Login and Sign up
 *
 * Data flow:
 * - Uses `useCurrentUser()` (React Query hook) to determine auth state
 * - Uses a React Query mutation to call logout, then invalidates cached user data
 */

import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import SearchBar from "./SearchBar";
import { useCurrentUser } from "../hooks/useCurrentUser";
import Button from "./button";
import { logout } from "../api/dashboard";

export default function Header() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Current authenticated user (or null) + loading state.
  const { data: currentUser, isLoading } = useCurrentUser();

  /**
   * Logout mutation:
   * - Calls the backend logout endpoint (clears auth cookie)
   * - Invalidates the current user query so the UI updates immediately
   * - Redirects to the login screen
   */
  const logoutMutation = useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      navigate("/login");
    },
  });

  // Triggers the logout mutation.
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/80 backdrop-blur border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left: brand/home navigation */}
        <h1
          onClick={() => navigate("/")}
          className="group text-xl font-extrabold tracking-tight cursor-pointer transition duration-300"
        >
          <span className="text-red-500 group-hover:drop-shadow-[0_0_16px_rgba(255,0,0,0.8)]">
            Cue
          </span>
          <span className="text-white group-hover:drop-shadow-[0_0_12px_rgba(255,0,0,0.5)]">
            Point
          </span>
        </h1>

        {/* Center: global user search */}
        <div className="relative w-full max-w-md mx-6">
          <SearchBar placeholder="Search DJs..." />
        </div>

        {/* Right: auth-aware actions */}
        <div className="flex items-center gap-3">
          {/* Avoid rendering auth actions until auth state is known */}
          {!isLoading && (
            <>
              {currentUser ? (
                <>
                  {/* Logged-in actions */}
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => navigate("/dashboard")}
                  >
                    Dashboard
                  </Button>

                  <Button
                    variant="secondary"
                    size="md"
                    className="bg-gray-800 text-red-600 hover:text-red-700 hover:bg-gray-700"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>

                  {/* Profile avatar navigates to the user's public profile */}
                  <img
                    src={currentUser.profile_image_url || "/default-avatar.png"}
                    onClick={() => navigate(`/profiles/${currentUser.id}`)}
                    className="w-9 h-9 rounded-full object-cover border
                               cursor-pointer hover:ring-2 hover:ring-primary
                               transition"
                  />
                </>
              ) : (
                <>
                  {/* Logged-out actions */}
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </Button>

                  <Button
                    variant="primary"
                    size="md"
                    className="bg-red-700 hover:bg-red-900 text-white"
                    onClick={() => navigate("/register")}
                  >
                    Sign up
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
