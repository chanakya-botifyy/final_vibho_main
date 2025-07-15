// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const isValidPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Phone number validation
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s-()]{10,15}$/;
  return phoneRegex.test(phone);
};

// URL validation
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

// Required field validation
export const isRequired = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim() !== '';
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
};

// Min length validation
export const minLength = (value: string, min: number): boolean => {
  if (!value) return false;
  return value.length >= min;
};

// Max length validation
export const maxLength = (value: string, max: number): boolean => {
  if (!value) return true;
  return value.length <= max;
};

// Number range validation
export const isInRange = (value: number, min: number, max: number): boolean => {
  if (value === null || value === undefined) return false;
  return value >= min && value <= max;
};

// Date validation
export const isValidDate = (date: string): boolean => {
  const d = new Date(date);
  return !isNaN(d.getTime());
};

// Future date validation
export const isFutureDate = (date: string): boolean => {
  if (!isValidDate(date)) return false;
  const d = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d >= today;
};

// Past date validation
export const isPastDate = (date: string): boolean => {
  if (!isValidDate(date)) return false;
  const d = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d < today;
};

// File type validation
export const isValidFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

// File size validation
export const isValidFileSize = (file: File, maxSizeInMB: number): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

// Form validation
export const validateForm = (
  values: Record<string, any>,
  rules: Record<string, (value: any) => boolean | string>
): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  Object.entries(rules).forEach(([field, rule]) => {
    const value = values[field];
    const result = rule(value);
    
    if (typeof result === 'string') {
      errors[field] = result;
    } else if (result === false) {
      errors[field] = `Invalid ${field}`;
    }
  });
  
  return errors;
};

export default {
  isValidEmail,
  isValidPassword,
  isValidPhone,
  isValidUrl,
  isRequired,
  minLength,
  maxLength,
  isInRange,
  isValidDate,
  isFutureDate,
  isPastDate,
  isValidFileType,
  isValidFileSize,
  validateForm
};