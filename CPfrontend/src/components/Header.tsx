import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useCurrentUser } from "../hooks/useCurrentUser";

export default function Header() {
  const navigate = useNavigate();
  const { data: currentUser, isLoading } = useCurrentUser();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left */}
        <h1
          onClick={() => navigate("/")}
          className="text-xl font-extrabold tracking-tight cursor-pointer
                     bg-gradient-to-r from-indigo-500 to-purple-500
                     bg-clip-text text-transparent hover:opacity-80 transition"
        >
          CuePoint
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
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="rounded-lg px-4 py-2 text-sm font-medium
                               bg-gradient-to-r from-indigo-500 to-purple-500
                               text-white shadow-sm
                               hover:opacity-90 transition"
                  >
                    Dashboard
                  </button>

                  <img
                    src={
                      currentUser.profile_image_url ||
                      "/default-avatar.png"
                    }
                    onClick={() =>
                      navigate(`/profiles/${currentUser.id}`)
                    }
                    className="w-9 h-9 rounded-full object-cover border
                               cursor-pointer hover:ring-2 hover:ring-indigo-400
                               transition"
                  />
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="rounded-lg px-4 py-2 text-sm font-medium
                               border border-gray-300
                               hover:bg-gray-100 transition"
                  >
                    Login
                  </button>

                  <button
                    onClick={() => navigate("/register")}
                    className="rounded-lg px-4 py-2 text-sm font-medium
                               bg-gradient-to-r from-indigo-500 to-purple-500
                               text-white shadow-sm
                               hover:opacity-90 transition"
                  >
                    Sign up
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
