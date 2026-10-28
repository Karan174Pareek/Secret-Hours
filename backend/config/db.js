import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/zariya_couture';
  try {
    const conn = await mongoose.connect(uri, {
      bufferCommands: false,
    });
    isConnected = true;
    console.log(`[MongoDB] Connected to ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.error('[MongoDB] Connection error:', err.message);
    throw err;
  }
};

export default connectDB;
