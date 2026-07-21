'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-center px-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-6">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h1 className="text-xl font-extrabold text-white">Something went wrong</h1>
      <p className="mt-2 text-xs text-slate-450 max-w-xs leading-relaxed">
        {error.message || 'An unexpected error occurred during your learning session.'}
      </p>
      <button
        onClick={reset}
        className="mt-6 text-xs font-extrabold bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 rounded-xl text-white transition-all shadow-md shadow-indigo-500/10 uppercase tracking-wider"
      >
        Retry Session
      </button>
    </div>
  );
}
