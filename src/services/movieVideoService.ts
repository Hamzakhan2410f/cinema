export interface VideoSourceData {
  hasVideo: boolean;
  movieId: string;
  videoUrl: string | null;
  videoType: 'mp4' | 'hls' | 'embed' | null;
  quality?: string;
  notes?: string;
}

/**
 * Registry of legal and authorized full movie video sources on the frontend.
 */
export const LOCAL_MOVIE_VIDEO_SOURCES: Record<string, { videoUrl: string; videoType: 'mp4' | 'hls' | 'embed'; quality?: string; notes?: string }> = {
  // Tears of Steel
  '693134': {
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    videoType: 'mp4',
    quality: '1080p HD',
    notes: 'Authorized Creative Commons Open Source Feature',
  },
  // Big Buck Bunny
  '872585': {
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    videoType: 'mp4',
    quality: '1080p HD',
    notes: 'Authorized Creative Commons Open Source Feature',
  },
  // Sintel
  '572802': {
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    videoType: 'mp4',
    quality: '1080p HD',
    notes: 'Authorized Creative Commons Open Source Feature',
  },
  // Elephants Dream
  '496243': {
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    videoType: 'mp4',
    quality: '720p HD',
    notes: 'Authorized Creative Commons Open Source Feature',
  },
  // Adaptive HLS Stream
  '372058': {
    videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    videoType: 'hls',
    quality: 'Adaptive HLS',
    notes: 'Authorized Adaptive HLS Stream',
  },
  // For Bigger Blazes
  '1050035': {
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    videoType: 'mp4',
    quality: '1080p HD',
    notes: 'Authorized Feature Source',
  },
};

export class MovieVideoService {
  /**
   * Retrieves full video source information for a given movie ID.
   */
  static getMovieVideo(movieId: string | number): VideoSourceData {
    const idStr = String(movieId || '');
    if (!idStr) {
      return { hasVideo: false, movieId: '', videoUrl: null, videoType: null };
    }

    const localSource = LOCAL_MOVIE_VIDEO_SOURCES[idStr];
    if (localSource && localSource.videoUrl) {
      return {
        hasVideo: true,
        movieId: idStr,
        videoUrl: localSource.videoUrl,
        videoType: localSource.videoType,
        quality: localSource.quality,
        notes: localSource.notes,
      };
    }

    return {
      hasVideo: false,
      movieId: idStr,
      videoUrl: null,
      videoType: null,
    };
  }

  /**
   * Helper function returning just the video URL string or null.
   */
  static getMovieVideoUrl(movieId: string | number): string | null {
    const video = this.getMovieVideo(movieId);
    return video.videoUrl;
  }

  /**
   * Returns true if an authorized video source exists for this movie.
   */
  static hasMovieVideo(movieId: string | number): boolean {
    const video = this.getMovieVideo(movieId);
    return video.hasVideo;
  }
}

// Named exports as requested by user specifications
export const getMovieVideo = (movieId: string | number) => MovieVideoService.getMovieVideo(movieId);
export const getMovieVideoUrl = (movieId: string | number) => MovieVideoService.getMovieVideoUrl(movieId);
export const hasMovieVideo = (movieId: string | number) => MovieVideoService.hasMovieVideo(movieId);
