import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/zariya_couture';
  try {
    const conn = await mongoose.connect(uri);
    console.log(`[MongoDB] Connected to ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.error('[MongoDB] Connection error:', err.message);
    throw err;
  }
};

export default connectDB;
