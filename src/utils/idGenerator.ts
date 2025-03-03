/**
 * Generates a random ID with specified length
 * @param length Length of the ID to generate, defaults to 12
 * @returns Random ID string
 */
export const generateRandomId = (length: number = 12): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  
  return result;
};

/**
 * Generates a sequential ID with a given prefix and counter
 * @param prefix Prefix for the ID
 * @param counter Running counter number
 * @returns Formatted ID string
 */
export const generateSequentialId = (prefix: string, counter: number): string => {
  return `${prefix}${counter.toString().padStart(6, '0')}`;
};