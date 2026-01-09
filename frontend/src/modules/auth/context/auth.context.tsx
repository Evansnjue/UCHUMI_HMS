/**
 * Auth Context
 * Global state for authentication across the application
 * Handles user session, token management, and session timeout
 */

import React, { createContext, useCallback, useEffect, useState, ReactNode } from 'react';
import { UserDto } from '../types';
import { authService } from '../services';

interface AuthContextType {
  user: UserDto | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionTimeoutWarning: boolean;
  setUser: (user: UserDto | null) => void;
  logout: () => void;
  setSessionTimeoutWarning: (warning: boolean) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  sessionTimeoutMs?: number; // defaults to 15 minutes
  warningTimeBeforeTimeoutMs?: number; // defaults to 2 minutes
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  sessionTimeoutMs = 15 * 60 * 1000, // 15 minutes
  warningTimeBeforeTimeoutMs = 2 * 60 * 1000, // 2 minutes
}) => {
  const [user, setUser] = useState<UserDto | null>(() => {
    // Restore user from localStorage on mount
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [sessionTimeoutWarning, setSessionTimeoutWarning] = useState(false);

  // Load user from profile on mount if authenticated
  useEffect(() => {
    const loadUser = async () => {
      if (authService.isAuthenticated() && !user) {
        setIsLoading(true);
        try {
          const profile = await authService.getProfile();
          setUser(profile);
          localStorage.setItem('user', JSON.stringify(profile));
        } catch (error) {
          console.error('Failed to load user profile:', error);
          authService.logout();
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadUser();
  }, [user]);

  // Session timeout handler
  useEffect(() => {
    if (!authService.isAuthenticated()) return;

    let timeoutId: NodeJS.Timeout;
    let warningTimeoutId: NodeJS.Timeout;
    let activityTimeoutId: NodeJS.Timeout;

    const resetTimeouts = () => {
      clearTimeout(timeoutId);
      clearTimeout(warningTimeoutId);
      clearTimeout(activityTimeoutId);
      setSessionTimeoutWarning(false);

      // Show warning before timeout
      warningTimeoutId = setTimeout(() => {
        setSessionTimeoutWarning(true);
      }, sessionTimeoutMs - warningTimeBeforeTimeoutMs);

      // Auto logout on timeout
      timeoutId = setTimeout(() => {
        authService.logout();
        setUser(null);
        localStorage.removeItem('user');
        setSessionTimeoutWarning(false);
      }, sessionTimeoutMs);
    };

    resetTimeouts();

    // Reset timeout on user activity
    const handleActivity = () => {
      resetTimeouts();
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach((event) => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(warningTimeoutId);
      clearTimeout(activityTimeoutId);
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [sessionTimeoutMs, warningTimeBeforeTimeoutMs]);

  const handleLogout = useCallback(() => {
    authService.logout();
    setUser(null);
    localStorage.removeItem('user');
    setSessionTimeoutWarning(false);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user && authService.isAuthenticated(),
    isLoading,
    sessionTimeoutWarning,
    setUser,
    logout: handleLogout,
    setSessionTimeoutWarning,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
