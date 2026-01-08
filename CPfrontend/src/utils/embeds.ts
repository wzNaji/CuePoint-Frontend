/**
 * embed.ts
 *
 * Utility functions for handling media embed URLs for SoundCloud, Bandcamp, and YouTube.
 * 
 * Provides:
 * - `getEmbedType(url)` to detect the platform
 * - `getEmbedUrl(url)` to generate the correct embed URL
 * - Internal helper `extractYouTubeId(url)` for YouTube URL parsing
 */

/**
 * Supported embed platforms.
 */
export type EmbedType = "soundcloud" | "bandcamp" | "youtube" | "unknown";

/**
 * Determines the type of media embed from a URL.
 *
 * @param url - The media URL
 * @returns The platform type: "soundcloud" | "bandcamp" | "youtube" | "unknown"
 */
export function getEmbedType(url: string): EmbedType {
  if (url.includes("soundcloud.com")) return "soundcloud";
  if (url.includes("bandcamp.com")) return "bandcamp";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  return "unknown";
}

/**
 * Returns the proper embed URL for a given media URL.
 *
 * For SoundCloud, returns the official widget URL.
 * For YouTube, returns the embed URL (or null if invalid).
 * For Bandcamp, returns the original URL (requires iframe handling).
 *
 * @param url - The media URL
 * @returns The embed URL string or null if unsupported/invalid
 */
export function getEmbedUrl(url: string): string | null {
  const encoded = encodeURIComponent(url);

  // 🎧 SoundCloud
  if (url.includes("soundcloud.com")) {
    return `https://w.soundcloud.com/player/?url=${encoded}&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&visual=true`;
  }

  // 📺 YouTube
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    const videoId = extractYouTubeId(url);
    if (!videoId) return null;
    return `https://www.youtube.com/embed/${videoId}`;
  }

  // 🛒 Bandcamp (requires iframe HTML, handled separately)
  if (url.includes("bandcamp.com")) {
    return url;
  }

  return null;
}

/**
 * Extracts the YouTube video ID from a standard or shortened URL.
 *
 * @param url - The YouTube URL
 * @returns The 11-character video ID or null if not found
 */
function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/
  );
  return match ? match[1] : null;
}
