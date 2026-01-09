// File: frontend/src/modules/hr/rbac/hrAuth.tsx
import React from 'react';

type UserPayload = {
  sub: string;
  name?: string;
  roles?: string[];
  iat?: number;
  exp?: number;
};

function parseJwt(token: string): UserPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(escape(payload))) as UserPayload;
  } catch {
    return null;
  }
}

export function getCurrentUser(): UserPayload | null {
  const t = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  if (!t) return null;
  return parseJwt(t);
}

export function useHasRole(allowed: string[] | string): boolean {
  const rolesAllowed = Array.isArray(allowed) ? allowed : [allowed];
  const user = getCurrentUser();
  if (!user) return false;
  const userRoles = user.roles ?? [];
  return rolesAllowed.some((r) => userRoles.includes(r));
}

export const RBACGuard: React.FC<{ roles: string[]; children: React.ReactNode }> = ({ roles, children }) => {
  return <>{useHasRole(roles) ? children : null}</>;
};
