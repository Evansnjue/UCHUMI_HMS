/**
 * Role-Based Access Control (RBAC) Guards
 * Components and utilities for protecting routes and UI elements
 */

import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useHasRole, useHasAnyRole, useHasAllRoles, useHasPermission } from '../hooks';
import { useAuthUser } from '../hooks';

interface RoleGuardProps {
  children: ReactNode;
  requiredRole: string;
  fallback?: ReactNode;
  redirectTo?: string;
}

/**
 * RoleGuard - Protect routes by requiring a specific role
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  requiredRole,
  fallback = null,
  redirectTo = '/auth/unauthorized',
}) => {
  const hasRole = useHasRole(requiredRole);

  if (!hasRole) {
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }
    return fallback;
  }

  return <>{children}</>;
};

interface AnyRoleGuardProps {
  children: ReactNode;
  requiredRoles: string[];
  fallback?: ReactNode;
  redirectTo?: string;
}

/**
 * AnyRoleGuard - Protect routes by requiring any of the specified roles
 */
export const AnyRoleGuard: React.FC<AnyRoleGuardProps> = ({
  children,
  requiredRoles,
  fallback = null,
  redirectTo = '/auth/unauthorized',
}) => {
  const hasAnyRole = useHasAnyRole(requiredRoles);

  if (!hasAnyRole) {
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }
    return fallback;
  }

  return <>{children}</>;
};

interface AllRolesGuardProps {
  children: ReactNode;
  requiredRoles: string[];
  fallback?: ReactNode;
  redirectTo?: string;
}

/**
 * AllRolesGuard - Protect routes by requiring all of the specified roles
 */
export const AllRolesGuard: React.FC<AllRolesGuardProps> = ({
  children,
  requiredRoles,
  fallback = null,
  redirectTo = '/auth/unauthorized',
}) => {
  const hasAllRoles = useHasAllRoles(requiredRoles);

  if (!hasAllRoles) {
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }
    return fallback;
  }

  return <>{children}</>;
};

interface PermissionGuardProps {
  children: ReactNode;
  requiredPermission: string;
  fallback?: ReactNode;
  redirectTo?: string;
}

/**
 * PermissionGuard - Protect routes by requiring a specific permission
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  requiredPermission,
  fallback = null,
  redirectTo = '/auth/unauthorized',
}) => {
  const hasPermission = useHasPermission(requiredPermission);

  if (!hasPermission) {
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }
    return fallback;
  }

  return <>{children}</>;
};

interface ConditionalRenderProps {
  children: ReactNode;
  requiredRole?: string;
  requiredRoles?: string[];
  requireAll?: boolean;
  fallback?: ReactNode;
}

/**
 * ConditionalRender - Render children based on role, or fallback
 * Useful for showing/hiding UI elements based on RBAC
 */
export const ConditionalRender: React.FC<ConditionalRenderProps> = ({
  children,
  requiredRole,
  requiredRoles = [],
  requireAll = false,
  fallback = null,
}) => {
  const user = useAuthUser();

  if (!user) {
    return fallback;
  }

  let hasAccess = false;

  if (requiredRole) {
    hasAccess = user.roles.some((role) => role.code === requiredRole);
  } else if (requiredRoles.length > 0) {
    if (requireAll) {
      hasAccess = requiredRoles.every((code) =>
        user.roles.some((role) => role.code === code)
      );
    } else {
      hasAccess = requiredRoles.some((code) =>
        user.roles.some((role) => role.code === code)
      );
    }
  } else {
    hasAccess = true;
  }

  return hasAccess ? <>{children}</> : fallback;
};
