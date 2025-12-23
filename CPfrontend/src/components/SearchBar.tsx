import { useState, useEffect } from "react";
import { api } from "../api/axios";
import { Link } from "react-router-dom";

interface PublicProfile {
  id: number;
  display_name: string;
  bio?: string;
  profile_image_url?: string;
}

interface SearchBarProps {
  placeholder?: string;
}

export default function SearchBar({ placeholder = "Search by display name..." }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PublicProfile[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const fetchProfiles = async () => {
      setLoading(true);
      try {
        const res = await api.get("/profiles", { params: { q: query } });
        setResults(res.data);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(() => fetchProfiles(), 300);
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="w-full max-w-md flex flex-col items-center mb-6">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full p-3 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {loading && <p>Searching...</p>}
      {!loading && results.length === 0 && query && (
        <p className="text-gray-500">No DJs found.</p>
      )}

      <div className="grid grid-cols-1 gap-4 w-full">
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
            {profile.bio && <p className="text-gray-500 text-sm mt-1">{profile.bio}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}
