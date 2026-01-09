/**
 * Mock Data for Auth Module
 * Used for development and testing
 */

import { UserDto, RoleDto, PermissionDto, UserStatus } from '../types';

// Mock Roles
export const mockRoles: RoleDto[] = [
  {
    id: 'role-admin',
    name: 'Administrator',
    code: 'ADMIN',
    description: 'Full system access',
    permissions: [],
  },
  {
    id: 'role-pharmacist',
    name: 'Pharmacist',
    code: 'PHARMACIST',
    description: 'Pharmacy operations',
    permissions: [],
  },
  {
    id: 'role-doctor',
    name: 'Doctor',
    code: 'DOCTOR',
    description: 'Clinical records and prescriptions',
    permissions: [],
  },
  {
    id: 'role-user',
    name: 'User',
    code: 'USER',
    description: 'Basic user access',
    permissions: [],
  },
];

// Mock Permissions
export const mockPermissions: PermissionDto[] = [
  {
    id: 'perm-auth-read',
    name: 'Read Auth',
    code: 'auth:read',
    resource: 'auth',
    action: 'read',
  },
  {
    id: 'perm-auth-write',
    name: 'Write Auth',
    code: 'auth:write',
    resource: 'auth',
    action: 'write',
  },
  {
    id: 'perm-user-read',
    name: 'Read Users',
    code: 'user:read',
    resource: 'user',
    action: 'read',
  },
  {
    id: 'perm-user-write',
    name: 'Write Users',
    code: 'user:write',
    resource: 'user',
    action: 'write',
  },
];

// Mock Users
export const mockAdmin: UserDto = {
  id: 'user-001',
  email: 'admin@hospital.com',
  firstName: 'Admin',
  lastName: 'User',
  fullName: 'Admin User',
  avatar: 'https://via.placeholder.com/150?text=AU',
  status: UserStatus.ACTIVE,
  roles: [mockRoles[0]], // Admin role
  permissions: mockPermissions,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-09T00:00:00Z',
  lastLoginAt: '2024-01-09T10:30:00Z',
};

export const mockPharmacist: UserDto = {
  id: 'user-002',
  email: 'pharmacist@hospital.com',
  firstName: 'John',
  lastName: 'Pharmacist',
  fullName: 'John Pharmacist',
  avatar: 'https://via.placeholder.com/150?text=JP',
  status: UserStatus.ACTIVE,
  roles: [mockRoles[1]], // Pharmacist role
  permissions: [mockPermissions[0], mockPermissions[2]], // Read permissions
  createdAt: '2024-01-02T00:00:00Z',
  updatedAt: '2024-01-09T00:00:00Z',
  lastLoginAt: '2024-01-09T09:15:00Z',
};

export const mockDoctor: UserDto = {
  id: 'user-003',
  email: 'doctor@hospital.com',
  firstName: 'Jane',
  lastName: 'Doctor',
  fullName: 'Jane Doctor',
  avatar: 'https://via.placeholder.com/150?text=JD',
  status: UserStatus.ACTIVE,
  roles: [mockRoles[2]], // Doctor role
  permissions: [mockPermissions[0], mockPermissions[2]], // Read permissions
  createdAt: '2024-01-03T00:00:00Z',
  updatedAt: '2024-01-09T00:00:00Z',
  lastLoginAt: '2024-01-09T08:45:00Z',
};

export const mockUsers = [mockAdmin, mockPharmacist, mockDoctor];

/**
 * Generate mock login response
 */
export const generateMockLoginResponse = (user: UserDto) => {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + 3600; // 1 hour

  const accessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIke3VzZXIuaWR9IiwiZW1haWwiOiIke3VzZXIuZW1haWx9Iiwicm9sZXMiOlske3VzZXIucm9sZXMubWFwKHIgPT4gci5jb2RlKS5qb2luKCcsJyl9XSwiaWF0Ijoke25vd30sImV4cCI6JHtleHB9fQ.mock`;

  return {
    accessToken,
    refreshToken: 'mock-refresh-token',
    expiresIn: 3600,
    user,
  };
};

/**
 * Mock credentials for testing
 */
export const mockCredentials = [
  {
    email: 'admin@hospital.com',
    password: 'admin123',
    user: mockAdmin,
  },
  {
    email: 'pharmacist@hospital.com',
    password: 'pharm123',
    user: mockPharmacist,
  },
  {
    email: 'doctor@hospital.com',
    password: 'doctor123',
    user: mockDoctor,
  },
];
