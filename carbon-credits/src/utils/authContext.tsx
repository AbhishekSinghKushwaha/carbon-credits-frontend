"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiCall } from './api';

interface AuthUser {
  id: string;
  userName: string;
  role: 'employee' | 'employer' | 'admin';
}

interface AuthContextType {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          // Validate token with the backend
          const role = JSON.parse(storedUser).role;
          const endpoint = role === 'admin' ? '/api/admin/validate' : role === 'employer' ? '/api/employers/validate' : '/api/employees/validate';
          const response = await apiCall<{ user: AuthUser }>(endpoint, 'GET');

          if (response.data) {
            setUser(response.data.user);
          } else {
            // Token is invalid, clear localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
          }
        } catch (error) {
          console.error('Token validation failed:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setLoading(false); // Set loading to false after validation
    };

    validateToken();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};