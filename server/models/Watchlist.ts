import mongoose, { Schema, Document } from 'mongoose';

export interface IWatchlist extends Document {
  user: mongoose.Types.ObjectId;
  movie: string; // externalId or Movie ObjectId
  addedAt: Date;
}

const WatchlistSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    movie: { type: String, required: true, index: true },
    addedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

WatchlistSchema.index({ user: 1, movie: 1 }, { unique: true });

export default mongoose.models.Watchlist || mongoose.model<IWatchlist>('Watchlist', WatchlistSchema);
