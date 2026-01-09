/**
 * Auth Utilities
 */

import { UserDto, DecodedTokenDto } from '../types';

/**
 * Decode JWT token
 * Note: This is for client-side parsing only, not verification
 */
export const decodeToken = (token: string): DecodedTokenDto | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const decoded = JSON.parse(atob(parts[1]));
    return decoded;
  } catch {
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
};

/**
 * Get time until token expiration in milliseconds
 */
export const getTimeUntilExpiration = (token: string): number => {
  const decoded = decodeToken(token);
  if (!decoded) return 0;

  const currentTime = Math.floor(Date.now() / 1000);
  const secondsUntilExpiry = decoded.exp - currentTime;
  return secondsUntilExpiry * 1000;
};

/**
 * Format user full name
 */
export const formatUserName = (user: UserDto): string => {
  return `${user.firstName} ${user.lastName}`.trim();
};

/**
 * Format user initials
 */
export const formatUserInitials = (user: UserDto): string => {
  return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
};

/**
 * Check if user has a specific role
 */
export const hasRole = (user: UserDto, roleCode: string): boolean => {
  return user.roles.some((role) => role.code === roleCode);
};

/**
 * Check if user has any of the given roles
 */
export const hasAnyRole = (user: UserDto, roleCodes: string[]): boolean => {
  return roleCodes.some((code) => user.roles.some((role) => role.code === code));
};

/**
 * Check if user has all of the given roles
 */
export const hasAllRoles = (user: UserDto, roleCodes: string[]): boolean => {
  return roleCodes.every((code) => user.roles.some((role) => role.code === code));
};

/**
 * Check if user has a specific permission
 */
export const hasPermission = (user: UserDto, permissionCode: string): boolean => {
  return user.permissions.some((perm) => perm.code === permissionCode);
};

/**
 * Check if user has any of the given permissions
 */
export const hasAnyPermission = (user: UserDto, permissionCodes: string[]): boolean => {
  return permissionCodes.some((code) =>
    user.permissions.some((perm) => perm.code === code)
  );
};
