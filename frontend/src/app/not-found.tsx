'use client';

import Link from 'next/link';
import { Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-center px-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-6">
        <Compass className="h-6 w-6 animate-pulse" />
      </div>
      <h1 className="text-2xl font-extrabold text-white">404 - Learning Path Lost</h1>
      <p className="mt-2 text-xs text-slate-400 max-w-xs leading-relaxed">
        The study path you are searching for does not exist or has been shifted.
      </p>
      <Link
        href="/dashboard"
        className="mt-6 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-all uppercase tracking-wider"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}
