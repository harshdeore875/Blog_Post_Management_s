import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../services/authApi.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authApi
      .getProfile()
      .then((profile) => {
        setUser(profile);
        localStorage.setItem('user', JSON.stringify(profile));
      })
      .catch(() => {
        setUser(null);
        localStorage.removeItem('user');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSetUser = (newUser) => {
    setUser(newUser);
    try {
      if (newUser) {
        localStorage.setItem('user', JSON.stringify(newUser));
      } else {
        localStorage.removeItem('user');
      }
    } catch (e) {
      console.error('Failed to sync auth to localStorage', e);
    }
  };

  const value = useMemo(
    () => ({
      user,
      role: user?.role || null,
      isAuthenticated: Boolean(user),
      loading,
      setUser: handleSetUser,
      refreshProfile: async () => {
        try {
          const profile = await authApi.getProfile();
          handleSetUser(profile);
          return profile;
        } catch (error) {
          handleSetUser(null);
          throw error;
        }
      },
    }),
    [loading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
