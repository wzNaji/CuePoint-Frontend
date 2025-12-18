export type EmbedType = "soundcloud" | "bandcamp" | "youtube" | "unknown";

export function getEmbedType(url: string): EmbedType {
  if (url.includes("soundcloud.com")) return "soundcloud";
  if (url.includes("bandcamp.com")) return "bandcamp";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  return "unknown";
}

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

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/
  );
  return match ? match[1] : null;
}
