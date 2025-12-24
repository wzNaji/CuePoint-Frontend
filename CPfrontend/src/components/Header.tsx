import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useCurrentUser } from "../hooks/useCurrentUser";

export default function Header() {
  const navigate = useNavigate();
  const { data: currentUser, isLoading } = useCurrentUser();

  if (isLoading || !currentUser) return null;

  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left */}
        <h1
          onClick={() => navigate("/")}
          className="text-xl font-bold cursor-pointer hover:text-blue-600 transition"
        >
          CuePoint
        </h1>

        {/* Center */}
        <div className="relative w-full max-w-md mx-6">
          <SearchBar placeholder="Search DJs..." />
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Dashboard
          </button>

          <img
            src={currentUser.profile_image_url || "/default-avatar.png"}
            className="w-9 h-9 rounded-full object-cover border"
          />
        </div>
      </div>
    </header>
  );
}
