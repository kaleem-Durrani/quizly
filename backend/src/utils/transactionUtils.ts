import mongoose from "mongoose";

/**
 * Executes a function within a MongoDB transaction
 * 
 * @param callback Function to execute within the transaction
 * @returns Result of the callback function
 */
export const withTransaction = async <T>(
  callback: (session: mongoose.ClientSession) => Promise<T>
): Promise<T> => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const result = await callback(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
