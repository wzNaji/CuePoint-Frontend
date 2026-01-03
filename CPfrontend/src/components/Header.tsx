import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import SearchBar from "./SearchBar";
import { useCurrentUser } from "../hooks/useCurrentUser";
import Button from "./button";
import { logout } from "../api/dashboard";

export default function Header() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: currentUser, isLoading } = useCurrentUser();

  const logoutMutation = useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      navigate("/login");
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/80 backdrop-blur border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left */}
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

        {/* Center */}
        <div className="relative w-full max-w-md mx-6">
          <SearchBar placeholder="Search DJs..." />
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {!isLoading && (
            <>
              {currentUser ? (
                <>
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
