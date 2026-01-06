import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div aria-busy>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};
