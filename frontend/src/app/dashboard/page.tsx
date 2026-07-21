'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/auth-context';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Trophy,
  Flame,
  Calendar,
  BookOpen,
  Edit3,
  LogOut,
  Sparkles,
  TrendingUp,
  Award,
  ChevronRight,
  User,
  GraduationCap
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import ProtectedRoute from '@/components/shared/protected-route';
import StudyPlanList from '@/components/dashboard/study-plan-list';

// Import core workspaces directly to support unified tab navigation
import { WritingWorkspace } from '@/app/writing/page';
import { VocabularyWorkspace } from '@/app/vocabulary/page';
import { AssessmentFlow } from '@/app/assessment/page';

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
      <DashboardShell />
    </ProtectedRoute>
  );
}

function DashboardShell() {
  const { user, logout } = useAuth();
  
  // Tab control: 'overview' | 'writing' | 'vocabulary' | 'placement'
  const [activeTab, setActiveTab] = useState<'overview' | 'writing' | 'vocabulary' | 'placement'>('overview');

  const { data: stats } = useQuery<ProgressStats>({
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

  const chartData = stats?.scoreHistory.map((item) => ({
    date: new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    score: item.score,
    category: item.category.toUpperCase(),
  })) || [];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid gap-6 md:grid-cols-3">
            {/* Column 1: Progress Score Card */}
            <div className="md:col-span-1 space-y-6">
              <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col items-center justify-between text-center shadow-sm">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Estimated Band Score</h3>
                
                <div className="relative flex items-center justify-center h-32 w-32">
                  <svg className="absolute w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="54"
                      className="stroke-slate-100 fill-transparent"
                      strokeWidth="8"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="54"
                      className="stroke-indigo-600 fill-transparent"
                      strokeWidth="8"
                      strokeDasharray={2 * Math.PI * 54}
                      strokeDashoffset={2 * Math.PI * 54 * (1 - (stats?.currentBand || 5.0) / 9.0)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="flex flex-col items-center justify-center space-y-0.5">
                    <span className="text-3xl font-black text-slate-900">{stats?.currentBand.toFixed(1) || '5.5'}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Current IELTS</span>
                  </div>
                </div>

                <div className="mt-6 flex gap-6 text-xs font-semibold border-t border-slate-100 pt-4 w-full justify-center">
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase tracking-wider mb-0.5">Target</span>
                    <span className="text-slate-900 text-sm font-black">{stats?.targetBand.toFixed(1) || '7.0'}</span>
                  </div>
                  <div className="border-l border-slate-100" />
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase tracking-wider mb-0.5">CEFR Level</span>
                    <span className="text-sky-600 text-sm font-black">{stats?.cefrLevel || 'B2'}</span>
                  </div>
                </div>
              </div>

              {/* Progress Summary Statistics Card */}
              <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-3.5 shadow-sm">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Your Stats Summary</h4>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                    <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1">Mastered Words</span>
                    <span className="text-lg font-black text-slate-900">{stats?.masteredVocabCount || 0}</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                    <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1">Tasks Completed</span>
                    <span className="text-lg font-black text-slate-900">{stats?.completedTasksCount || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2 & 3: Daily Task checklist list and chart */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                <StudyPlanList />
              </div>

              {/* Weekly Chart */}
              <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <TrendingUp className="h-4.5 w-4.5 text-indigo-600" />
                    <span>Band Progression Trend</span>
                  </h3>
                  <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 border border-indigo-100 text-indigo-700 bg-indigo-50 rounded-full tracking-wider">
                    Official Grade Metric
                  </span>
                </div>

                {chartData.length === 0 ? (
                  <div className="h-48 flex items-center justify-center text-xs text-slate-400 italic">
                    Complete assessment or write essays to track score progression.
                  </div>
                ) : (
                  <div className="h-48 w-full font-mono text-[10px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                        <XAxis dataKey="date" stroke="#94A3B8" tickLine={false} />
                        <YAxis domain={[4.0, 9.0]} stroke="#94A3B8" tickLine={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#FFFFFF',
                            borderColor: '#E2E8F0',
                            borderRadius: '12px',
                            color: '#0F172A',
                            fontSize: '11px',
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="score"
                          stroke="#4F46E5"
                          strokeWidth={2.5}
                          dot={{ r: 4, stroke: '#818CF8', strokeWidth: 2, fill: '#FFFFFF' }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'writing':
        return <WritingWorkspace />;
      case 'vocabulary':
        return <VocabularyWorkspace />;
      case 'placement':
        return <AssessmentFlow />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      
      {/* 1. Left Navigation Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col justify-between shrink-0 h-full">
        <div className="space-y-8">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-600">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <span className="font-black text-sm tracking-wider uppercase text-slate-900 block">IELTS Coach</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block -mt-0.5">Bangladesh Hub</span>
            </div>
          </div>

          {/* Navigation Links list */}
          <div className="space-y-1.5">
            {[
              { id: 'overview', label: 'Dashboard Overview', icon: <Trophy className="h-4.5 w-4.5" /> },
              { id: 'writing', label: 'AI Writing Coach', icon: <Edit3 className="h-4.5 w-4.5" /> },
              { id: 'vocabulary', label: 'Vocabulary Trainer', icon: <BookOpen className="h-4.5 w-4.5" /> },
              { id: 'placement', label: 'Diagnostic Test', icon: <GraduationCap className="h-4.5 w-4.5" /> },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-slate-400'}>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* User Card at bottom */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <div className="flex items-center gap-2 px-2">
            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 border border-slate-200">
              <User className="h-4.5 w-4.5" />
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-slate-900 truncate">{user?.fullName || 'Student'}</div>
              <div className="text-[10px] text-slate-400 truncate">{user?.email}</div>
            </div>
          </div>

          <div className="flex items-center justify-between bg-amber-500/5 border border-amber-500/10 p-2.5 rounded-xl">
            <div className="flex items-center gap-1.5 text-amber-600 font-bold text-[11px]">
              <Flame className="h-4 w-4 fill-current" />
              <span>{stats?.streakCount || 1} Day Streak</span>
            </div>
            {stats?.examDate && (
              <span className="text-[10px] font-semibold text-slate-400">
                {getDaysRemaining(stats.examDate)} days left
              </span>
            )}
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-slate-200 hover:border-rose-200 bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 text-xs font-bold transition-all"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>

      </aside>

      {/* 2. Right dynamic workspace Pane */}
      <main className="flex-1 overflow-y-auto bg-slate-50/50 p-8 h-full">
        <div className="max-w-5xl mx-auto space-y-6 h-full flex flex-col">
          
          {/* Section Header */}
          <div className="flex justify-between items-start shrink-0">
            <div>
              <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <span>
                  {activeTab === 'overview' && 'Dashboard Overview'}
                  {activeTab === 'writing' && 'AI Writing Coach'}
                  {activeTab === 'vocabulary' && 'Vocabulary Trainer'}
                  {activeTab === 'placement' && 'Diagnostic Placement Test'}
                </span>
                <Sparkles className="h-4.5 w-4.5 text-indigo-600" />
              </h1>
              <p className="text-xs text-slate-450 mt-1">
                {activeTab === 'overview' && 'Monitor score histories, complete task milestones, and track streak metrics.'}
                {activeTab === 'writing' && 'Review prompts, practice essays, and examine criteria corrections.'}
                {activeTab === 'vocabulary' && 'Review spaced-repetition card decks with local definitions.'}
                {activeTab === 'placement' && 'Take placement evaluations to estimate CEFR alignments.'}
              </p>
            </div>
          </div>

          {/* Dynamic Render Tab Canvas */}
          <div className="flex-1 min-h-0">
            {renderTabContent()}
          </div>

        </div>
      </main>

    </div>
  );
}
