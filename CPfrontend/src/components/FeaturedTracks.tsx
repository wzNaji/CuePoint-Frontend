import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "../api/axios";

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
      const res = await api.get(`/featured-tracks/?user_id=${userId}`);
      return res.data;
    },
  });

  const addTrackMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post("/featured-tracks", { title, url });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["featuredTracks", userId],
      });
      setTitle("");
      setUrl("");
    },
  });

  const deleteTrack = async (id: number) => {
    await api.delete(`/featured-tracks/${id}`);
    queryClient.invalidateQueries({
      queryKey: ["featuredTracks", userId],
    });
  };

  return (
    <div className="p-4 border rounded bg-yellow-50 mb-6">
      <h2 className="text-xl font-semibold mb-2">Featured Tracks</h2>

      {tracks.length === 0 && <p>No tracks featured yet.</p>}

      <ul className="mb-4">
        {tracks.map(track => (
          <li key={track.id} className="flex justify-between mb-1">
            <a href={track.url} target="_blank" className="text-blue-600 underline">
              {track.title}
            </a>
            {isOwner && (
              <button
                onClick={() => deleteTrack(track.id)}
                className="text-red-500 ml-2"
              >
                Delete
              </button>
            )}
          </li>
        ))}
      </ul>

      {isOwner && (
        <div className="flex space-x-2">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Track title"
            className="p-1 border rounded flex-1"
          />
          <input
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="Track URL"
            className="p-1 border rounded flex-1"
          />
          <button
            onClick={() => addTrackMutation.mutate()}
            className="px-3 py-1 bg-green-500 text-white rounded"
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}