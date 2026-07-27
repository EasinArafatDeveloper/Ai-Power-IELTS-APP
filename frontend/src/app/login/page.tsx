'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/context/auth-context';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const authSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type AuthFormValues = z.infer<typeof authSchema>;

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#faf8ff] flex items-center justify-center text-[#004ac6]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <LoginFormContent />
    </Suspense>
  );
}

function LoginFormContent() {
  const { user, login, signup, loginMock, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      if (!user.assessmentCompleted) {
        router.push('/assessment');
      } else if (!user.onboardingCompleted) {
        router.push('/onboarding');
      } else {
        router.push('/dashboard');
      }
    }
  }, [user, router]);

  // Initialize form state based on mode parameter (mode=login vs mode=signup)
  const [isSignUp, setIsSignUp] = useState(mode !== 'login');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [devEmail, setDevEmail] = useState('student@example.com');

  // Keep state synchronized with query param if it changes
  useEffect(() => {
    setIsSignUp(mode !== 'login');
  }, [mode]);

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
    try {
      if (isSignUp) {
        await signup(values.email, values.password, fullName || 'IELTS Student');
      } else {
        await login(values.email, values.password);
      }
    } catch (err: any) {
      toast.error(err?.message || 'Authentication failed. Please try again.');
    }
  };

  return (
    <div className="relative min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col items-center justify-center overflow-x-hidden selection:bg-[#004ac6]/10">
      
      {/* Unified Ambient Glow Blobs */}
      <div className="blur-blob w-[400px] h-[400px] bg-[#dbe1ff]/40 top-[-100px] left-[-100px]" />
      <div className="blur-blob w-[350px] h-[350px] bg-[#6ffbbe]/15 bottom-[-100px] right-[-50px]" style={{ animationDelay: '-5s' }} />
      <div className="blur-blob w-[300px] h-[300px] bg-[#d5e4f8]/30 top-[40%] right-[10%]" style={{ animationDelay: '-2s' }} />



      {/* Main Content Area */}
      <main className="relative z-10 w-full max-w-[1280px] mx-auto pt-32 pb-16 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-[480px]">
          <div className="glass-card rounded-lg p-6 md:p-10 animate-slide-up shadow-2xl relative">
            <div className="dot-grid absolute inset-0 pointer-events-none"></div>
            


            {/* Header */}
            <div className="mb-6 relative z-10">
              <h1 className="font-headline-lg text-headline-lg text-[#131b2e] mb-2 text-2xl font-bold font-display-lg leading-tight">
                {isSignUp ? 'Create your account' : 'Welcome back'}
              </h1>
              <p className="font-body-md text-[#434655] font-semibold text-sm">
                {isSignUp ? 'Let\'s get started on your journey to Band 8.5.' : 'Sign in to resume your IELTS progress roadmap.'}
              </p>
            </div>

            {/* Authentication Form */}
            <form className="space-y-4 relative z-10" onSubmit={handleSubmit(onSubmit)}>
              
              {/* Full Name field (Sign Up only) */}
              {isSignUp && (
                <div className="space-y-1">
                  <label className="font-label-md text-[#434655] block ml-1 text-xs font-bold" htmlFor="full_name">
                    Full Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#737686] group-focus-within:text-[#004ac6] transition-colors">
                      <span className="material-symbols-outlined text-[20px]">person</span>
                    </div>
                    <input
                      id="full_name"
                      type="text"
                      required={isSignUp}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full bg-[#f8fafc]/50 border border-[#c3c6d7] rounded-md py-3.5 pl-12 pr-4 font-body-md focus:outline-none focus:border-[#004ac6] focus:ring-4 focus:ring-[#004ac6]/10 transition-all duration-200 text-sm font-semibold text-[#131b2e]"
                    />
                  </div>
                </div>
              )}

              {/* Email field */}
              <div className="space-y-1">
                <label className="font-label-md text-[#434655] block ml-1 text-xs font-bold" htmlFor="email">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#737686] group-focus-within:text-[#004ac6] transition-colors">
                    <span className="material-symbols-outlined text-[20px]">mail</span>
                  </div>
                  <input
                    {...register('email')}
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="w-full bg-[#f8fafc]/50 border border-[#c3c6d7] rounded-md py-3.5 pl-12 pr-4 font-body-md focus:outline-none focus:border-[#004ac6] focus:ring-4 focus:ring-[#004ac6]/10 transition-all duration-200 text-sm font-semibold text-[#131b2e]"
                  />
                </div>
                {errors.email && (
                  <p className="text-[10px] text-[#ba1a1a] font-bold ml-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password field */}
              <div className="space-y-1">
                <label className="font-label-md text-[#434655] block ml-1 text-xs font-bold" htmlFor="password">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#737686] group-focus-within:text-[#004ac6] transition-colors">
                    <span className="material-symbols-outlined text-[20px]">lock</span>
                  </div>
                  <input
                    {...register('password')}
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full bg-[#f8fafc]/50 border border-[#c3c6d7] rounded-md py-3.5 pl-12 pr-12 font-body-md focus:outline-none focus:border-[#004ac6] focus:ring-4 focus:ring-[#004ac6]/10 transition-all duration-200 text-sm font-semibold text-[#131b2e]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-4 flex items-center text-[#737686] hover:text-[#131b2e] transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                {isSignUp && (
                  <p className="text-[11px] text-[#434655] mt-1 ml-1 font-semibold">
                    Minimum 6 characters with a mix of letters and numbers.
                  </p>
                )}
                {errors.password && (
                  <p className="text-[10px] text-[#ba1a1a] font-bold ml-1">{errors.password.message}</p>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary-gradient text-white py-4 rounded-md font-label-md text-sm font-bold transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  isSignUp ? 'Create Account' : 'Log In'
                )}
              </button>



              {/* Developer Sandbox Login Bypass */}
              <div className="pt-4 border-t border-[#c3c6d7]/30 mt-4">
                <p className="text-center text-[9px] text-[#434655] font-extrabold uppercase tracking-wider mb-2">Developer Sandbox Login Bypass</p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={devEmail}
                    onChange={(e) => setDevEmail(e.target.value)}
                    className="flex-1 rounded bg-[#faf8ff] border border-[#c3c6d7] px-3 py-1.5 text-xs text-[#131b2e] focus:outline-none focus:border-[#004ac6] font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => loginMock(devEmail)}
                    className="rounded bg-[#006242] hover:bg-emerald-600 text-white text-xs font-bold px-4 py-1.5 transition-all shadow-sm cursor-pointer"
                  >
                    Bypass
                  </button>
                </div>
              </div>

            </form>

            {/* Footer terms */}
            <p className="text-center font-label-sm text-[#434655] mt-6 leading-relaxed px-4 text-xs font-semibold">
              By signing up, you agree to our <a className="text-[#004ac6] font-bold hover:underline" href="#">Terms of Service</a> and <a className="text-[#004ac6] font-bold hover:underline" href="#">Privacy Policy</a>.
            </p>
          </div>

          {/* Form Switching Actions */}
          <div className="mt-8 text-center flex flex-col items-center justify-center gap-4">
            <div>
              <span className="font-label-md text-[#434655] text-sm font-semibold font-body-md">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              </span>
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="font-label-md text-[#004ac6] font-bold ml-1 text-sm hover:underline cursor-pointer"
              >
                {isSignUp ? 'Log in' : 'Sign up'}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Decorative Bottom Footer */}
      <footer className="fixed bottom-0 left-0 w-full p-4 flex justify-center pointer-events-none opacity-40">
        <div className="max-w-[1280px] w-full flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-[#434655]">
          <span>Powered by GPT-4o</span>
          <div className="flex gap-2">
            <div className="w-8 h-1 bg-[#004ac6]/20 rounded-full"></div>
            <div className="w-16 h-1 bg-[#004ac6]/20 rounded-full"></div>
          </div>
        </div>
      </footer>

    </div>
  );
}
