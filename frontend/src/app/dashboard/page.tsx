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
  Users,
  Bell,
  GraduationCap,
  Mic,
  Headphones,
  Book
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
  
  // Tab control: 'overview' | 'writing' | 'speaking' | 'listening' | 'reading' | 'vocabulary' | 'performance'
  const [activeTab, setActiveTab] = useState<'overview' | 'writing' | 'speaking' | 'listening' | 'reading' | 'vocabulary' | 'performance'>('overview');

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
        return <OverviewWorkspace stats={stats} chartData={chartData} />;
      case 'writing':
        return <WritingWorkspace />;
      case 'speaking':
        return <div className="p-8 text-center text-slate-500">Speaking Workspace (Coming Soon)</div>;
      case 'listening':
        return <div className="p-8 text-center text-slate-500">Listening Workspace (Coming Soon)</div>;
      case 'reading':
        return <div className="p-8 text-center text-slate-500">Reading Workspace (Coming Soon)</div>;
      case 'vocabulary':
        return <VocabularyWorkspace />;
      case 'performance':
        return <PerformanceWorkspace stats={stats} chartData={chartData} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      
      {/* 1. Left Navigation Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 p-6 flex flex-col justify-between shrink-0 h-full shadow-[2px_0_10px_rgba(0,0,0,0.02)] z-20">
        <div className="space-y-8">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3 px-2">
            <div className="flex flex-col text-[#2c2b3b]">
              <span className="font-display-lg text-lg font-black tracking-tight leading-none flex items-center gap-1">
                <span className="text-[#6122d4]">IELTS</span> Coach
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Bangladesh Hub</span>
            </div>
          </div>

          {/* Navigation Links list */}
          <div className="space-y-1">
            {[
              { id: 'overview', label: 'Home', icon: <Trophy className="h-4.5 w-4.5" /> },
              { id: 'writing', label: 'Writing', icon: <Edit3 className="h-4.5 w-4.5" /> },
              { id: 'speaking', label: 'Speaking', icon: <Mic className="h-4.5 w-4.5" /> },
              { id: 'listening', label: 'Listening', icon: <Headphones className="h-4.5 w-4.5" /> },
              { id: 'reading', label: 'Reading', icon: <Book className="h-4.5 w-4.5" /> },
              { id: 'vocabulary', label: 'Vocabulary', icon: <BookOpen className="h-4.5 w-4.5" /> },
              { id: 'performance', label: 'Progress', icon: <TrendingUp className="h-4.5 w-4.5" /> },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold transition-all text-left ${
                    isActive
                      ? 'bg-[#6122d4] text-white shadow-md shadow-[#6122d4]/20'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-[#6122d4]'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-slate-400'}>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Promos */}
        <div className="space-y-4">
          <div className="bg-[#f6f2fe] p-4 rounded-xl flex flex-col items-start gap-1 border border-[#ebdffc]">
            <div className="flex items-center gap-2 text-[#6122d4]">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-bold">Invite friends</span>
            </div>
            <span className="text-[10px] text-[#6122d4]/70 font-semibold pl-6">Get 1 free mock test</span>
          </div>
          
          <button
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[#6122d4] text-white hover:bg-[#521bb3] hover:shadow-lg hover:shadow-[#6122d4]/20 text-xs font-bold transition-all"
          >
            <Users className="h-4 w-4" />
            <span>Join IELTS Community</span>
          </button>
        </div>
      </aside>

      {/* 2. Right dynamic workspace Pane */}
      <main className="flex-1 overflow-y-auto bg-[#f8f9fc] flex flex-col">
        
        {/* Top Header Nav */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 shrink-0 shadow-sm z-10 sticky top-0">
          <div className="flex items-center">
            <div className="bg-[#eef2fc] text-[#6122d4] px-4 py-1.5 rounded-md text-xs font-bold shadow-inner">
              {activeTab === 'overview' && 'Dashboard'}
              {activeTab === 'writing' && 'Writing Coach'}
              {activeTab === 'speaking' && 'Speaking Coach'}
              {activeTab === 'listening' && 'Listening Coach'}
              {activeTab === 'reading' && 'Reading Coach'}
              {activeTab === 'vocabulary' && 'Vocabulary'}
              {activeTab === 'performance' && 'Progress Tracking'}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="h-9 w-9 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-500 transition-colors">
              <Bell className="h-4.5 w-4.5" />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-100 relative group cursor-pointer">
              <div className="h-8 w-8 rounded-full bg-slate-200 overflow-hidden shadow-sm flex items-center justify-center border border-slate-200">
                <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.email || 'cat'}&backgroundColor=eef2fc`} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              
              {/* Dropdown Menu (Hover) */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 shadow-xl rounded-xl p-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all translate-y-2 group-hover:translate-y-0 z-50">
                <div className="px-3 py-2 border-b border-slate-50 mb-1">
                  <p className="text-xs font-bold text-slate-900 truncate">{user?.fullName || 'Student'}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                </div>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Body */}
        <div className="max-w-5xl mx-auto w-full p-8 space-y-6 flex-1">
          

          {/* Dynamic Render Tab Canvas */}
          <div className="flex-1 min-h-0">
            {renderTabContent()}
          </div>

        </div>
      </main>

    </div>
  );
}

function PerformanceWorkspace({ stats, chartData }: { stats?: ProgressStats, chartData: any[] }) {
  // Simple mock of a 30-day activity calendar
  const daysInMonth = 30;
  const activeDays = [2, 5, 6, 7, 8, 12, 14, 15, 16, 20, 21, 22, 23, 24, 25, 27, 28, 29]; // Mocked active days

  return (
    <div className="h-full overflow-y-auto p-8 max-w-7xl mx-auto space-y-8 pb-32">
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#f6f2fe] text-[#6122d4] flex items-center justify-center">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Score</p>
              <h3 className="text-xl font-black text-slate-900">Band {stats?.currentBand.toFixed(1) || '6.0'}</h3>
            </div>
          </div>
          <p className="text-xs font-semibold text-slate-500">Your CEFR level is mapped to <strong className="text-[#6122d4]">{stats?.cefrLevel || 'B2'}</strong>.</p>
        </div>

        <div className="glass-card bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target Goal</p>
              <h3 className="text-xl font-black text-slate-900">Band {stats?.targetBand.toFixed(1) || '7.5'}</h3>
            </div>
          </div>
          <p className="text-xs font-semibold text-slate-500">You need an increase of <strong>+{( (stats?.targetBand || 7.5) - (stats?.currentBand || 6.0) ).toFixed(1)} Band</strong>.</p>
        </div>

        <div className="glass-card bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Streak</p>
              <h3 className="text-xl font-black text-slate-900">{stats?.streakCount || 12} Days</h3>
            </div>
          </div>
          <p className="text-xs font-semibold text-slate-500">Consistency is key. Keep up the momentum!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Detail Chart */}
        <div className="lg:col-span-2 glass-card bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[400px]">
          <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
            <TrendingUp className="h-4.5 w-4.5 text-[#6122d4]" />
            Performance Trajectory
          </h3>
          
          <div className="flex-1 w-full min-h-0">
            {chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400 italic bg-slate-50/50 rounded-xl">
                Complete assessments or write essays to track score progression.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="date" stroke="#94A3B8" tickLine={false} tick={{ fontSize: 11, fontWeight: 600 }} dy={10} />
                  <YAxis domain={[4.0, 9.0]} stroke="#94A3B8" tickLine={false} tick={{ fontSize: 11, fontWeight: 600 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#E2E8F0',
                      borderRadius: '12px',
                      color: '#0F172A',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#6122d4"
                    strokeWidth={3}
                    dot={{ r: 4, stroke: '#8c52ff', strokeWidth: 2, fill: '#FFFFFF' }}
                    activeDot={{ r: 6, fill: '#6122d4', stroke: '#FFFFFF', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Study Calendar Grid */}
        <div className="glass-card bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="h-4.5 w-4.5 text-emerald-600" />
              Activity Calendar
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">This Month</span>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <div key={i} className="text-[10px] font-black text-slate-400 text-center">{day}</div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, i) => {
              const dayNum = i - 2; // Offset to start the month on a different weekday
              if (dayNum <= 0 || dayNum > daysInMonth) {
                return <div key={i} className="aspect-square rounded-md bg-transparent"></div>;
              }
              const isActive = activeDays.includes(dayNum);
              return (
                <div
                  key={i}
                  title={`Day ${dayNum}`}
                  className={`aspect-square rounded-md flex items-center justify-center text-[10px] font-bold cursor-default transition-all ${
                    isActive
                      ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 hover:scale-110'
                      : 'bg-slate-50 text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {dayNum}
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-sm bg-emerald-100"></div>
               <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-sm bg-slate-50"></div>
               <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Inactive</span>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function OverviewWorkspace({ stats, chartData }: { stats?: ProgressStats, chartData: any[] }) {
  const [innerTab, setInnerTab] = useState<'home' | 'reports' | 'progress' | 'study_plan'>('home');

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-[#a855f7] bg-gradient-to-r from-[#9333ea] to-[#a855f7] rounded-xl p-4 flex flex-col md:flex-row items-center justify-between shadow-sm gap-4">
        <div className="flex items-center gap-3 text-white">
          <div className="bg-white/20 p-2 rounded-lg">
             <Flame className="h-5 w-5" />
          </div>
          <span className="font-bold text-sm">2 free reports left today</span>
        </div>
        <button className="bg-[#8b23f2] hover:bg-[#7e1ee0] text-white border border-[#9d44f6] px-4 py-2 rounded-lg text-xs font-bold hover:shadow-lg transition-all flex items-center gap-2">
          <Award className="h-4 w-4" />
          Upgrade to premium now
        </button>
      </div>

      {/* Inner Tabs */}
      <div className="flex gap-2">
        {['home', 'reports', 'progress', 'study_plan'].map(t => {
           const label = t === 'study_plan' ? 'Study Plan' : t.charAt(0).toUpperCase() + t.slice(1);
           const active = innerTab === t;
           return (
             <button
               key={t}
               onClick={() => setInnerTab(t as any)}
               className={`px-5 py-2.5 text-xs font-bold rounded-t-xl transition-all ${
                 active ? 'bg-[#40237d] text-white shadow-md' : 'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800'
               }`}
             >
               {label}
             </button>
           );
        })}
      </div>

      {/* Tab Content Area */}
      <div className="pt-2">
        {innerTab === 'home' && <HomeInnerTab stats={stats} />}
        {innerTab === 'progress' && <ProgressInnerTab stats={stats} chartData={chartData} />}
        {innerTab === 'reports' && (
           <div className="bg-white rounded-xl p-12 text-center text-slate-500 border border-slate-200">Reports Archive (Coming Soon)</div>
        )}
        {innerTab === 'study_plan' && <StudyPlanInnerTab />}
      </div>
    </div>
  );
}

function HomeInnerTab({ stats }: { stats?: ProgressStats }) {
  const daysRemaining = stats?.examDate 
    ? Math.max(0, Math.ceil((new Date(stats.examDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)))
    : 89;
  
  const examDateStr = stats?.examDate 
    ? new Date(stats.examDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Oct 23, 2026';

  return (
    <div className="space-y-12">
      {/* Target Goal Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
           <div className="h-12 w-12 rounded-xl bg-[#f6f2fe] text-[#6122d4] flex items-center justify-center border border-[#ebdffc]">
              <Calendar className="h-6 w-6" />
           </div>
           <div>
              <h3 className="text-lg font-black text-slate-900">IELTS Academic</h3>
              <p className="text-sm font-semibold text-slate-500">{examDateStr} <span className="text-[#6122d4]">({daysRemaining} days left)</span></p>
           </div>
        </div>
        
        <div className="flex items-center gap-6 bg-slate-50 px-6 py-3 rounded-xl border border-slate-100">
           <div className="text-xs font-bold text-slate-400 uppercase tracking-widest text-right">
              Target Scores
           </div>
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                 <span className="text-[10px] text-slate-400 font-bold uppercase">Overall</span>
                 <span className="text-base font-black text-slate-900">{stats?.targetBand.toFixed(1) || '9.0'}</span>
              </div>
              <div className="w-px h-6 bg-slate-200"></div>
              <div className="flex items-center gap-1.5">
                 <Edit3 className="h-3.5 w-3.5 text-slate-400" />
                 <span className="text-base font-black text-slate-900">{stats?.targetBand.toFixed(1) || '9.0'}</span>
              </div>
              <div className="w-px h-6 bg-slate-200"></div>
              <div className="flex items-center gap-1.5">
                 <Mic className="h-4 w-4 text-slate-400" />
                 <span className="text-base font-black text-slate-900">{stats?.targetBand.toFixed(1) || '9.0'}</span>
              </div>
           </div>
        </div>
      </div>

      {/* Mascot Area */}
      <div className="flex flex-col items-center justify-center pt-8 pb-16 space-y-4">
         <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-slate-200 rounded-full overflow-hidden shadow-lg border-2 border-white relative">
               {/* Custom Mascot visual, using an avatar as placeholder */}
               <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=catbot`} alt="Catbot" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-4xl font-black text-slate-900">Hey, I'm Catbot!</h2>
         </div>
         <p className="text-sm font-bold text-slate-500 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            I'm here to make IELTS prep fun and effective for you.
            <Sparkles className="h-4 w-4 text-amber-500" />
         </p>
      </div>
    </div>
  );
}

function ProgressInnerTab({ stats, chartData }: { stats?: ProgressStats, chartData: any[] }) {
  // We reuse the old Overview layout here
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Column 1: Progress Score Card */}
      <div className="md:col-span-1 space-y-6">
        <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col items-center justify-between text-center shadow-sm">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Estimated Band Score</h3>
          
          <div className="relative flex items-center justify-center h-32 w-32">
            <svg className="absolute w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="54" className="stroke-slate-100 fill-transparent" strokeWidth="8" />
              <circle
                cx="64" cy="64" r="54"
                className="stroke-[#6122d4] fill-transparent"
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

        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="h-4.5 w-4.5 text-[#6122d4]" />
              <span>Band Progression Trend</span>
            </h3>
            <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 border border-[#ebdffc] text-[#6122d4] bg-[#f6f2fe] rounded-full tracking-wider">
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
                    stroke="#6122d4"
                    strokeWidth={2.5}
                    dot={{ r: 4, stroke: '#8c52ff', strokeWidth: 2, fill: '#FFFFFF' }}
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
}

function StudyPlanInnerTab() {
  const [day1Status, setDay1Status] = useState<'learning' | 'ready_for_test' | 'completed'>('learning');
  
  return (
    <div className="space-y-6">
       
       <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900">Your Study Timeline</h2>
            <p className="text-xs font-semibold text-slate-500 mt-1">Complete your daily lessons, take the test, and save your reports.</p>
          </div>
       </div>

       <div className="space-y-4">
         
         {/* Day 1 Card */}
         <div className="bg-white border-2 border-[#6122d4] rounded-2xl p-6 shadow-sm shadow-[#6122d4]/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#6122d4] text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-xl">
               Today's Plan
            </div>
            
            <div className="flex items-start gap-4">
               <div className="bg-[#f6f2fe] h-14 w-14 rounded-xl flex flex-col items-center justify-center shrink-0 border border-[#ebdffc]">
                  <span className="text-[10px] font-bold text-[#6122d4] uppercase">Day</span>
                  <span className="text-xl font-black text-[#6122d4] leading-none">1</span>
               </div>
               
               <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Introduction to IELTS Writing Task 1</h3>
                    <p className="text-sm font-semibold text-slate-500 mt-1">Learn the basic structure, vocabulary for trends, and how to write a clear overview.</p>
                  </div>
                  
                  {/* Progress Flow */}
                  <div className="flex items-center gap-4 border-t border-slate-100 pt-4">
                     
                     {/* Lesson */}
                     <div className="flex items-center gap-3 flex-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <BookOpen className={`h-5 w-5 ${day1Status === 'learning' ? 'text-amber-500' : 'text-emerald-500'}`} />
                        <div>
                           <p className="text-xs font-bold text-slate-900">Lesson Material</p>
                           <p className="text-[10px] font-semibold text-slate-500">25 mins reading</p>
                        </div>
                        {day1Status === 'learning' && (
                           <button 
                             onClick={() => setDay1Status('ready_for_test')}
                             className="ml-auto bg-white border border-slate-200 hover:border-amber-300 text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                           >
                              Mark Completed
                           </button>
                        )}
                        {day1Status !== 'learning' && (
                           <div className="ml-auto bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-md">
                              Done
                           </div>
                        )}
                     </div>

                     {/* Test */}
                     <div className={`flex items-center gap-3 flex-1 p-3 rounded-xl border transition-all ${day1Status === 'ready_for_test' ? 'bg-[#f6f2fe] border-[#ebdffc]' : 'bg-slate-50 border-slate-100'}`}>
                        <Edit3 className={`h-5 w-5 ${day1Status === 'ready_for_test' ? 'text-[#6122d4]' : (day1Status === 'completed' ? 'text-emerald-500' : 'text-slate-300')}`} />
                        <div>
                           <p className="text-xs font-bold text-slate-900">Daily Test</p>
                           <p className="text-[10px] font-semibold text-slate-500">15 mins assessment</p>
                        </div>
                        
                        {day1Status === 'learning' && (
                           <span className="ml-auto text-[10px] font-bold text-slate-400">Locked</span>
                        )}
                        {day1Status === 'ready_for_test' && (
                           <button 
                             onClick={() => setDay1Status('completed')}
                             className="ml-auto bg-[#6122d4] hover:bg-[#521bb3] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all shadow-sm shadow-[#6122d4]/30"
                           >
                              Take Test
                           </button>
                        )}
                        {day1Status === 'completed' && (
                           <div className="ml-auto bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-md">
                              Done
                           </div>
                        )}
                     </div>
                  </div>

                  {/* Report Section */}
                  <AnimatePresence>
                    {day1Status === 'completed' && (
                       <motion.div 
                         initial={{ opacity: 0, height: 0 }}
                         animate={{ opacity: 1, height: 'auto' }}
                         className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-start gap-4 mt-4"
                       >
                          <Award className="h-8 w-8 text-emerald-500 shrink-0" />
                          <div>
                             <h4 className="text-sm font-black text-emerald-900">Day 1 Report Ready</h4>
                             <p className="text-xs font-semibold text-emerald-700 mt-1">You scored a Band 6.5 on this module! Your main area of improvement is complex sentence structures.</p>
                             <button className="mt-3 bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-100 px-4 py-1.5 rounded-lg text-xs font-bold transition-all">
                                View Full Report
                             </button>
                          </div>
                       </motion.div>
                    )}
                  </AnimatePresence>

               </div>
            </div>
         </div>

         {/* Day 2 Upcoming */}
         <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm opacity-60">
            <div className="flex items-start gap-4">
               <div className="bg-slate-100 h-14 w-14 rounded-xl flex flex-col items-center justify-center shrink-0 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Day</span>
                  <span className="text-xl font-black text-slate-400 leading-none">2</span>
               </div>
               
               <div className="flex-1">
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                     Describing Data Effectively
                     <span className="bg-slate-100 text-slate-500 text-[9px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">Locked</span>
                  </h3>
                  <p className="text-sm font-semibold text-slate-500 mt-1">Complete Day 1 to unlock tomorrow's study plan.</p>
               </div>
            </div>
         </div>

       </div>
    </div>
  );
}
