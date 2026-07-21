'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Clock, BookOpen, Edit3, MessageCircle, Volume2, Award, Loader2 } from 'lucide-react';
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
      // Invalidate queries to refresh dashboard state
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
        return <BookOpen className="h-5 w-5 text-indigo-400" />;
      case 'writing':
        return <Edit3 className="h-5 w-5 text-emerald-400" />;
      case 'reading':
        return <Award className="h-5 w-5 text-sky-400" />;
      case 'listening':
        return <Volume2 className="h-5 w-5 text-amber-400" />;
      case 'speaking':
        return <MessageCircle className="h-5 w-5 text-violet-400" />;
      default:
        return <BookOpen className="h-5 w-5 text-slate-400" />;
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'medium':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'hard':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-20 bg-slate-900/40 border border-slate-850 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-slate-900/40 border border-slate-850 rounded-xl text-center">
        <p className="text-sm text-slate-400">Could not fetch today's plan. Try refreshing.</p>
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
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
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
                className={`flex items-center justify-between p-4 rounded-xl border backdrop-blur-sm transition-all ${
                  isCompleted
                    ? 'bg-slate-950/40 border-slate-900/80 opacity-60'
                    : 'bg-slate-900/50 border-slate-850/80 hover:border-slate-800'
                }`}
              >
                <div className="flex items-center gap-4 flex-1 mr-4">
                  <button
                    onClick={() => toggleMutation.mutate(task.id)}
                    disabled={toggleMutation.isPending}
                    className="text-slate-500 hover:text-indigo-400 transition-colors shrink-0"
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-6 w-6 text-emerald-500 fill-emerald-500/10" />
                    ) : (
                      <Circle className="h-6 w-6 text-slate-700 hover:border-indigo-500" />
                    )}
                  </button>

                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-900 shrink-0">
                      {getCategoryIcon(task.category)}
                    </div>
                    <div>
                      <h4 className={`text-sm font-semibold transition-all ${
                        isCompleted ? 'text-slate-500 line-through' : 'text-slate-200'
                      }`}>
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border rounded-full ${getDifficultyColor(task.difficulty)}`}>
                          {task.difficulty}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{task.estimatedMinutes} mins</span>
                        </div>
                      </div>
                    </div>
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
