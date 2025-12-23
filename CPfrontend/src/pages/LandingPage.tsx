import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "../api/auth";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";

export default function LandingPage() {
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
  });

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-6">Find DJs on CuePoint</h1>

      {/* Auth buttons */}
      {!user && (
        <div className="flex space-x-4 mb-6">
          <Link
            to="/login"
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Register
          </Link>
        </div>
      )}

      {/* Reusable Search Bar */}
      <SearchBar />
    </div>
  );
}
