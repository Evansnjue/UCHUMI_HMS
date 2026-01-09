/**
 * Auth Module Constants
 */

export const AUTH_CONSTANTS = {
  SESSION_TIMEOUT_MS: 15 * 60 * 1000, // 15 minutes
  SESSION_WARNING_TIME_MS: 2 * 60 * 1000, // 2 minutes before timeout

  ROLES: {
    ADMIN: 'ADMIN',
    USER: 'USER',
    DOCTOR: 'DOCTOR',
    PHARMACIST: 'PHARMACIST',
    NURSE: 'NURSE',
    LAB_TECHNICIAN: 'LAB_TECHNICIAN',
    INVENTORY_MANAGER: 'INVENTORY_MANAGER',
  } as const,

  PERMISSIONS: {
    // Auth permissions
    AUTH_READ: 'auth:read',
    AUTH_WRITE: 'auth:write',

    // User management
    USER_READ: 'user:read',
    USER_WRITE: 'user:write',
    USER_DELETE: 'user:delete',

    // Profile
    PROFILE_READ: 'profile:read',
    PROFILE_WRITE: 'profile:write',
  } as const,
};

export type RoleCode = (typeof AUTH_CONSTANTS.ROLES)[keyof typeof AUTH_CONSTANTS.ROLES];
export type PermissionCode =
  (typeof AUTH_CONSTANTS.PERMISSIONS)[keyof typeof AUTH_CONSTANTS.PERMISSIONS];
