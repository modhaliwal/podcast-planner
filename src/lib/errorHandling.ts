
import { toast } from "@/hooks/use-toast";

/**
 * Standard error types for the application
 */
export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTH = 'AUTH',
  VALIDATION = 'VALIDATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Interface for standard error structure
 */
export interface AppError {
  type: ErrorType;
  message: string;
  originalError?: any;
  statusCode?: number;
}

/**
 * Creates a standardized application error
 */
export const createAppError = (
  message: string,
  type: ErrorType = ErrorType.UNKNOWN,
  originalError?: any,
  statusCode?: number
): AppError => {
  return {
    type,
    message,
    originalError,
    statusCode,
  };
};

/**
 * Helper to handle Supabase errors and convert to AppErrors
 */
export const handleSupabaseError = (error: any): AppError => {
  console.error('Supabase error:', error);
  
  // Parse the error code and message
  const errorCode = error?.code;
  const errorMessage = error?.message || 'An unknown error occurred';
  const statusCode = error?.status;
  
  // Determine error type based on code
  let type = ErrorType.UNKNOWN;
  
  if (typeof errorCode === 'string') {
    if (errorCode.startsWith('PGRST')) {
      if (errorCode === 'PGRST116') {
        type = ErrorType.NOT_FOUND;
      } else {
        type = ErrorType.SERVER;
      }
    } else if (errorCode === 'auth/unauthorized' || errorCode.includes('auth')) {
      type = ErrorType.AUTH;
    } else if (statusCode === 404) {
      type = ErrorType.NOT_FOUND;
    } else if (statusCode && statusCode >= 400 && statusCode < 500) {
      type = ErrorType.VALIDATION;
    } else if (statusCode && statusCode >= 500) {
      type = ErrorType.SERVER;
    }
  } else if (error.message?.includes('network')) {
    type = ErrorType.NETWORK;
  }
  
  return createAppError(errorMessage, type, error, statusCode);
};

/**
 * Display an error toast with standardized formatting
 */
export const showErrorToast = (error: AppError | Error | string) => {
  let title = 'Error';
  let description: string;
  
  if (typeof error === 'string') {
    description = error;
  } else if ('type' in error) {
    // It's an AppError
    switch (error.type) {
      case ErrorType.AUTH:
        title = 'Authentication Error';
        break;
      case ErrorType.NETWORK:
        title = 'Network Error';
        break;
      case ErrorType.NOT_FOUND:
        title = 'Not Found';
        break;
      case ErrorType.VALIDATION:
        title = 'Validation Error';
        break;
      case ErrorType.SERVER:
        title = 'Server Error';
        break;
      default:
        title = 'Error';
    }
    description = error.message;
  } else {
    // It's a regular Error
    description = error.message;
  }
  
  toast({
    title,
    description,
    variant: 'destructive',
  });
};
