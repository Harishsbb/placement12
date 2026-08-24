import mongoose from 'mongoose';
import dns from 'dns';

// Fix for Windows / ISP DNS SRV resolution issues locally (skip on Vercel/serverless)
if (!process.env.VERCEL) {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (e) {
    // Fallback if system restricts setting custom DNS
  }
}

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
    throw new Error(`Database Connection Failed: ${error?.message || 'Could not reach MongoDB Atlas. Please ensure MongoDB Atlas Network Access allows 0.0.0.0/0 (Anywhere).'}`);
  }
};
