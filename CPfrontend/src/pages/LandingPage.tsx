import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "../api/auth";

export default function LandingPage() {
  const { isLoading } = useQuery({
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
    </div>
  );
}
  