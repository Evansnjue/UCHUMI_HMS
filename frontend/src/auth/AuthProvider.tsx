import React, { createContext, useContext, useState } from 'react';
import * as api from './api';

interface AuthContextValue {
  token?: string | null;
  user?: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const login = async (email: string, password: string) => {
    const data = await api.login(email, password);
    setToken(data.accessToken);
    // set default header for subsequent calls
    api.default.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
    const profile = await api.getProfile(data.accessToken);
    setUser(profile);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    // remove header
    delete api.default.defaults.headers.common['Authorization'];
    // Invalidate token on backend if using token revocation
  };

  return <AuthContext.Provider value={{ token, user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
