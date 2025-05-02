/**
 * Base API Error class
 * Extends the native Error class with additional properties for API errors
 */
export class ApiError extends Error {
  statusCode: number;
  errors?: Record<string, string[]>;
  
  constructor(message: string, statusCode: number = 500, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
    
    // This is necessary for extending built-in classes in TypeScript
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * Validation Error
 * Used for 400 Bad Request errors with validation failures
 */
export class ValidationError extends ApiError {
  constructor(message: string, errors?: Record<string, string[]>) {
    super(message, 400, errors);
    this.name = 'ValidationError';
    
    // This is necessary for extending built-in classes in TypeScript
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Authentication Error
 * Used for 401 Unauthorized errors
 */
export class AuthenticationError extends ApiError {
  constructor(message: string = 'Authentication required') {
    super(message, 401);
    this.name = 'AuthenticationError';
    
    // This is necessary for extending built-in classes in TypeScript
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

/**
 * Authorization Error
 * Used for 403 Forbidden errors
 */
export class AuthorizationError extends ApiError {
  constructor(message: string = 'You do not have permission to perform this action') {
    super(message, 403);
    this.name = 'AuthorizationError';
    
    // This is necessary for extending built-in classes in TypeScript
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

/**
 * Not Found Error
 * Used for 404 Not Found errors
 */
export class NotFoundError extends ApiError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
    this.name = 'NotFoundError';
    
    // This is necessary for extending built-in classes in TypeScript
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * Server Error
 * Used for 500 Internal Server Error and other server-side errors
 */
export class ServerError extends ApiError {
  constructor(message: string = 'An unexpected error occurred on the server') {
    super(message, 500);
    this.name = 'ServerError';
    
    // This is necessary for extending built-in classes in TypeScript
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}

/**
 * Network Error
 * Used for network-related errors (e.g., no internet connection)
 */
export class NetworkError extends ApiError {
  constructor(message: string = 'Network error. Please check your connection.') {
    super(message, 0); // Status code 0 indicates a network error
    this.name = 'NetworkError';
    
    // This is necessary for extending built-in classes in TypeScript
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

/**
 * Timeout Error
 * Used for request timeout errors
 */
export class TimeoutError extends ApiError {
  constructor(message: string = 'Request timed out. Please try again.') {
    super(message, 408);
    this.name = 'TimeoutError';
    
    // This is necessary for extending built-in classes in TypeScript
    Object.setPrototypeOf(this, TimeoutError.prototype);
  }
}
