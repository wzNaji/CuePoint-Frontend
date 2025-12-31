import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "../api/axios";
import { getEmbedType, getEmbedUrl } from "../utils/embeds";

interface Track {
  id: number;
  title: string;
  url: string;
}

interface FeaturedTracksProps {
  userId: number;
  isOwner: boolean;
}

export default function FeaturedTracks({
  userId,
  isOwner,
}: FeaturedTracksProps) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const { data: tracks = [] } = useQuery<Track[]>({
    queryKey: ["featuredTracks", userId],
    queryFn: async () => {
      const res = await api.get(`/featured-tracks?user_id=${userId}`);
      return res.data;
    },
  });

  const addTrack = useMutation({
    mutationFn: async () => {
      const res = await api.post("/featured-tracks", { title, url });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["featuredTracks", userId] });
      setTitle("");
      setUrl("");
    },
  });

  const deleteTrack = async (id: number) => {
    await api.delete(`/featured-tracks/${id}`);
    queryClient.invalidateQueries({ queryKey: ["featuredTracks", userId] });
  };

  return (
    <section className="mb-6 rounded-xl border border-gray-200 bg-white shadow-sm p-6">
      {/* HEADER */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          🎧 <span>Featured Tracks</span>
        </h2>
      </div>

      {/* EMPTY STATE */}
      {tracks.length === 0 && (
        <p className="text-sm text-gray-500">
          No featured tracks yet.
        </p>
      )}

      {/* TRACKS */}
      <div className="space-y-6">
        {tracks.map((track) => {
          const type = getEmbedType(track.url);
          const embedUrl = getEmbedUrl(track.url);

          return (
            <div
              key={track.id}
              className="rounded-lg border border-gray-200 p-4"
            >
              {/* TITLE + ACTION */}
              <div className="mb-3 flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-gray-900">
                  {track.title}
                </p>

                {isOwner && (
                  <button
                    onClick={() => deleteTrack(track.id)}
                    className="text-xs text-red-500 hover:text-red-700 transition"
                  >
                    Remove
                  </button>
                )}
              </div>

              {/* EMBEDS */}
              {type === "soundcloud" && embedUrl && (
                <iframe
                  width="100%"
                  height="166"
                  allow="autoplay; encrypted-media"
                  src={embedUrl}
                  className="rounded-md"
                />
              )}

              {type === "youtube" && embedUrl && (
                <iframe
                  width="100%"
                  height="315"
                  src={embedUrl}
                  title={track.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-md"
                />
              )}

              {type === "bandcamp" && (
                <iframe
                  style={{ border: 0, width: "100%", height: "120px" }}
                  src={track.url}
                  seamless
                  title={track.title}
                />
              )}

              {type === "unknown" && (
                <a
                  href={track.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-indigo-600 hover:underline"
                >
                  Open track
                </a>
              )}
            </div>
          );
        })}
      </div>

      {/* ADD TRACK */}
      {isOwner && (
        <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="mb-3 text-sm font-medium text-gray-900">
            Add a featured track
          </p>

          <div className="space-y-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Track title"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="SoundCloud / YouTube / Bandcamp URL"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <button
              onClick={() => addTrack.mutate()}
              className="rounded-md bg-gradient-to-r from-indigo-500 to-purple-500
                         px-4 py-2 text-sm font-medium text-white
                         hover:opacity-90 transition"
            >
              Add track
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
