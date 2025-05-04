import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  checkAuthStatus,
  login as loginApi,
  logout as logoutApi,
  registerStudent as registerStudentApi,
  verifyEmail as verifyEmailApi,
  resendOTP as resendOTPApi,
  forgotPassword as forgotPasswordApi,
  resetPassword as resetPasswordApi,
  changeTeacherPassword as changeTeacherPasswordApi
} from '../api/authApi';
import { LoginRequest, RegisterStudentRequest, UserRole } from '../constants/types';

/**
 * Custom hook for authentication-related queries and mutations
 * Uses React Query for caching and state management
 */
export const useAuthQuery = () => {
  const queryClient = useQueryClient();

  /**
   * Query to check authentication status
   */
  const authStatusQuery = useQuery({
    queryKey: ['authStatus'],
    queryFn: checkAuthStatus,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  /**
   * Mutation for login
   */
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => loginApi(credentials),
    onSuccess: () => {
      // Invalidate auth status query to refetch user data
      queryClient.invalidateQueries({ queryKey: ['authStatus'] });
    },
  });

  /**
   * Mutation for logout
   */
  const logoutMutation = useMutation({
    mutationFn: (role: UserRole) => logoutApi(role),
    onSuccess: () => {
      // Clear user data from cache
      queryClient.setQueryData(['authStatus'], {
        success: false,
        isAuthenticated: false
      });

      // Invalidate all queries to force refetch when needed
      queryClient.invalidateQueries();
    },
  });

  /**
   * Mutation for email verification
   */
  const verifyEmailMutation = useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      verifyEmailApi(email, otp),
    onSuccess: () => {
      // Invalidate auth status to update verification status
      queryClient.invalidateQueries({ queryKey: ['authStatus'] });
    },
  });

  /**
   * Mutation for resending OTP
   */
  const resendOTPMutation = useMutation({
    mutationFn: (email: string) => resendOTPApi(email),
  });

  /**
   * Mutation for forgot password
   */
  const forgotPasswordMutation = useMutation({
    mutationFn: (email: string) => forgotPasswordApi(email),
  });

  /**
   * Mutation for reset password
   */
  const resetPasswordMutation = useMutation({
    mutationFn: ({ email, otp, newPassword }: {
      email: string;
      otp: string;
      newPassword: string
    }) => resetPasswordApi(email, otp, newPassword),
  });

  /**
   * Mutation for student registration
   */
  const registerMutation = useMutation({
    mutationFn: (registrationData: RegisterStudentRequest) => registerStudentApi(registrationData),
  });

  /**
   * Mutation for changing teacher password
   */
  const changePasswordMutation = useMutation({
    mutationFn: ({ currentPassword, newPassword }: {
      currentPassword: string;
      newPassword: string
    }) => changeTeacherPasswordApi(currentPassword, newPassword),
  });

  return {
    // Queries
    authStatusQuery,

    // Mutations
    loginMutation,
    logoutMutation,
    registerMutation,
    verifyEmailMutation,
    resendOTPMutation,
    forgotPasswordMutation,
    resetPasswordMutation,
    changePasswordMutation,
  };
};

export default useAuthQuery;
