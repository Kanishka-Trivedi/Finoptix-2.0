import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // Timeout after 10s instead of 30s default
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      family: 4, // Use IPv4, skip trying IPv6
      maxPoolSize: 10,
      minPoolSize: 2,
      retryWrites: true,
      retryReads: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('[MongoDB] Successfully connected to database');
      return mongoose;
    }).catch((error) => {
      console.error('[MongoDB] Connection error:', error.message);
      cached.promise = null;
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('[MongoDB] Failed to establish connection:', e.message);
    throw e;
  }

  return cached.conn;
}

export default connectDB;
