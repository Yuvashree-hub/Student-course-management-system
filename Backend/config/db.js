// backend/config/db.js
import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('❌ MONGO_URI is not set in .env');
    process.exit(1);
  }
  try {
    mongoose.set('strictQuery', true);
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log(`✅ MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.error('   Is MongoDB running? Check MONGO_URI in Backend/.env');
    process.exit(1);
  }
};
