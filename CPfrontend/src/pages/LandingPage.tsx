import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "../api/auth";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Welcome to CuePoint</h1>

      {user ? (
        <>
          <p className="text-xl mb-6">Hello, {user.display_name} 👋</p>

          <Link
            to="/dashboard"
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go to Dashboard
          </Link>
        </>
      ) : (
        <div className="space-x-4">
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
    </div>
  );
}
