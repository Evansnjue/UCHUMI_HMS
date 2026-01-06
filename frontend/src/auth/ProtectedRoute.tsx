import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

export const ProtectedRoute: React.FC<{ children: React.ReactNode; roles?: string[] }> = ({ children, roles }) => {
  const { token, user } = useAuth();
  if (!token) return <Navigate to="/login" />;
  if (roles && roles.length > 0) {
    const has = roles.some((r) => user?.roles?.some((ur: any) => ur.name === r));
    if (!has) return <div>Unauthorized</div>;
  }
  return <>{children}</>;
};
