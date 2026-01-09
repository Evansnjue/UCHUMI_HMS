/**
 * Auth API Service
 * Handles all authentication-related API calls
 * No direct HTTP calls in components - everything goes through this service
 */

import axios, { AxiosInstance } from 'axios';
import {
  LoginRequestDto,
  LoginResponseDto,
  RefreshTokenRequestDto,
  RefreshTokenResponseDto,
  UpdateProfileRequestDto,
  UpdateProfileResponseDto,
  ChangePasswordRequestDto,
  ResetPasswordRequestDto,
  ResetPasswordResponseDto,
  ConfirmResetPasswordRequestDto,
  ConfirmResetPasswordResponseDto,
  UserDto,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const AUTH_ENDPOINT = '/auth';

class AuthService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_BASE_URL}${AUTH_ENDPOINT}`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to attach token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized - attempt token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = this.getRefreshToken();
            if (refreshToken) {
              const response = await this.refreshToken({ refreshToken });
              this.setAccessToken(response.accessToken);

              originalRequest.headers.Authorization = `Bearer ${response.accessToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            this.logout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Login with email and password
   */
  async login(credentials: LoginRequestDto): Promise<LoginResponseDto> {
    const response = await this.client.post<LoginResponseDto>('/login', credentials);
    
    if (response.data) {
      this.setAccessToken(response.data.accessToken);
      if (response.data.refreshToken) {
        this.setRefreshToken(response.data.refreshToken);
      }
    }

    return response.data;
  }

  /**
   * Logout - clear tokens
   */
  logout(): void {
    this.clearTokens();
    localStorage.removeItem('user');
    localStorage.removeItem('sessionExpiresAt');
  }

  /**
   * Refresh access token
   */
  async refreshToken(
    request: RefreshTokenRequestDto
  ): Promise<RefreshTokenResponseDto> {
    const response = await this.client.post<RefreshTokenResponseDto>(
      '/refresh-token',
      request
    );
    return response.data;
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<UserDto> {
    const response = await this.client.get<UserDto>('/profile');
    return response.data;
  }

  /**
   * Update user profile
   */
  async updateProfile(
    data: UpdateProfileRequestDto
  ): Promise<UpdateProfileResponseDto> {
    const response = await this.client.patch<UpdateProfileResponseDto>(
      '/profile',
      data
    );
    return response.data;
  }

  /**
   * Change password (requires old password)
   */
  async changePassword(data: ChangePasswordRequestDto): Promise<void> {
    await this.client.post('/change-password', data);
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(
    data: ResetPasswordRequestDto
  ): Promise<ResetPasswordResponseDto> {
    const response = await this.client.post<ResetPasswordResponseDto>(
      '/reset-password',
      data
    );
    return response.data;
  }

  /**
   * Confirm password reset with token
   */
  async confirmPasswordReset(
    data: ConfirmResetPasswordRequestDto
  ): Promise<ConfirmResetPasswordResponseDto> {
    const response = await this.client.post<ConfirmResetPasswordResponseDto>(
      '/confirm-reset-password',
      data
    );
    return response.data;
  }

  /**
   * Verify reset token is valid
   */
  async verifyResetToken(token: string): Promise<{ valid: boolean }> {
    const response = await this.client.get<{ valid: boolean }>(
      `/verify-reset-token/${token}`
    );
    return response.data;
  }

  /**
   * Token Management
   */
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  setAccessToken(token: string): void {
    localStorage.setItem('accessToken', token);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  setRefreshToken(token: string): void {
    localStorage.setItem('refreshToken', token);
  }

  clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  /**
   * Get axios instance for advanced usage
   */
  getClient(): AxiosInstance {
    return this.client;
  }
}

export const authService = new AuthService();
export default authService;
