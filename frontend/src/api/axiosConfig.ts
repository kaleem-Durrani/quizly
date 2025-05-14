import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig
} from 'axios';
import { AUTH_ENDPOINTS } from '../constants/api';
import { handleApiError } from '../utils/errors';

// Extend the InternalAxiosRequestConfig interface to include _retry property
declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

/**
 * Create a custom Axios instance with default configuration
 */
const api: AxiosInstance = axios.create({
  baseURL: '/api',
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor
 * Runs before each request is sent
 * Can be used to modify requests or add headers
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // You can modify the request config here if needed
    // For example, add a timestamp to prevent caching
    if (config.method?.toLowerCase() === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * Runs after each response is received
 * Handles token refresh on 401 errors
 */
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  async (error: AxiosError): Promise<any> => {
    const originalRequest = error.config as InternalAxiosRequestConfig;

    // If error is 401 (Unauthorized) and we haven't tried to refresh the token yet
    // Only attempt refresh for non-login/register routes
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/login') &&
      !originalRequest.url?.includes('/register')
    ) {
      // Only attempt refresh if we have a user role stored (meaning we were logged in)
      const userRole = localStorage.getItem('userRole');
      if (!userRole) {
        return Promise.reject(handleApiError(error));
      }

      originalRequest._retry = true;

      try {
        // Determine the refresh endpoint based on the stored user role
        let refreshEndpoint = AUTH_ENDPOINTS.STUDENT_REFRESH;

        if (userRole === 'admin') {
          refreshEndpoint = AUTH_ENDPOINTS.ADMIN_REFRESH;
        } else if (userRole === 'teacher') {
          refreshEndpoint = AUTH_ENDPOINTS.TEACHER_REFRESH;
        }

        // Call refresh token endpoint
        await axios.post(refreshEndpoint, {}, { withCredentials: true });

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh token is invalid, clear user role but don't redirect
        // Let the auth context handle the redirect
        localStorage.removeItem('userRole');
        return Promise.reject(handleApiError(refreshError));
      }
    }

    // Convert the error to a custom error type
    return Promise.reject(handleApiError(error));
  }
);

export default api;

/*
USAGE EXAMPLES:

1. Basic GET request:
   const response = await api.get('/endpoint');

2. POST request with data:
   const response = await api.post('/endpoint', { key: 'value' });

3. PUT request with data:
   const response = await api.put('/endpoint/123', { key: 'value' });

4. DELETE request:
   const response = await api.delete('/endpoint/123');

5. Request with query parameters:
   const response = await api.get('/endpoint', { params: { page: 1, limit: 10 } });
*/
