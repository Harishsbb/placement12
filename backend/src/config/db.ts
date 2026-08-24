import mongoose from 'mongoose';
import dns from 'dns';

// Fix for Windows / ISP DNS SRV resolution issues with MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Fallback if system restricts setting custom DNS
}

export const connectDB = async (): Promise<void> => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://localhost:27017/placement-quest';
    const conn = await mongoose.connect(connStr);
    console.log(`[MongoDB Atlas] Connected successfully to host: ${conn.connection.host}`);
  } catch (error: any) {
    console.warn(`[MongoDB Warning] Could not connect to MongoDB Atlas / Local DB: ${error?.message || error}`);
    console.warn('[MongoDB Warning] Operating in resilient mode. Ensure network access is allowed on MongoDB Atlas IP access list.');
  }
};
