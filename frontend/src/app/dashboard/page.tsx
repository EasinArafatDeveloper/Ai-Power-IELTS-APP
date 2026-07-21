'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/auth-context';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import {
  Compass,
  Trophy,
  Flame,
  Calendar,
  BookOpen,
  Edit3,
  LogOut,
  Sparkles,
  BarChart2,
  BookmarkCheck,
  TrendingUp,
  User
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import ProtectedRoute from '@/components/shared/protected-route';
import StudyPlanList from '@/components/dashboard/study-plan-list';

interface ScoreHistoryItem {
  date: string;
  score: number;
  category: string;
}

interface ProgressStats {
  currentBand: number;
  targetBand: number;
  cefrLevel: string;
  streakCount: number;
  examDate: string | null;
  masteredVocabCount: number;
  completedTasksCount: number;
  scoreHistory: ScoreHistoryItem[];
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const { data: stats, isLoading, error } = useQuery<ProgressStats>({
    queryKey: ['user-progress'],
    queryFn: async () => {
      const response = await api.get('/progress/stats');
      return response.data;
    },
  });

  const getDaysRemaining = (examDateStr: string | null) => {
    if (!examDateStr) return 0;
    const diff = new Date(examDateStr).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 3600 * 24)));
  };

  // Prepare chart data
  const chartData = stats?.scoreHistory.map((item) => ({
    date: new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    score: item.score,
    category: item.category.toUpperCase(),
  })) || [];

  return (
    <div className="relative flex-1 bg-slate-950 text-slate-100 min-h-screen">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-3xl" />

      {/* Header */}
      <nav className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
              <Compass className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-sm tracking-wider uppercase text-white">AI IELTS Coach</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-xl text-amber-500 text-xs font-bold">
              <Flame className="h-4.5 w-4.5 fill-current" />
              <span>{stats?.streakCount || 1} Day Streak</span>
            </div>
            
            <button
              onClick={logout}
              className="p-2 rounded-xl bg-slate-900 border border-slate-850 hover:border-rose-500/30 hover:text-rose-400 text-slate-400 transition-all"
            >
              <LogOut className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10 relative space-y-6">
        {/* Welcome row */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
              <span>Welcome, {user?.fullName || 'Student'}</span>
              <Sparkles className="h-4.5 w-4.5 text-indigo-400" />
            </h1>
            <p className="text-xs text-slate-450 mt-1">Let's work towards your target band score today.</p>
          </div>
          {stats?.examDate && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <Calendar className="h-4 w-4 text-indigo-400" />
              <span>{getDaysRemaining(stats.examDate)} days until exam</span>
            </div>
          )}
        </div>

        {/* Dashboard Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          
          {/* Column 1: Overall Band Progress Card */}
          <div className="md:col-span-1 space-y-6">
            
            {/* Progress Circular Widget */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/50 border border-slate-850 p-6 rounded-2xl flex flex-col items-center justify-between text-center"
            >
              <h3 className="text-xs font-extrabold text-slate-450 uppercase tracking-widest mb-4">Band Progress Estimator</h3>
              
              <div className="relative flex items-center justify-center h-32 w-32">
                <svg className="absolute w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="54"
                    className="stroke-slate-950 fill-transparent"
                    strokeWidth="8"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="54"
                    className="stroke-indigo-500 fill-transparent"
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 54}
                    strokeDashoffset={2 * Math.PI * 54 * (1 - (stats?.currentBand || 5.0) / 9.0)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="flex flex-col items-center justify-center space-y-0.5">
                  <span className="text-3xl font-black text-white">{stats?.currentBand.toFixed(1) || '5.5'}</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Estimated Band</span>
                </div>
              </div>

              <div className="mt-4 flex gap-6 text-xs font-semibold border-t border-slate-850/80 pt-4 w-full justify-center">
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase tracking-wider mb-0.5">Target</span>
                  <span className="text-white text-sm font-black">{stats?.targetBand.toFixed(1) || '7.0'}</span>
                </div>
                <div className="border-l border-slate-850" />
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase tracking-wider mb-0.5">CEFR Level</span>
                  <span className="text-sky-400 text-sm font-black">{stats?.cefrLevel || 'B2'}</span>
                </div>
              </div>
            </motion.div>

            {/* Quick Action Navigation Buttons */}
            <div className="bg-slate-900/50 border border-slate-850 p-6 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold text-slate-450 uppercase tracking-widest mb-2">Practice Tools</h4>
              
              <button
                onClick={() => router.push('/writing')}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-850 hover:border-indigo-500/50 bg-slate-950/60 hover:bg-slate-950 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                    <Edit3 className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-200">Writing Evaluation</h5>
                    <p className="text-[10px] text-slate-500 mt-0.5">Draft essays and get AI grades</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-650 group-hover:text-indigo-400 transition-colors" />
              </button>

              <button
                onClick={() => router.push('/vocabulary')}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-850 hover:border-emerald-500/50 bg-slate-950/60 hover:bg-slate-950 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <BookOpen className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-200">Vocabulary Flashcards</h5>
                    <p className="text-[10px] text-slate-500 mt-0.5">Spaced repetition word training</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-650 group-hover:text-emerald-400 transition-colors" />
              </button>
            </div>

          </div>

          {/* Column 2 & 3: Daily Plan & Performance Graph */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Embedded Today's Mission Tasks */}
            <div className="bg-slate-900/50 border border-slate-850 p-6 rounded-2xl">
              <StudyPlanList />
            </div>

            {/* Performance Analytics Tracking Chart */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-slate-900/50 border border-slate-850 p-6 rounded-2xl space-y-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="h-4.5 w-4.5 text-indigo-400" />
                  <span>Band Estimation History</span>
                </h3>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border text-indigo-400 bg-indigo-500/10 border-indigo-500/20 tracking-wider">
                  Overall Trend
                </span>
              </div>

              {chartData.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-xs text-slate-550 italic">
                  Complete placements and writing assignments to draw performance charts.
                </div>
              ) : (
                <div className="h-48 w-full font-mono text-[10px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                      <XAxis dataKey="date" stroke="#475569" tickLine={false} />
                      <YAxis domain={[4.0, 9.0]} stroke="#475569" tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0F172A',
                          borderColor: '#334155',
                          borderRadius: '12px',
                          color: '#F8FAFC',
                          fontSize: '11px',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#6366F1"
                        strokeWidth={2.5}
                        dot={{ r: 4, stroke: '#818CF8', strokeWidth: 2, fill: '#0F172A' }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </motion.div>

          </div>

        </div>
      </main>
    </div>
  );
}

// Simple Chevron Helper to resolve visual warning in quick Action Panel
function ChevronRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="2.5"
      stroke="currentColor"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  );
}
