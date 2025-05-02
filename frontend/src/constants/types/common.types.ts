/**
 * Common types used throughout the application
 */

// Pagination parameters for API requests
export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
}

// Pagination metadata in API responses
export interface PaginationMeta {
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

// Generic paginated response from API
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
}

// Generic API response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Route type for application routing
export interface RouteType {
  path: string;
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  protected?: boolean;
  userType?: 'admin' | 'teacher' | 'student';
  requiresVerification?: boolean;
  layout?: 'auth' | 'app' | 'minimal';
}
