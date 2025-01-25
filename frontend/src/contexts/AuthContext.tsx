// src/contexts/AuthContext.tsx

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  login: async () => {
    throw new Error('login function not implemented. Please use AuthProvider.');
  },
  register: async () => {
    throw new Error(
      'register function not implemented. Please use AuthProvider.'
    );
  },
  logout: () => {
    throw new Error(
      'logout function not implemented. Please use AuthProvider.'
    );
  },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('jwt_token')
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      localStorage.setItem('jwt_token', token);
    } else {
      localStorage.removeItem('jwt_token');
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      setToken(response.data.token);
      navigate('/libraries'); // Redirect after successful login
    } catch (error: any) {
      console.error('Login Error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/register', { email, password });
      setToken(response.data.token);
      navigate('/libraries'); // Redirect after successful registration
    } catch (error: any) {
      console.error('Registration Error:', error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    navigate('/login'); // Redirect after logout
  };

  return (
    <AuthContext.Provider value={{ token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
