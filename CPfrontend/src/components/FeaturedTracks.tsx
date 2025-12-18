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

export default function FeaturedTracks({ userId, isOwner }: FeaturedTracksProps) {
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
    <div className="p-4 border rounded bg-yellow-50 mb-6">
      <h2 className="text-xl font-semibold mb-4">Featured Tracks</h2>

      {tracks.length === 0 && (
        <p className="text-gray-500 mb-4">No featured tracks yet.</p>
      )}

      {tracks.map((track) => {
        const type = getEmbedType(track.url);
        const embedUrl = getEmbedUrl(track.url);

        return (
          <div key={track.id} className="mb-6">
            <p className="font-medium mb-2">{track.title}</p>

            {/* 🎧 SoundCloud */}
            {type === "soundcloud" && embedUrl && (
              <iframe
                width="100%"
                height="166"
                allow="autoplay; encrypted-media"
                src={embedUrl}
                className="rounded"
                />
            )}

            {/* 📺 YouTube */}
            {type === "youtube" && embedUrl && (
              <iframe
                width="100%"
                height="315"
                src={embedUrl}
                title={track.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded"
              />
            )}

            {/* 🛒 Bandcamp */}
            {type === "bandcamp" && (
              <iframe
                style={{ border: 0, width: "100%", height: "120px" }}
                src={track.url}
                seamless
                title={track.title}
              />
            )}

            {/* Fallback */}
            {type === "unknown" && (
              <a
                href={track.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Open track
              </a>
            )}

            {isOwner && (
              <button
                onClick={() => deleteTrack(track.id)}
                className="text-red-500 text-sm mt-2"
              >
                Remove
              </button>
            )}
          </div>
        );
      })}

      {isOwner && (
        <div className="mt-4 space-y-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Track title"
            className="w-full p-2 border rounded"
          />
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="SoundCloud / YouTube / Bandcamp URL"
            className="w-full p-2 border rounded"
          />
          <button
            onClick={() => addTrack.mutate()}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Add Track
          </button>
        </div>
      )}
    </div>
  );
}
