/**
 * Generates a unique cart ID as an integer between 1 and 99.
 * @returns {number} - A unique cart ID.
 */
export const generateCartId = () => {
  return Math.floor(Math.random() * 99) + 1; // Generates a number between 1 and 99
};

/**
 * Generates a unique cart session ID as an integer between 1 and 99.
 * @returns {number} - A unique cart session ID.
 */
export const cartSessionID = () => {
  return Math.floor(Math.random() * 99) + 1; // Generates a number between 1 and 99
};