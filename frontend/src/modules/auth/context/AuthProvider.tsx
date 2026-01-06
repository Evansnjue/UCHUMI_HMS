import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { login as apiLogin, logout as apiLogout, refreshToken } from '../services/auth.api';
import { User } from '../types/auth.types';
import { getAccessToken, setAccessToken, clearAuth } from '../utils/storage';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (p: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (u: User | null) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const qc = useQueryClient();

  useEffect(() => {
    // Attempt to restore session via access token or refresh
    (async () => {
      const token = getAccessToken();
      if (!token) {
        try {
          const refreshed = await refreshToken();
          setAccessToken(refreshed.accessToken);
          setUser(refreshed.user);
        } catch {
          clearAuth();
        }
      } else {
        // When token exists but no user in memory we rely on server to return /auth/me via query hooks or backend call
      }
      setLoading(false);
    })();
  }, []);

  const login = async (payload: { email: string; password: string }) => {
    const res = await apiLogin(payload);
    setAccessToken(res.accessToken);
    setUser(res.user);
    qc.invalidateQueries();
  };

  const logout = async () => {
    await apiLogout();
    clearAuth();
    setUser(null);
    qc.clear();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>{children}</AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used inside AuthProvider');
  return ctx;
};
