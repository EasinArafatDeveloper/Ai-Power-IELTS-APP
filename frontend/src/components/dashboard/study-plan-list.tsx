'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Clock, BookOpen, Edit3, MessageCircle, Volume2, Award, Loader2, Lightbulb } from 'lucide-react';
import toast from 'react-hot-toast';

interface StudyTask {
  id: string;
  title: string;
  category: 'reading' | 'listening' | 'writing' | 'speaking' | 'vocabulary';
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'pending' | 'completed';
  estimatedMinutes: number;
}

interface DailyPlanResponse {
  dayNumber: number;
  date: string;
  tasks: StudyTask[];
}

export default function StudyPlanList() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<DailyPlanResponse>({
    queryKey: ['daily-study-plan'],
    queryFn: async () => {
      const response = await api.get('/study-plan/daily');
      return response.data;
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const response = await api.patch(`/study-plan/task/${taskId}/toggle`);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['daily-study-plan'] });
      queryClient.invalidateQueries({ queryKey: ['user-progress'] });
      toast.success(data.status === 'completed' ? 'Task completed! Keep it up!' : 'Task set to pending');
    },
    onError: () => {
      toast.error('Failed to update task status');
    },
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'vocabulary':
        return <BookOpen className="h-5 w-5 text-indigo-600" />;
      case 'writing':
        return <Edit3 className="h-5 w-5 text-emerald-600" />;
      case 'reading':
        return <Award className="h-5 w-5 text-sky-600" />;
      case 'listening':
        return <Volume2 className="h-5 w-5 text-amber-600" />;
      case 'speaking':
        return <MessageCircle className="h-5 w-5 text-violet-600" />;
      default:
        return <BookOpen className="h-5 w-5 text-slate-500" />;
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy':
        return 'text-emerald-700 bg-emerald-50 border-emerald-100';
      case 'medium':
        return 'text-amber-700 bg-amber-50 border-amber-100';
      case 'hard':
        return 'text-rose-700 bg-rose-50 border-rose-100';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-20 bg-slate-100 border border-slate-200 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-slate-100 border border-slate-200 rounded-xl text-center">
        <p className="text-sm text-slate-500">Could not fetch today's plan. Try refreshing.</p>
      </div>
    );
  }

  const sortedTasks = [...data.tasks].sort((a, b) => {
    if (a.status === b.status) return 0;
    return a.status === 'completed' ? 1 : -1;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
          Day {data.dayNumber} Focus Topics
        </h3>
        <span className="text-xs text-slate-500 font-medium">
          {new Date(data.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
        </span>
      </div>

      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {sortedTasks.map((task) => {
            const isCompleted = task.status === 'completed';
            return (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className={`flex flex-col p-4 rounded-xl border transition-all ${
                  isCompleted
                    ? 'bg-slate-100/50 border-slate-200 opacity-60'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-4 w-full">
                  <button
                    onClick={() => toggleMutation.mutate(task.id)}
                    disabled={toggleMutation.isPending}
                    className="text-slate-400 hover:text-indigo-600 transition-colors shrink-0 mt-1"
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-6 w-6 text-emerald-500 fill-emerald-100" />
                    ) : (
                      <Circle className="h-6 w-6 text-slate-300 hover:border-indigo-500" />
                    )}
                  </button>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 shrink-0">
                        {getCategoryIcon(task.category)}
                      </div>
                      <div>
                        <h4 className={`text-sm font-semibold transition-all ${
                          isCompleted ? 'text-slate-500 line-through' : 'text-slate-900'
                        }`}>
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 border rounded-full ${getDifficultyColor(task.difficulty)}`}>
                            {task.difficulty}
                          </span>
                          <div className="flex items-center gap-1 text-[11px] text-slate-550 font-medium">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{task.estimatedMinutes} mins</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* AI Suggestions for Bangladeshi students */}
                    {!isCompleted && task.category === 'vocabulary' && (
                      <div className="mt-3 p-3 rounded-lg bg-indigo-50/50 border border-indigo-100/60 text-xs text-indigo-950 space-y-1.5 ml-1">
                        <div className="text-[10px] text-indigo-600 font-extrabold uppercase tracking-wider flex items-center gap-1">
                          <Lightbulb className="h-3.5 w-3.5" />
                          <span>AI Daily Vocabulary Suggestions</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 font-bold">
                          {['Mitigate (কমানো)', 'Ubiquitous (সর্বব্যাপী)', 'Pragmatic (বাস্তবমুখী)', 'Substantiate (প্রমাণ করা)', 'Acquiesce (মেনে নেওয়া)'].map((word) => (
                            <span key={word} className="px-2 py-0.5 rounded bg-indigo-100/60 border border-indigo-200/50 text-indigo-900 font-sans">
                              {word}
                            </span>
                          ))}
                        </div>
                        <p className="text-[10px] text-indigo-500 font-medium">
                          These high-band vocabulary words are tailored for your target score. Practice spelling and synonyms!
                        </p>
                      </div>
                    )}

                    {!isCompleted && task.category === 'writing' && (
                      <div className="mt-3 p-3 rounded-lg bg-emerald-50/50 border border-emerald-100/60 text-xs text-emerald-950 space-y-1.5 ml-1">
                        <div className="text-[10px] text-emerald-600 font-extrabold uppercase tracking-wider flex items-center gap-1">
                          <Lightbulb className="h-3.5 w-3.5" />
                          <span>AI Essay Blueprint Idea</span>
                        </div>
                        <p className="text-[11px] text-emerald-800 leading-relaxed font-semibold">
                          IELTS Task 2 Idea: Technology vs Books. Use introduction hooks, construct two body paragraphs discussing benefits of digital screens vs printed tactile books, and finish with a balanced opinion. Mention transitioning words like "On the one hand", "Conversely".
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
