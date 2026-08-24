import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async (): Promise<void> => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }

  const connStr = process.env.MONGODB_URI || 'mongodb://localhost:27017/placement-quest';
  try {
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = !!conn.connections[0].readyState;
    console.log(`[MongoDB Atlas] Connected successfully to host: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`[MongoDB Error] Could not connect: ${error?.message || error}`);
    throw new Error(`Database Connection Failed: ${error?.message || 'Could not reach MongoDB Atlas.'}`);
  }
};
