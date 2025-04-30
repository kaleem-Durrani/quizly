import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { cleanupUnverifiedAccounts, cleanupExpiredOTPs } from '../utils/cleanupUtils';

// Load environment variables
dotenv.config();

/**
 * Connect to MongoDB
 */
const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI as string);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    process.exit(1);
  }
};

/**
 * Run cleanup tasks
 */
const runCleanup = async (): Promise<void> => {
  try {
    // Connect to database
    await connectDB();

    console.log('Starting cleanup tasks...');
    
    // Clean up unverified accounts older than 24 hours
    const unverifiedDeleted = await cleanupUnverifiedAccounts(24);
    console.log(`Deleted ${unverifiedDeleted} unverified accounts`);
    
    // Clean up expired OTPs
    const otpsCleared = await cleanupExpiredOTPs();
    console.log(`Cleared OTPs for ${otpsCleared} accounts`);
    
    console.log('Cleanup tasks completed successfully');
    
    // Disconnect from database
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
    process.exit(0);
  } catch (error) {
    console.error('Error during cleanup:', error);
    process.exit(1);
  }
};

// Run the cleanup
runCleanup();
