import crypto from 'crypto';
import bcrypt from 'bcryptjs';

/**
 * Generate a secure random password
 * @param length Length of the password (default: 10)
 * @returns A random password with mixed characters
 */
export const generateRandomPassword = (length: number = 10): string => {
  // Define character sets
  const uppercaseChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // Removed confusing chars like I, O
  const lowercaseChars = 'abcdefghijkmnopqrstuvwxyz'; // Removed confusing chars like l
  const numberChars = '23456789'; // Removed confusing chars like 0, 1
  const specialChars = '!@#$%^&*_-+=';
  
  // Combine all character sets
  const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;
  
  // Ensure password has at least one character from each set
  let password = '';
  password += uppercaseChars.charAt(Math.floor(crypto.randomInt(uppercaseChars.length)));
  password += lowercaseChars.charAt(Math.floor(crypto.randomInt(lowercaseChars.length)));
  password += numberChars.charAt(Math.floor(crypto.randomInt(numberChars.length)));
  password += specialChars.charAt(Math.floor(crypto.randomInt(specialChars.length)));
  
  // Fill the rest of the password with random characters
  for (let i = 4; i < length; i++) {
    password += allChars.charAt(Math.floor(crypto.randomInt(allChars.length)));
  }
  
  // Shuffle the password characters
  return password.split('').sort(() => 0.5 - Math.random()).join('');
};

/**
 * Hash a password using bcrypt
 * @param password Plain text password
 * @returns Hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Compare a plain text password with a hashed password
 * @param plainPassword Plain text password
 * @param hashedPassword Hashed password
 * @returns True if passwords match, false otherwise
 */
export const comparePasswords = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};
