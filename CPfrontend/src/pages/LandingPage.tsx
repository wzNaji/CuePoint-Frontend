// src/pages/LandingPage.tsx
import { useState, useEffect } from "react";
import { api } from "../api/axios";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "../api/auth";

interface PublicProfile {
  id: number;
  display_name: string;
  bio?: string;
  profile_image_url?: string;
}

export default function LandingPage() {
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<PublicProfile[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch profiles when searchQuery changes
  useEffect(() => {
    if (!searchQuery) {
      setResults([]);
      return;
    }

    const fetchProfiles = async () => {
      setLoading(true);
      try {
        const res = await api.get("/profiles", { params: { q: searchQuery } });
        setResults(res.data);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(() => {
      fetchProfiles();
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

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

      {/* Search bar */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by display name..."
        className="w-full max-w-md p-3 border rounded mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {loading && <p>Searching...</p>}
      {!loading && results.length === 0 && searchQuery && (
        <p className="text-gray-500">No DJs found.</p>
      )}

      {/* Search results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {results.map((profile) => (
          <Link
            key={profile.id}
            to={`/profiles/${profile.id}`}
            className="bg-white p-4 rounded shadow hover:shadow-lg transition flex flex-col items-center"
          >
            <img
              src={profile.profile_image_url || "/default-avatar.png"}
              alt={profile.display_name}
              className="w-24 h-24 rounded-full object-cover mb-3"
            />
            <h2 className="text-xl font-semibold">{profile.display_name}</h2>
            {profile.bio && (
              <p className="text-gray-500 text-sm mt-1">{profile.bio}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
