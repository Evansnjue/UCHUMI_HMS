/**
 * Login Mutations Hook
 * React Query hooks for login/logout operations
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services';
import {
  LoginRequestDto,
  ChangePasswordRequestDto,
  ResetPasswordRequestDto,
  ConfirmResetPasswordRequestDto,
  UpdateProfileRequestDto,
} from '../types';

const AUTH_QUERY_KEYS = {
  profile: ['auth', 'profile'],
  login: ['auth', 'login'],
  logout: ['auth', 'logout'],
};

/**
 * useLogin - Login mutation
 */
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginRequestDto) => authService.login(credentials),
    onSuccess: (data) => {
      // Store user in cache
      queryClient.setQueryData(AUTH_QUERY_KEYS.profile, data.user);
    },
    onError: (error: any) => {
      console.error('Login failed:', error.response?.data || error.message);
    },
  });
};

/**
 * useLogoutMutation - Logout mutation
 */
export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      authService.logout();
    },
    onSuccess: () => {
      // Clear all cache
      queryClient.clear();
    },
  });
};

/**
 * useChangePassword - Change password mutation
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordRequestDto) =>
      authService.changePassword(data),
    onError: (error: any) => {
      console.error(
        'Change password failed:',
        error.response?.data || error.message
      );
    },
  });
};

/**
 * useResetPasswordRequest - Request password reset mutation
 */
export const useResetPasswordRequest = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordRequestDto) =>
      authService.requestPasswordReset(data),
    onError: (error: any) => {
      console.error(
        'Password reset request failed:',
        error.response?.data || error.message
      );
    },
  });
};

/**
 * useConfirmPasswordReset - Confirm password reset mutation
 */
export const useConfirmPasswordReset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ConfirmResetPasswordRequestDto) =>
      authService.confirmPasswordReset(data),
    onSuccess: (data) => {
      // Update user profile
      queryClient.setQueryData(AUTH_QUERY_KEYS.profile, data.user);
    },
    onError: (error: any) => {
      console.error(
        'Confirm password reset failed:',
        error.response?.data || error.message
      );
    },
  });
};

/**
 * useUpdateProfile - Update profile mutation
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequestDto) =>
      authService.updateProfile(data),
    onSuccess: (data) => {
      // Update cached user profile
      queryClient.setQueryData(AUTH_QUERY_KEYS.profile, data);
      localStorage.setItem('user', JSON.stringify(data));
    },
    onError: (error: any) => {
      console.error(
        'Update profile failed:',
        error.response?.data || error.message
      );
    },
  });
};
