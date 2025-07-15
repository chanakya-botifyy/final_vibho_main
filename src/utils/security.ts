// Security utilities

/**
 * Sanitize HTML string to prevent XSS attacks
 * @param html HTML string to sanitize
 * @returns Sanitized HTML string
 */
export const sanitizeHtml = (html: string): string => {
  const element = document.createElement('div');
  element.textContent = html;
  return element.innerHTML;
};

/**
 * Validate email format
 * @param email Email to validate
 * @returns Boolean indicating if email is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Check password strength
 * @param password Password to check
 * @returns Object with score and feedback
 */
export const checkPasswordStrength = (password: string): { 
  score: number; 
  feedback: string;
} => {
  let score = 0;
  const feedback = [];
  
  // Length check
  if (password.length < 8) {
    feedback.push('Password should be at least 8 characters long');
  } else {
    score += 1;
  }
  
  // Uppercase check
  if (!/[A-Z]/.test(password)) {
    feedback.push('Add uppercase letters');
  } else {
    score += 1;
  }
  
  // Lowercase check
  if (!/[a-z]/.test(password)) {
    feedback.push('Add lowercase letters');
  } else {
    score += 1;
  }
  
  // Number check
  if (!/[0-9]/.test(password)) {
    feedback.push('Add numbers');
  } else {
    score += 1;
  }
  
  // Special character check
  if (!/[^A-Za-z0-9]/.test(password)) {
    feedback.push('Add special characters');
  } else {
    score += 1;
  }
  
  return {
    score,
    feedback: feedback.join(', ')
  };
};

/**
 * Generate a random secure token
 * @param length Length of the token
 * @returns Random token string
 */
export const generateSecureToken = (length: number = 32): string => {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Encrypt sensitive data (client-side only, not for critical data)
 * @param data Data to encrypt
 * @param key Encryption key
 * @returns Encrypted data
 */
export const encryptData = (data: string, key: string): string => {
  // This is a simple XOR encryption, not suitable for highly sensitive data
  // For production, use a proper encryption library
  let encrypted = '';
  for (let i = 0; i < data.length; i++) {
    encrypted += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return btoa(encrypted);
};

/**
 * Decrypt data encrypted with encryptData
 * @param encryptedData Encrypted data
 * @param key Encryption key
 * @returns Decrypted data
 */
export const decryptData = (encryptedData: string, key: string): string => {
  const data = atob(encryptedData);
  let decrypted = '';
  for (let i = 0; i < data.length; i++) {
    decrypted += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return decrypted;
};

/**
 * Prevent clickjacking by setting appropriate headers
 * Note: This should be implemented on the server side
 */
export const preventClickjacking = (): void => {
  if (window.self !== window.top) {
    // If the page is loaded in an iframe
    window.top.location.href = window.self.location.href;
  }
};

/**
 * Check if the current connection is secure (HTTPS)
 */
export const isSecureConnection = (): boolean => {
  return window.location.protocol === 'https:';
};