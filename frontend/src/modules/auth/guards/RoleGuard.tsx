import React from 'react';
import { Role } from '../types/auth.types';
import { useAuth } from '../hooks/useAuth';

export const RoleGuard: React.FC<{ allowed: Role[]; children: React.ReactNode }> = ({ allowed, children }) => {
  const { user } = useAuth();
  const ok = !!user && user.roles.some(r => allowed.includes(r));
  if (!ok) return <div role="alert">Access denied</div>;
  return <>{children}</>;
};
