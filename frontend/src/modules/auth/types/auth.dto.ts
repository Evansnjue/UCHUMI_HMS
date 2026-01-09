/**
 * Auth Module Type Definitions (DTOs)
 * These types represent the contracts with the backend API
 */

// ============================================================================
// Authentication & Login
// ============================================================================

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number; // in seconds
  user: UserDto;
}

export interface RefreshTokenRequestDto {
  refreshToken: string;
}

export interface RefreshTokenResponseDto {
  accessToken: string;
  expiresIn: number;
}

// ============================================================================
// User & Profile
// ============================================================================

export interface UserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatar?: string;
  status: UserStatus;
  roles: RoleDto[];
  permissions: PermissionDto[];
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface UpdateProfileRequestDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
}

export interface UpdateProfileResponseDto extends UserDto {}

// ============================================================================
// Password Management
// ============================================================================

export interface ChangePasswordRequestDto {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordRequestDto {
  email: string;
}

export interface ResetPasswordResponseDto {
  message: string;
  resetToken?: string; // For frontend-driven reset flow
}

export interface ConfirmResetPasswordRequestDto {
  resetToken: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ConfirmResetPasswordResponseDto {
  message: string;
  user: UserDto;
}

// ============================================================================
// Roles & Permissions
// ============================================================================

export interface RoleDto {
  id: string;
  name: string;
  code: string; // e.g., 'ADMIN', 'PHARMACIST', 'DOCTOR'
  description: string;
  permissions: PermissionDto[];
}

export interface PermissionDto {
  id: string;
  name: string;
  code: string; // e.g., 'auth:read', 'auth:write'
  resource: string;
  action: string;
}

// ============================================================================
// Enums
// ============================================================================

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING',
}

// ============================================================================
// Session & Token
// ============================================================================

export interface SessionDto {
  id: string;
  userId: string;
  token: string;
  refreshToken?: string;
  expiresAt: string;
  createdAt: string;
  ipAddress?: string;
  userAgent?: string;
  isActive: boolean;
}

export interface DecodedTokenDto {
  sub: string;
  email: string;
  roles: string[];
  iat: number;
  exp: number;
}
