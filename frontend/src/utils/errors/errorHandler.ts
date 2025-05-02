import axios, { AxiosError } from 'axios';
import { message } from 'antd';
import { 
  ApiError, 
  ValidationError, 
  AuthenticationError, 
  AuthorizationError, 
  NotFoundError, 
  ServerError, 
  NetworkError,
  TimeoutError
} from './ApiError';

/**
 * Handle API errors
 * Converts Axios errors to custom error types
 * 
 * @param error The error to handle
 * @returns A custom error object
 */
export const handleApiError = (error: unknown): ApiError => {
  // If it's already a custom error, return it
  if (error instanceof ApiError) {
    return error;
  }
  
  // Handle Axios errors
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;
    
    // Handle network errors
    if (!axiosError.response) {
      return new NetworkError();
    }
    
    const { status, data } = axiosError.response;
    const errorMessage = data?.message || axiosError.message || 'An error occurred';
    const errors = data?.errors;
    
    // Handle different status codes
    switch (status) {
      case 400:
        return new ValidationError(errorMessage, errors);
      case 401:
        return new AuthenticationError(errorMessage);
      case 403:
        return new AuthorizationError(errorMessage);
      case 404:
        return new NotFoundError(errorMessage);
      case 408:
        return new TimeoutError(errorMessage);
      case 500:
      case 502:
      case 503:
      case 504:
        return new ServerError(errorMessage);
      default:
        return new ApiError(errorMessage, status, errors);
    }
  }
  
  // Handle other errors
  if (error instanceof Error) {
    return new ApiError(error.message);
  }
  
  // Handle unknown errors
  return new ApiError('An unknown error occurred');
};

/**
 * Display error message to the user
 * Uses Ant Design's message component
 * 
 * @param error The error to display
 */
export const displayError = (error: unknown): void => {
  const apiError = handleApiError(error);
  
  // Display different messages based on error type
  switch (apiError.name) {
    case 'ValidationError':
      // For validation errors, show the first error message
      if (apiError.errors) {
        const firstErrorField = Object.keys(apiError.errors)[0];
        const firstErrorMessage = apiError.errors[firstErrorField][0];
        message.error(`${firstErrorField}: ${firstErrorMessage}`);
      } else {
        message.error(apiError.message);
      }
      break;
    case 'AuthenticationError':
      message.error('Please log in to continue');
      break;
    case 'NetworkError':
      message.error('Network error. Please check your connection and try again.');
      break;
    default:
      message.error(apiError.message);
  }
};

/**
 * Get form errors from API error
 * Formats API validation errors for Ant Design forms
 * 
 * @param error The API error
 * @returns An object with field names as keys and error messages as values
 */
export const getFormErrors = (error: unknown): Record<string, string[]> => {
  const apiError = handleApiError(error);
  
  if (apiError instanceof ValidationError && apiError.errors) {
    return apiError.errors;
  }
  
  return {};
};
