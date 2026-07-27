'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

export interface User {
  id: string;
  email: string;
  fullName: string;
  targetBand: number;
  examDate: string;
  onboardingCompleted: boolean;
  assessmentCompleted: boolean;
  streakCount: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginMock: (email: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleAuthResponse = (data: any) => {
    const { token, user: backendUser } = data;
    localStorage.setItem('token', token);
    setUser(backendUser);
    
    // Redirect based on onboarding state
    if (!backendUser.assessmentCompleted) {
      router.push('/assessment');
    } else if (!backendUser.onboardingCompleted) {
      router.push('/onboarding');
    } else {
      router.push('/dashboard');
    }
  };

  const loginMock = async (email: string) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email: `dev@${email}`, password: 'password123' });
      handleAuthResponse(response.data);
      toast.success('Successfully logged in (mock)!');
    } catch (e: any) {
      console.error(e);
      toast.error('Mock authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      handleAuthResponse(response.data);
      toast.success('Successfully logged in!');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', { email, password, fullName });
      handleAuthResponse(response.data);
      toast.success('Account created successfully!');
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      localStorage.removeItem('token');
      setUser(null);
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    
    try {
      const response = await api.get('/users/me');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginMock,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
