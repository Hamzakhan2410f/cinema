import Movie from '../models/Movie.js';

export interface VideoSource {
  movieId: string;
  videoUrl: string;
  videoType: 'mp4' | 'hls' | 'external';
  title?: string;
  quality?: string;
  subtitleUrl?: string;
  notes?: string;
}

/**
 * Registry of legal and authorized full movie video sources.
 * In a full production environment, this connects to your authorized video CDN, S3 bucket,
 * public-domain movie archive, or HLS media server.
 */
export const MOVIE_VIDEO_SOURCES: Record<string, Omit<VideoSource, 'movieId'>> = {
  // Tears of Steel (Open Source Creative Commons Film by Blender Foundation)
  '693134': {
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    videoType: 'mp4',
    quality: '1080p HD',
    notes: 'Authorized Creative Commons Open Source Feature',
  },
  // Big Buck Bunny (Open Source Film)
  '872585': {
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    videoType: 'mp4',
    quality: '1080p HD',
    notes: 'Authorized Creative Commons Open Source Feature',
  },
  // Sintel (Blender Foundation)
  '572802': {
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    videoType: 'mp4',
    quality: '1080p HD',
    notes: 'Authorized Creative Commons Open Source Feature',
  },
  // Elephant's Dream
  '496243': {
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    videoType: 'mp4',
    quality: '720p HD',
    notes: 'Authorized Creative Commons Open Source Feature',
  },
  // Sample HLS Stream test source (HLS test stream)
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
   * Checks both MongoDB database and authorized source registry.
   */
  static async getMovieVideoAsync(movieId: string): Promise<{
    hasVideo: boolean;
    movieId: string;
    videoUrl: string | null;
    videoType: 'mp4' | 'hls' | 'external' | null;
    quality?: string;
    notes?: string;
  }> {
    if (!movieId) {
      return { hasVideo: false, movieId: '', videoUrl: null, videoType: null };
    }

    // First check MongoDB database for custom uploaded or assigned videoUrl
    try {
      const dbMovie = await (Movie as any).findOne({
        $or: [{ externalId: String(movieId) }, { _id: movieId }],
      }).lean();

      if (dbMovie && dbMovie.videoUrl) {
        return {
          hasVideo: true,
          movieId: String(movieId),
          videoUrl: dbMovie.videoUrl,
          videoType: (dbMovie.videoType as any) || 'mp4',
          quality: 'Original Master HD',
          notes: 'Authorized Uploaded Stream Source',
        };
      }
    } catch (e) {}

    // Fallback to static authorized source registry
    const source = MOVIE_VIDEO_SOURCES[String(movieId)];
    if (source && source.videoUrl) {
      return {
        hasVideo: true,
        movieId: String(movieId),
        videoUrl: source.videoUrl,
        videoType: source.videoType,
        quality: source.quality,
        notes: source.notes,
      };
    }

    return {
      hasVideo: false,
      movieId: String(movieId),
      videoUrl: null,
      videoType: null,
    };
  }

  /**
   * Sync fallback method for legacy callers.
   */
  static getMovieVideo(movieId: string) {
    if (!movieId) {
      return { hasVideo: false, movieId: '', videoUrl: null, videoType: null };
    }

    const source = MOVIE_VIDEO_SOURCES[String(movieId)];
    if (source && source.videoUrl) {
      return {
        hasVideo: true,
        movieId: String(movieId),
        videoUrl: source.videoUrl,
        videoType: source.videoType,
        quality: source.quality,
        notes: source.notes,
      };
    }

    return {
      hasVideo: false,
      movieId: String(movieId),
      videoUrl: null,
      videoType: null,
    };
  }
}

