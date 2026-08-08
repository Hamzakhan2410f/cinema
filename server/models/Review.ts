import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  userName: string;
  userAvatar?: string;
  movie: string; // externalId or Movie ObjectId
  movieTitle: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    userName: { type: String, required: true },
    userAvatar: { type: String },
    movie: { type: String, required: true, index: true },
    movieTitle: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 10 },
    comment: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
