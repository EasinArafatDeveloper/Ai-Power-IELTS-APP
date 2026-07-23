'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    // Redirect completed steps to avoid repeating them
    if (pathname === '/assessment' && user.assessmentCompleted) {
      router.replace(user.onboardingCompleted ? '/dashboard' : '/onboarding');
      return;
    }

    if (pathname === '/onboarding' && user.onboardingCompleted) {
      router.replace('/dashboard');
      return;
    }

    // Skip redirect loops for remaining active steps
    if (pathname === '/onboarding' || pathname === '/assessment') {
      return;
    }

    if (!user.assessmentCompleted) {
      router.replace('/assessment');
    } else if (!user.onboardingCompleted) {
      router.replace('/onboarding');
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-950">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-500 mx-auto" />
          <p className="text-slate-400 text-sm font-medium animate-pulse">Loading your AI Coach...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  if (pathname !== '/onboarding' && !user.onboardingCompleted) {
    return null;
  }
  if (pathname !== '/onboarding' && pathname !== '/assessment' && !user.assessmentCompleted) {
    return null;
  }

  return <>{children}</>;
}
