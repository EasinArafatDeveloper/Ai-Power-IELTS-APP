'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Loader2, Globe, Mail, Lock, ArrowRight, Compass } from 'lucide-react';
import Link from 'next/link';

const authSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type AuthFormValues = z.infer<typeof authSchema>;

export default function LoginPage() {
  const { login, signup, loginWithGoogle, loginMock, loading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [devEmail, setDevEmail] = useState('student@example.com');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: AuthFormValues) => {
    if (isSignUp) {
      await signup(values.email, values.password, fullName || 'IELTS Student');
    } else {
      await login(values.email, values.password);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      {/* Background gradients */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl filter animate-pulse" />
      <div className="absolute bottom-0 -right-4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl filter animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md space-y-8 z-10"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400"
          >
            <Compass className="h-8 w-8" />
          </motion.div>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white font-sans sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
            {isSignUp ? 'Create your Coach Profile' : 'Welcome back'}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Your personalized journey to band target starts here.
          </p>
        </div>

        {/* Glassmorphic Card Container */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-8 shadow-2xl shadow-slate-950/50">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {isSignUp && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-600">
                  <Mail className="h-5 w-5" />
                </span>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-10 pr-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-500 font-medium">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-600">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  {...register('password')}
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-10 pr-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
              {errors.password && (
                <p className="text-xs text-rose-500 font-medium">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <span>{isSignUp ? 'Register Account' : 'Sign In'}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Social Logins */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900/60 px-2 text-slate-500 font-semibold tracking-wider">Or continue with</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={loginWithGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-850 bg-slate-950 hover:bg-slate-900 text-slate-200 font-medium py-3 text-sm transition-all focus:outline-none"
            >
              <Globe className="h-5 w-5 text-indigo-400" />
              <span>Continue with Google</span>
            </button>

            {/* Developer Simulated Bypass - Vital for immediate evaluation without setup */}
            <div className="pt-4 border-t border-slate-800/50 mt-4">
              <p className="text-center text-xs text-slate-500 font-medium mb-2">Developer Sandbox Login Bypass</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={devEmail}
                  onChange={(e) => setDevEmail(e.target.value)}
                  className="flex-1 rounded-lg bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-slate-300 placeholder-slate-700 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => loginMock(devEmail)}
                  className="rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-1.5 transition-all"
                >
                  Quick Sandbox Access
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
