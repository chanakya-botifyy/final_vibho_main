import { AxiosError } from 'axios';

// Error types
export enum ErrorType {
  NETWORK = 'network',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  VALIDATION = 'validation',
  SERVER = 'server',
  NOT_FOUND = 'not_found',
  UNKNOWN = 'unknown'
}

// Error interface
export interface AppError {
  type: ErrorType;
  message: string;
  details?: any;
  statusCode?: number;
}

// Parse axios error
export const parseApiError = (error: any): AppError => {
  if (error.isAxiosError) {
    const axiosError = error as AxiosError<any>;
    
    // Network error
    if (!axiosError.response) {
      return {
        type: ErrorType.NETWORK,
        message: 'Unable to connect to the server. Please check your internet connection.',
        details: axiosError.message
      };
    }
    
    // Server responded with an error
    const statusCode = axiosError.response.status;
    const responseData = axiosError.response.data;
    
    switch (statusCode) {
      case 400:
        return {
          type: ErrorType.VALIDATION,
          message: responseData.message || 'Invalid request data',
          details: responseData.errors || responseData,
          statusCode
        };
      case 401:
        return {
          type: ErrorType.AUTHENTICATION,
          message: 'Authentication required. Please log in again.',
          statusCode
        };
      case 403:
        return {
          type: ErrorType.AUTHORIZATION,
          message: 'You do not have permission to perform this action.',
          statusCode
        };
      case 404:
        return {
          type: ErrorType.NOT_FOUND,
          message: responseData.message || 'Resource not found',
          statusCode
        };
      case 500:
      case 502:
      case 503:
      case 504:
        return {
          type: ErrorType.SERVER,
          message: 'Server error. Please try again later.',
          details: responseData,
          statusCode
        };
      default:
        return {
          type: ErrorType.UNKNOWN,
          message: responseData.message || 'An unexpected error occurred',
          details: responseData,
          statusCode
        };
    }
  }
  
  // Non-axios error
  return {
    type: ErrorType.UNKNOWN,
    message: error.message || 'An unexpected error occurred',
    details: error
  };
};

// Log error to monitoring service (e.g., Sentry)
export const logError = (error: AppError): void => {
  // In production, this would send to a monitoring service
  console.error('Error logged:', error);
  
  // Example Sentry integration:
  // if (import.meta.env.PROD) {
  //   Sentry.captureException(error);
  // }
};

// Format validation errors for display
export const formatValidationErrors = (errors: any): string[] => {
  if (!errors) return [];
  
  if (Array.isArray(errors)) {
    return errors.map(err => err.message || String(err));
  }
  
  if (typeof errors === 'object') {
    return Object.values(errors).map(err => String(err));
  }
  
  return [String(errors)];
};