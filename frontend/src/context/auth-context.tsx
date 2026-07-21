'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  auth,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  googleProvider,
  signInWithPopup,
} from '@/lib/firebase';
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
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const handleBackendLogin = async (idToken: string) => {
    try {
      const response = await api.post('/auth/firebase-login', { idToken });
      const { token, user: backendUser } = response.data;
      localStorage.setItem('token', token);
      setUser(backendUser);
      toast.success('Successfully logged in!');
      
      // Redirect based on onboarding state
      if (!backendUser.onboardingCompleted) {
        router.push('/onboarding');
      } else if (!backendUser.assessmentCompleted) {
        router.push('/assessment');
      } else {
        router.push('/dashboard');
      }
    } catch (error: any) {
      console.error('Backend login error:', error);
      toast.error(error.response?.data?.message || 'Failed to authenticate with backend');
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  const loginMock = async (email: string) => {
    setLoading(true);
    try {
      const mockToken = `mock-token-${email}`;
      await handleBackendLogin(mockToken);
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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      await handleBackendLogin(idToken);
    } catch (error: any) {
      console.error('Firebase login error:', error);
      toast.error(error.message || 'Firebase login failed');
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      await handleBackendLogin(idToken);
    } catch (error: any) {
      console.error('Firebase signup error:', error);
      toast.error(error.message || 'Firebase registration failed');
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const idToken = await userCredential.user.getIdToken();
      await handleBackendLogin(idToken);
    } catch (error: any) {
      console.error('Google Auth error:', error);
      toast.error(error.message || 'Google Authentication failed');
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
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
    if (!token) return;
    try {
      const response = await api.get('/users/me');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      const token = localStorage.getItem('token');
      
      if (firebaseUser) {
        if (!token) {
          const idToken = await firebaseUser.getIdToken();
          await handleBackendLogin(idToken);
        } else {
          await refreshUser();
        }
      } else {
        if (token) {
          await refreshUser();
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginMock,
        signup,
        loginWithGoogle,
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
