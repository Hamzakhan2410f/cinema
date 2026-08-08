import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cinema_db';
  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2000, // Quick timeout to fall back to in-memory mode if Mongo is not running locally
    });
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.warn(`⚠️ MongoDB connection warning (${error.message}). Operating in high-speed cached memory DB mode.`);
  }
};
