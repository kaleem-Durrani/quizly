import { Student } from '../models';
import { withTransaction } from './transactionUtils';

/**
 * Clean up unverified student accounts that are older than the specified hours
 * @param hours Number of hours after which unverified accounts should be deleted
 * @returns Number of deleted accounts
 */
export const cleanupUnverifiedAccounts = async (hours: number = 24): Promise<number> => {
  try {
    // Calculate the cutoff date
    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - hours);

    // Use transaction to ensure atomicity
    const result = await withTransaction(async (session) => {
      // Find and delete unverified accounts older than the cutoff date
      const deleteResult = await Student.deleteMany({
        isVerified: false,
        createdAt: { $lt: cutoffDate }
      }, { session });

      return deleteResult.deletedCount;
    });

    console.log(`Cleaned up ${result} unverified accounts older than ${hours} hours`);
    return result;
  } catch (error) {
    console.error('Error cleaning up unverified accounts:', error);
    throw error;
  }
};

/**
 * Clean up expired OTPs
 * @returns Number of accounts updated
 */
export const cleanupExpiredOTPs = async (): Promise<number> => {
  try {
    const now = new Date();

    // Use transaction to ensure atomicity
    const result = await withTransaction(async (session) => {
      // Find and update accounts with expired OTPs
      const updateResult = await Student.updateMany(
        {
          otpExpiry: { $lt: now },
          verificationOTP: { $exists: true }
        },
        {
          $unset: { verificationOTP: "", otpExpiry: "" }
        },
        { session }
      );

      return updateResult.modifiedCount;
    });

    console.log(`Cleaned up OTPs for ${result} accounts`);
    return result;
  } catch (error) {
    console.error('Error cleaning up expired OTPs:', error);
    throw error;
  }
};
