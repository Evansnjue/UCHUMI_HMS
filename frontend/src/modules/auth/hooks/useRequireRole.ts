import { useAuth } from './useAuth';
import { Role } from '../types/auth.types';

export const useRequireRole = (allowed: Role[]) => {
  const { user } = useAuth();
  return !!user && user.roles.some(r => allowed.includes(r));
};
