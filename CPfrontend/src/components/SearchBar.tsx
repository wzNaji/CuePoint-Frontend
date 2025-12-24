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

    const timeout = setTimeout(fetchProfiles, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* DROPDOWN RESULTS */}
      {query && (
        <div className="absolute top-full left-0 right-0 bg-white border rounded shadow-lg mt-2 z-50 max-h-80 overflow-y-auto">
          {loading && <p className="p-3 text-sm text-gray-500">Searching…</p>}

          {!loading && results.length === 0 && (
            <p className="p-3 text-sm text-gray-500">No users found</p>
          )}

          {results.map((profile) => (
            <Link
              key={profile.id}
              to={`/profiles/${profile.id}`}
              onClick={() => setQuery("")}
              className="flex items-center gap-3 p-3 hover:bg-gray-100 transition"
            >
              <img
                src={profile.profile_image_url || "/default-avatar.png"}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{profile.display_name}</p>
                {profile.bio && (
                  <p className="text-xs text-gray-500 truncate">
                    {profile.bio}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
