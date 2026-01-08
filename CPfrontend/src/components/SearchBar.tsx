/**
 * SearchBar component
 *
 * Provides a debounced search input that queries the backend for public profiles
 * matching the current query and shows results in a dropdown.
 *
 * Responsibilities:
 * - Track the user's query and fetch matching profiles from `/profiles?q=...`
 * - Debounce network requests to reduce API load while typing
 * - Render a results dropdown with links to profile pages
 * - Provide a clear button to reset the current query
 *
 * Notes:
 * - The debounce is implemented with `setTimeout` inside `useEffect` (300ms).
 * - When `query` is empty, results are cleared and no request is made.
 */

// src/components/SearchBar.tsx
import { useState, useEffect } from "react";
import { api } from "../api/axios";
import { Link } from "react-router-dom";
import Button from "./button";

interface PublicProfile {
  /** User id used to route to the public profile page. */
  id: number;

  /** Public display name shown in search results. */
  display_name: string;

  /** Optional short bio shown as a secondary line. */
  bio?: string;

  /** Optional profile image URL shown as the result avatar. */
  profile_image_url?: string;
}

interface SearchBarProps {
  /** Optional placeholder text for the search input. */
  placeholder?: string;
}

export default function SearchBar({
  placeholder = "Search by display name...",
}: SearchBarProps) {
  // Current input value.
  const [query, setQuery] = useState("");

  // Results from the backend search endpoint.
  const [results, setResults] = useState<PublicProfile[]>([]);

  // Loading state for the dropdown.
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If the query is empty, clear results and skip the request.
    if (!query) {
      setResults([]);
      return;
    }

    const fetchProfiles = async () => {
      setLoading(true);
      try {
        // Server expects a `q` query parameter for display_name search.
        const res = await api.get("/profiles", { params: { q: query } });
        setResults(res.data);
      } catch (err) {
        // Keep UX simple: log the error and show an empty result state.
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce input to avoid firing a request on every keystroke.
    const timeout = setTimeout(fetchProfiles, 300);

    // Cleanup cancels the pending request trigger when the query changes.
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="relative w-full">
      {/* Search input */}
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

      {/* Clear button (only visible when there's a query) */}
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

      {/* Results dropdown */}
      {query && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-xl border border-gray-700 bg-gray-900 shadow-xl overflow-hidden max-h-80 overflow-y-auto">
          {/* Loading indicator */}
          {loading && (
            <p className="px-4 py-3 text-sm text-gray-400">Searching…</p>
          )}

          {/* No results state */}
          {!loading && results.length === 0 && (
            <p className="px-4 py-3 text-sm text-gray-400">No users found</p>
          )}

          {/* Results list */}
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
                    <p className="text-xs text-gray-400 truncate">
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
