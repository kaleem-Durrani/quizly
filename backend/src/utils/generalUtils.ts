/**
 * General utility functions for the application
 */

/**
 * Generates a random alphanumeric join code for classes
 * @param {number} length - Length of the join code (default: 6)
 * @returns {string} - Random alphanumeric join code
 */
export const generateJoinCode = (length: number = 6): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
};

/**
 * Checks if a value is defined and not null
 * @param value - The value to check
 * @returns {boolean} - True if the value is defined and not null
 */
export const isDefined = <T>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined;
};

/**
 * Formats a date to a readable string
 * @param {Date} date - The date to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Truncates a string to a specified length
 * @param {string} str - The string to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} - Truncated string with ellipsis if needed
 */
export const truncateString = (
  str: string,
  maxLength: number = 100
): string => {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + "...";
};
