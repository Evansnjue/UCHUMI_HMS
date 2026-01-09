/**
 * RBAC React Components
 * Components for conditionally rendering based on user role
 */

import React from 'react';
import type { UserRole } from '../types';
import { canViewPrescriptions, canDispenseMedication, canViewAuditLogs, hasPermission } from './rbac';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
  userRole: UserRole;
}

/**
 * Generic role guard component
 * Renders children only if user's role is in allowedRoles
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  fallback = null,
  userRole,
}) => {
  if (allowedRoles.includes(userRole)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

interface PermissionGuardProps {
  children: React.ReactNode;
  permission: string;
  fallback?: React.ReactNode;
  userRole: UserRole;
}

/**
 * Permission-based guard component
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  permission,
  fallback = null,
  userRole,
}) => {
  if (hasPermission(userRole, permission)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

interface PermissionGate {
  condition: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Conditional rendering based on boolean condition
 * Useful for combining multiple RBAC rules
 */
export const PermissionGate: React.FC<PermissionGate> = ({
  condition,
  children,
  fallback = null,
}) => {
  if (condition) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

interface DisabledIfBlockedProps {
  children: React.ReactElement;
  isBlocked: boolean;
  blockedReason?: string;
}

/**
 * Disable button/element with tooltip if condition is met
 */
export const DisabledIfBlocked: React.FC<DisabledIfBlockedProps> = ({
  children,
  isBlocked,
  blockedReason = 'Action not permitted',
}) => {
  return React.cloneElement(children, {
    disabled: isBlocked,
    title: isBlocked ? blockedReason : children.props.title,
    className: `${children.props.className || ''} ${
      isBlocked ? 'opacity-50 cursor-not-allowed' : ''
    }`,
  } as any);
};

// ============================================================================
// SPECIALIZED GUARD COMPONENTS
// ============================================================================

interface PrescriptionViewGuardProps {
  children: React.ReactNode;
  userRole: UserRole;
  fallback?: React.ReactNode;
}

/**
 * Guard for prescription viewing permissions
 */
export const PrescriptionViewGuard: React.FC<PrescriptionViewGuardProps> = ({
  children,
  userRole,
  fallback = null,
}) => {
  if (canViewPrescriptions(userRole)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

interface DispensingGuardProps {
  children: React.ReactNode;
  userRole: UserRole;
  fallback?: React.ReactNode;
}

/**
 * Guard for dispensing action permissions
 */
export const DispensingGuard: React.FC<DispensingGuardProps> = ({
  children,
  userRole,
  fallback = null,
}) => {
  if (canDispenseMedication(userRole)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

interface AuditViewGuardProps {
  children: React.ReactNode;
  userRole: UserRole;
  fallback?: React.ReactNode;
}

/**
 * Guard for audit log viewing
 */
export const AuditViewGuard: React.FC<AuditViewGuardProps> = ({
  children,
  userRole,
  fallback = null,
}) => {
  if (canViewAuditLogs(userRole)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};
