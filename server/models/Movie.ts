import mongoose, { Schema, Document } from 'mongoose';

export interface IMovieCast {
  id: number;
  name: string;
  character: string;
  profilePath?: string;
}

export interface IMovie extends Document {
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
  runtime?: number;
  rating: number;
  voteCount: number;
  cast: IMovieCast[];
  directors: string[];
  trailerUrl?: string;
  industry?: 'Hollywood' | 'Bollywood' | 'Korean' | 'Japanese' | 'International';
  createdAt: Date;
  updatedAt: Date;
}

const MovieSchema: Schema = new Schema(
  {
    externalId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, index: true },
    originalTitle: { type: String },
    overview: { type: String, required: true },
    posterPath: { type: String, required: true },
    backdropPath: { type: String, required: true },
    releaseDate: { type: String, required: true },
    genres: [{ type: String, index: true }],
    languages: [{ type: String }],
    countries: [{ type: String }],
    runtime: { type: Number },
    rating: { type: Number, default: 0 },
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
    trailerUrl: { type: String },
    industry: { type: String, enum: ['Hollywood', 'Bollywood', 'Korean', 'Japanese', 'International'], default: 'Hollywood' },
  },
  { timestamps: true }
);

export default mongoose.models.Movie || mongoose.model<IMovie>('Movie', MovieSchema);
