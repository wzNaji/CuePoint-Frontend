/**
 * FeaturedTracks component
 *
 * Displays a user's featured tracks and renders media embeds when possible.
 * Owners can add new tracks and remove existing ones.
 *
 * Data fetching/caching:
 * - Uses React Query with cache key: ["featuredTracks", userId]
 *
 * Embed behavior:
 * - Uses `getEmbedType` + `getEmbedUrl` to determine whether a URL can be embedded
 *   (SoundCloud / YouTube / Bandcamp) or should be shown as a plain link.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "../api/axios";
import { getEmbedType, getEmbedUrl } from "../utils/embeds";
import Button from "./button";
import Card from "./Card";

interface Track {
  /** Database id for the featured track record. */
  id: number;
  /** Display title shown in the UI. */
  title: string;
  /** Original URL provided by the user (SoundCloud/YouTube/Bandcamp/etc.). */
  url: string;
}

interface FeaturedTracksProps {
  /** User id whose featured tracks should be displayed. */
  userId: number;
  /** Whether the current viewer is the owner (enables add/remove controls). */
  isOwner: boolean;
}

export default function FeaturedTracks({ userId, isOwner }: FeaturedTracksProps) {
  const queryClient = useQueryClient();

  // Controlled inputs for the "add track" form.
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  /**
   * Fetch featured tracks for the given user.
   * The backend endpoint expects `user_id` as a query parameter.
   */
  const { data: tracks = [] } = useQuery<Track[]>({
    queryKey: ["featuredTracks", userId],
    queryFn: async () => {
      const res = await api.get(`/featured-tracks/?user_id=${userId}`);
      return res.data;
    },
  });

  /**
   * Mutation for adding a track (owner-only).
   * On success, invalidates the list query so the UI refreshes.
   */
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

  /**
   * Delete a featured track by id (owner-only) and refresh the list.
   */
  const deleteTrack = async (id: number) => {
    await api.delete(`/featured-tracks/${id}`);
    queryClient.invalidateQueries({ queryKey: ["featuredTracks", userId] });
  };

  return (
    <Card className="mb-6 space-y-6 bg-neutral-900 border-neutral-800 text-neutral-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <span>Featured Tracks</span>
        </h2>
      </div>

      {/* Empty state */}
      {tracks.length === 0 && (
        <p className="text-sm text-neutral-400">No featured tracks yet.</p>
      )}

      {/* Track list */}
      <div className="space-y-6">
        {tracks.map((track) => {
          // Determine which embed type (if any) the URL supports.
          const type = getEmbedType(track.url);

          // Convert the original URL into an embeddable URL where applicable.
          const embedUrl = getEmbedUrl(track.url);

          return (
            <Card
              key={track.id}
              className="p-4 bg-neutral-950 border-neutral-800 space-y-2"
            >
              {/* Title + owner action */}
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-neutral-100">{track.title}</p>

                {isOwner && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="text-red-500"
                    onClick={() => deleteTrack(track.id)}
                  >
                    Remove
                  </Button>
                )}
              </div>

              {/* Embeds:
                  - SoundCloud uses a smaller player height
                  - YouTube uses standard video embed sizing
                  - Bandcamp uses the provided embed URL directly
                  - Unknown types fall back to an external link */}
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
                  className="text-sm text-primary hover:underline"
                >
                  Open track
                </a>
              )}
            </Card>
          );
        })}
      </div>

      {/* Add track form (owner-only) */}
      {isOwner && (
        <Card className="p-4 bg-neutral-950 border-neutral-800 space-y-3">
          <p className="text-sm font-medium text-neutral-100">Add a featured track</p>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Track title"
            className="w-full rounded-md border border-neutral-700 px-3 py-2 text-sm bg-neutral-950 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="SoundCloud / YouTube / Bandcamp URL"
            className="w-full rounded-md border border-neutral-700 px-3 py-2 text-sm bg-neutral-950 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <Button
            variant="primary"
            size="md"
            className="w-full"
            onClick={() => addTrack.mutate()}
          >
            Add track
          </Button>
        </Card>
      )}
    </Card>
  );
}
