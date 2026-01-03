// src/components/SearchBar.tsx
import { useState, useEffect } from "react";
import { api } from "../api/axios";
import { Link } from "react-router-dom";
import Button from "./button";

interface PublicProfile {
  id: number;
  display_name: string;
  bio?: string;
  profile_image_url?: string;
}

interface SearchBarProps {
  placeholder?: string;
}

export default function SearchBar({
  placeholder = "Search by display name...",
}: SearchBarProps) {
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
      {/* INPUT */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5
                   text-sm text-gray-100 shadow-sm
                   focus:outline-none focus:ring-2 focus:ring-red-500
                   focus:border-red-500 transition pr-10"
      />

      {/* CLEAR BUTTON */}
      {query && (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setQuery("")}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 text-gray-300 hover:text-gray-200"
          aria-label="Clear search"
        >
          ×
        </Button>
      )}

      {/* RESULTS */}
      {query && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-xl border border-gray-700 bg-gray-900 shadow-xl overflow-hidden max-h-80 overflow-y-auto">
          {loading && (
            <p className="px-4 py-3 text-sm text-gray-400">Searching…</p>
          )}

          {!loading && results.length === 0 && (
            <p className="px-4 py-3 text-sm text-gray-400">No users found</p>
          )}

          {!loading &&
            results.map((profile) => (
              <Link
                key={profile.id}
                to={`/profiles/${profile.id}`}
                onClick={() => setQuery("")}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition"
              >
                <img
                  src={profile.profile_image_url || "/default-avatar.png"}
                  className="w-10 h-10 rounded-full object-cover border border-gray-700"
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-100">
                    {profile.display_name}
                  </p>
                  {profile.bio && (
                    <p className="text-xs text-gray-400 truncate">{profile.bio}</p>
                  )}
                </div>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
}
