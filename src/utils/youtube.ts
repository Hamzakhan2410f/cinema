/**
 * Safely extracts an 11-character YouTube video ID from various URL formats or raw ID strings.
 */
export const extractYouTubeId = (input: string | null | undefined): string | null => {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  // 1. Check if it's already a raw 11-character YouTube ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // 2. Extract using regex matching common YouTube URL structures
  // Handles: watch?v=ID, youtu.be/ID, embed/ID, shorts/ID, v/ID
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/i;
  const match = trimmed.match(regExp);

  if (match && match[1] && match[1].length === 11) {
    return match[1];
  }

  return null;
};

/**
 * Returns a clean YouTube embed URL string (e.g., https://www.youtube.com/embed/abc123XYZ)
 * or null if the input is not a valid YouTube URL or video ID.
 */
export const getYouTubeEmbedUrl = (input: string | null | undefined): string | null => {
  const videoId = extractYouTubeId(input);
  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}`;
};

/**
 * Returns a fallback YouTube search URL for a given movie title.
 */
export const getYouTubeSearchUrl = (movieTitle: string | null | undefined): string => {
  const cleanTitle = (movieTitle || 'movie').trim();
  const query = `${cleanTitle} official trailer`;
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
};
