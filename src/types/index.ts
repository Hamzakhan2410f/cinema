export interface CastMember {
  id: number;
  name: string;
  character: string;
  profilePath?: string;
}

export interface Movie {
  externalId: string;
  title: string;
  originalTitle?: string;
  overview: string;
  posterPath: string;
  backdropPath: string;
  releaseDate: string;
  genres: string[];
  languages: string[];
  countries: string[];
  runtime: number;
  rating: number;
  voteCount: number;
  cast: CastMember[];
  directors: string[];
  trailerUrl?: string;
  trailerKey?: string;
  videoUrl?: string | null;
  videoType?: 'mp4' | 'hls' | 'embed' | null;
  industry: 'Hollywood' | 'Bollywood' | 'Korean' | 'Japanese' | 'International';
  trending?: boolean;
  popular?: boolean;
  topRated?: boolean;
  upcoming?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  favorites?: string[];
}

export interface Review {
  _id: string;
  user: string;
  userName: string;
  userAvatar?: string;
  movie: string;
  movieTitle: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface FilterState {
  search: string;
  genre: string;
  language: string;
  country: string;
  year: string;
  rating: number;
  sortBy: 'popularity' | 'rating' | 'releaseDate' | 'title';
  page: number;
}
