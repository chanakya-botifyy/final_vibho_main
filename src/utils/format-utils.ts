// Format currency
export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US',
  options: Intl.NumberFormatOptions = {}
): string => {
  if (amount === undefined || amount === null) return '';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options
  }).format(amount);
};

// Format number
export const formatNumber = (
  number: number,
  locale: string = 'en-US',
  options: Intl.NumberFormatOptions = {}
): string => {
  if (number === undefined || number === null) return '';
  
  return new Intl.NumberFormat(locale, options).format(number);
};

// Format percentage
export const formatPercentage = (
  value: number,
  locale: string = 'en-US',
  options: Intl.NumberFormatOptions = {}
): string => {
  if (value === undefined || value === null) return '';
  
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
    ...options
  }).format(value / 100);
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

// Format phone number
export const formatPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return '';
  
  // Remove all non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  // If not a standard format, return with minimal formatting
  return phoneNumber;
};

// Format name
export const formatName = (
  firstName: string,
  lastName: string,
  format: 'full' | 'initial' | 'last-first' = 'full'
): string => {
  if (!firstName && !lastName) return '';
  
  switch (format) {
    case 'full':
      return `${firstName} ${lastName}`.trim();
    case 'initial':
      return `${firstName.charAt(0)}. ${lastName}`.trim();
    case 'last-first':
      return `${lastName}, ${firstName}`.trim();
    default:
      return `${firstName} ${lastName}`.trim();
  }
};

// Format address
export const formatAddress = (
  address: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  },
  format: 'single-line' | 'multi-line' = 'single-line'
): string => {
  if (!address) return '';
  
  const { street, city, state, zipCode, country } = address;
  const parts = [
    street,
    city && state ? `${city}, ${state}` : city || state,
    zipCode,
    country
  ].filter(Boolean);
  
  if (format === 'single-line') {
    return parts.join(', ');
  } else {
    return parts.join('\n');
  }
};

// Truncate text
export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return `${text.slice(0, maxLength)}...`;
};

// Convert camelCase to Title Case
export const camelCaseToTitleCase = (text: string): string => {
  if (!text) return '';
  
  // Add space before capital letters and uppercase the first character
  const result = text
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
  
  return result;
};

// Convert snake_case to Title Case
export const snakeCaseToTitleCase = (text: string): string => {
  if (!text) return '';
  
  // Replace underscores with spaces and uppercase the first letter of each word
  return text
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default {
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatFileSize,
  formatPhoneNumber,
  formatName,
  formatAddress,
  truncateText,
  camelCaseToTitleCase,
  snakeCaseToTitleCase
};