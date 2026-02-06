/**
 * Password Generation Utility
 * Generates secure random passwords with configurable options
 */

/**
 * Generate a secure random password
 * @param {number} length - Password length (default: 12)
 * @param {object} options - Password options
 * @returns {string} Generated password
 */
export const generateSecurePassword = (length = 12, options = {}) => {
  const {
    includeUppercase = true,
    includeLowercase = true,
    includeNumbers = true,
    includeSymbols = true,
    excludeSimilar = true, // Exclude similar characters like i, l, 1, L, o, 0, O
  } = options;

  let charset = '';
  const lowercase = 'abcdefghijkmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const numbers = '23456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  // Characters to exclude if excludeSimilar is true
  const similar = 'il1Lo0O';

  if (includeLowercase) {
    charset += excludeSimilar ? lowercase : lowercase + 'lo';
  }
  if (includeUppercase) {
    charset += excludeSimilar ? uppercase : uppercase + 'ILO';
  }
  if (includeNumbers) {
    charset += excludeSimilar ? numbers : numbers + '01';
  }
  if (includeSymbols) {
    charset += symbols;
  }

  if (charset === '') {
    throw new Error('At least one character type must be selected');
  }

  let password = '';
  const charsetLength = charset.length;

  // Use crypto.getRandomValues for secure random generation
  const randomValues = new Uint32Array(length);
  window.crypto.getRandomValues(randomValues);

  for (let i = 0; i < length; i++) {
    password += charset[randomValues[i] % charsetLength];
  }

  // Ensure password meets complexity requirements
  if (includeUppercase && !/[A-Z]/.test(password)) {
    password = replaceRandomChar(password, uppercase[Math.floor(Math.random() * uppercase.length)]);
  }
  if (includeLowercase && !/[a-z]/.test(password)) {
    password = replaceRandomChar(password, lowercase[Math.floor(Math.random() * lowercase.length)]);
  }
  if (includeNumbers && !/[0-9]/.test(password)) {
    password = replaceRandomChar(password, numbers[Math.floor(Math.random() * numbers.length)]);
  }
  if (includeSymbols && !/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
    password = replaceRandomChar(password, symbols[Math.floor(Math.random() * symbols.length)]);
  }

  return password;
};

/**
 * Replace a random character in the password
 */
const replaceRandomChar = (password, newChar) => {
  const position = Math.floor(Math.random() * password.length);
  return password.substring(0, position) + newChar + password.substring(position + 1);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} Validation result with strength score
 */
export const validatePasswordStrength = (password) => {
  let score = 0;
  const feedback = [];

  if (!password || password.length < 8) {
    return {
      score: 0,
      strength: 'weak',
      feedback: ['Password must be at least 8 characters long'],
    };
  }

  // Length check
  if (password.length >= 12) score += 2;
  else if (password.length >= 10) score += 1;

  // Character variety checks
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 2;

  // Determine strength
  let strength = 'weak';
  if (score >= 7) strength = 'strong';
  else if (score >= 5) strength = 'medium';

  // Generate feedback
  if (!/[a-z]/.test(password)) feedback.push('Add lowercase letters');
  if (!/[A-Z]/.test(password)) feedback.push('Add uppercase letters');
  if (!/[0-9]/.test(password)) feedback.push('Add numbers');
  if (!/[^a-zA-Z0-9]/.test(password)) feedback.push('Add special characters');
  if (password.length < 12) feedback.push('Use at least 12 characters for better security');

  return {
    score,
    strength,
    feedback: feedback.length > 0 ? feedback : ['Password is strong'],
  };
};

/**
 * Generate a temporary username from name and email
 * @param {string} name - Member's full name
 * @param {string} email - Member's email
 * @returns {string} Generated username
 */
export const generateUsername = (name, email) => {
  // Extract first part of email
  const emailPrefix = email.split('@')[0].toLowerCase();
  
  // Create username from name
  const nameParts = name.toLowerCase().split(' ');
  let username = '';
  
  if (nameParts.length >= 2) {
    // FirstnameLastname format
    username = nameParts[0] + nameParts[nameParts.length - 1];
  } else {
    username = nameParts[0];
  }
  
  // Add random number for uniqueness
  const randomNum = Math.floor(Math.random() * 1000);
  username += randomNum;
  
  return username.replace(/[^a-z0-9]/g, '');
};

export default {
  generateSecurePassword,
  validatePasswordStrength,
  generateUsername,
};
