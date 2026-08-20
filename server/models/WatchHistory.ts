import mongoose, { Schema, Document } from 'mongoose';

export interface IWatchHistory extends Document {
  user: mongoose.Types.ObjectId | string;
  movieId: string;
  progress: number; // in seconds
  duration: number; // in seconds
  percentage: number; // 0 - 100
  completed: boolean;
  lastWatchedAt: Date;
}

const WatchHistorySchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    movieId: { type: String, required: true, index: true },
    progress: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
    lastWatchedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

WatchHistorySchema.index({ user: 1, movieId: 1 }, { unique: true });

export default mongoose.models.WatchHistory || mongoose.model<IWatchHistory>('WatchHistory', WatchHistorySchema);
