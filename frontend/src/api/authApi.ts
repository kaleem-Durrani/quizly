import api from './axiosConfig';
import { 
  AUTH_ENDPOINTS, 
  LoginRequest, 
  RegisterStudentRequest, 
  AuthResponse, 
  AuthStatusResponse 
} from '../constants';

/**
 * Authentication API functions
 * These functions handle all authentication-related API calls
 */

/**
 * Check authentication status
 * @returns Promise with authentication status and user data
 */
export const checkAuthStatus = async (): Promise<AuthStatusResponse> => {
  try {
    // Try the regular status endpoint first
    const response = await api.get<AuthStatusResponse>(AUTH_ENDPOINTS.STATUS);
    return response.data;
  } catch (error) {
    // If that fails, try the admin status endpoint
    try {
      const adminResponse = await api.get<AuthStatusResponse>(AUTH_ENDPOINTS.ADMIN_STATUS);
      return adminResponse.data;
    } catch (adminError) {
      // If both fail, return not authenticated
      return {
        success: false,
        isAuthenticated: false,
        message: 'Not authenticated',
      };
    }
  }
};

/**
 * Login user (student, teacher, or admin)
 * @param credentials Login credentials
 * @returns Promise with user data
 */
export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  let endpoint = AUTH_ENDPOINTS.STUDENT_LOGIN;
  
  if (credentials.role === 'admin') {
    endpoint = AUTH_ENDPOINTS.ADMIN_LOGIN;
  } else if (credentials.role === 'teacher') {
    endpoint = AUTH_ENDPOINTS.TEACHER_LOGIN;
  }
  
  const response = await api.post<AuthResponse>(endpoint, credentials);
  return response.data;
};

/**
 * Register a new student
 * @param data Student registration data
 * @returns Promise with user data
 */
export const registerStudent = async (data: RegisterStudentRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(AUTH_ENDPOINTS.STUDENT_REGISTER, data);
  return response.data;
};

/**
 * Logout user (student, teacher, or admin)
 * @param role User role
 * @returns Promise with success message
 */
export const logout = async (role: string): Promise<{ success: boolean; message: string }> => {
  let endpoint = AUTH_ENDPOINTS.STUDENT_LOGOUT;
  
  if (role === 'admin') {
    endpoint = AUTH_ENDPOINTS.ADMIN_LOGOUT;
  } else if (role === 'teacher') {
    endpoint = AUTH_ENDPOINTS.TEACHER_LOGOUT;
  }
  
  const response = await api.post<{ success: boolean; message: string }>(endpoint);
  return response.data;
};

/**
 * Verify student email with OTP
 * @param email Student email
 * @param otp One-time password
 * @returns Promise with success message
 */
export const verifyEmail = async (email: string, otp: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.post<{ success: boolean; message: string }>(
    AUTH_ENDPOINTS.STUDENT_VERIFY_EMAIL,
    { email, otp }
  );
  return response.data;
};

/**
 * Resend verification OTP
 * @param email Student email
 * @returns Promise with success message
 */
export const resendOTP = async (email: string): Promise<{ success: boolean; message: string; data?: { otp?: string } }> => {
  const response = await api.post<{ success: boolean; message: string; data?: { otp?: string } }>(
    AUTH_ENDPOINTS.STUDENT_RESEND_OTP,
    { email }
  );
  return response.data;
};

/**
 * Request password reset
 * @param email User email
 * @returns Promise with success message
 */
export const forgotPassword = async (email: string): Promise<{ success: boolean; message: string; data?: { otp?: string } }> => {
  const response = await api.post<{ success: boolean; message: string; data?: { otp?: string } }>(
    AUTH_ENDPOINTS.STUDENT_FORGOT_PASSWORD,
    { email }
  );
  return response.data;
};

/**
 * Reset password with OTP
 * @param email User email
 * @param otp One-time password
 * @param newPassword New password
 * @returns Promise with success message
 */
export const resetPassword = async (email: string, otp: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.post<{ success: boolean; message: string }>(
    AUTH_ENDPOINTS.STUDENT_RESET_PASSWORD,
    { email, otp, newPassword }
  );
  return response.data;
};

/**
 * Change teacher password (first login or regular change)
 * @param currentPassword Current password
 * @param newPassword New password
 * @returns Promise with success message
 */
export const changeTeacherPassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.post<{ success: boolean; message: string }>(
    AUTH_ENDPOINTS.TEACHER_CHANGE_PASSWORD,
    { currentPassword, newPassword }
  );
  return response.data;
};
