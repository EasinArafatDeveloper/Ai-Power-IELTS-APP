'use client';

import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-950">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mx-auto" />
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider animate-pulse">Syncing study plan data...</p>
      </div>
    </div>
  );
}
