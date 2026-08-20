import mongoose, { Schema, Document } from 'mongoose';

export interface IMovieCast {
  id?: number;
  name: string;
  character: string;
  profilePath?: string;
}

export interface IMovie extends Document {
  externalId: string;
  title: string;
  slug: string;
  originalTitle?: string;
  overview: string;
  shortDescription?: string;
  posterPath: string;
  backdropPath: string;
  thumbnailUrl?: string;
  releaseDate: string;
  releaseYear?: number;
  genres: string[];
  languages: string[];
  countries: string[];
  runtime?: number;
  rating: number;
  voteCount: number;
  cast: IMovieCast[];
  directors: string[];
  trailerKey?: string;
  trailerUrl?: string;
  videoUrl?: string | null;
  videoType?: 'mp4' | 'hls' | 'external' | null;
  videoStorageProvider?: string;
  videoStorageKey?: string;
  industry?: 'Hollywood' | 'Bollywood' | 'Korean' | 'Japanese' | 'International';
  featured?: boolean;
  isPublished?: boolean;
  isComingSoon?: boolean;
  views?: number;
  likes?: number;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MovieSchema: Schema = new Schema(
  {
    externalId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, index: true },
    slug: { type: String, required: true, index: true },
    originalTitle: { type: String },
    overview: { type: String, required: true },
    shortDescription: { type: String },
    posterPath: { type: String, required: true },
    backdropPath: { type: String, required: true },
    thumbnailUrl: { type: String },
    releaseDate: { type: String, required: true },
    releaseYear: { type: Number, index: true },
    genres: [{ type: String, index: true }],
    languages: [{ type: String }],
    countries: [{ type: String }],
    runtime: { type: Number },
    rating: { type: Number, default: 0, index: true },
    voteCount: { type: Number, default: 0 },
    cast: [
      {
        id: Number,
        name: String,
        character: String,
        profilePath: String,
      },
    ],
    directors: [{ type: String }],
    trailerKey: { type: String },
    trailerUrl: { type: String },
    videoUrl: { type: String, default: null },
    videoType: { type: String, enum: ['mp4', 'hls', 'external', null], default: null },
    videoStorageProvider: { type: String },
    videoStorageKey: { type: String },
    industry: { type: String, enum: ['Hollywood', 'Bollywood', 'Korean', 'Japanese', 'International'], default: 'Hollywood' },
    featured: { type: Boolean, default: false, index: true },
    isPublished: { type: Boolean, default: true, index: true },
    isComingSoon: { type: Boolean, default: false, index: true },
    views: { type: Number, default: 0, index: true },
    likes: { type: Number, default: 0 },
    createdBy: { type: String },
  },
  { timestamps: true }
);

MovieSchema.index({ title: 'text', overview: 'text', directors: 'text' });

export default mongoose.models.Movie || mongoose.model<IMovie>('Movie', MovieSchema);

