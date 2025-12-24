import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "../api/auth";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-6">
      <h1 className="text-4xl font-bold">Welcome to CuePoint</h1>
      <p className="text-gray-600 text-center max-w-md">
        Discover DJs, manage bookings, and share your music with the world.
      </p>

      {!user && (
        <div className="flex gap-4">
          <Link
            to="/login"
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Register
          </Link>
        </div>
      )}
    </div>
  );
}
