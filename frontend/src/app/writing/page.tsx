'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Edit3,
  Clock,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  Award,
  Loader2,
  ChevronLeft,
  RefreshCw,
  Lightbulb
} from 'lucide-react';
import toast from 'react-hot-toast';
import ProtectedRoute from '@/components/shared/protected-route';

interface Prompt {
  _id: string;
  title: string;
  taskType: 'writing_task_1' | 'writing_task_2';
  question: string;
  sampleResponse?: string;
}

interface Evaluation {
  overallBand: number;
  criteriaScores: {
    taskAchievement: number;
    coherenceCohesion: number;
    lexicalResource: number;
    grammaticalRangeAccuracy: number;
  };
  feedbackPoints: Array<{
    type: 'grammar' | 'vocabulary' | 'structure';
    originalText: string;
    suggestedText: string;
    explanation: string;
  }>;
  improvedVersion: string;
  generalComments: string;
}

export default function WritingPracticePage() {
  return (
    <ProtectedRoute>
      <WritingWorkspace />
    </ProtectedRoute>
  );
}

export function WritingWorkspace() {
  const router = useRouter();

  // Navigation stages: 'select' | 'write' | 'evaluating' | 'result'
  const [stage, setStage] = useState<'select' | 'write' | 'evaluating' | 'result'>('select');

  // API states
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [loadingPrompts, setLoadingPrompts] = useState(true);

  // Timer states
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // Result state
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    async function fetchPrompts() {
      try {
        const res = await api.get('/writing/prompts');
        setPrompts(res.data);
      } catch (err) {
        toast.error('Failed to load essay prompts');
      } finally {
        setLoadingPrompts(false);
      }
    }
    fetchPrompts();
  }, []);

  // Timer Countdown Logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      handleFinishWriting();
      toast.error("Time is up! Submitting essay response.");
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft]);

  const handleStartTask = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setSubmissionText('');
    setStage('write');
    // Task 1 gets 20 mins, Task 2 gets 40 mins
    setTimeLeft(prompt.taskType === 'writing_task_1' ? 20 * 60 : 40 * 60);
    setSecondsElapsed(0);
    setIsRunning(true);
  };

  const evaluateMutation = useMutation({
    mutationFn: async (payload: { promptId: string; submissionText: string; timeTakenSeconds: number }) => {
      const response = await api.post('/writing/evaluate', payload);
      return response.data;
    },
    onSuccess: (data) => {
      setEvaluation(data.evaluation);
      setStage('result');
      queryClient.invalidateQueries({ queryKey: ['user-progress'] });
      toast.success('Essay evaluated successfully!');
    },
    onError: (err: any) => {
      setStage('write');
      toast.error(err.response?.data?.message || 'Failed to evaluate essay');
    },
  });

  const handleFinishWriting = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRunning(false);

    if (submissionText.trim().length < 50) {
      toast.error('Your submission must be at least 50 characters long.');
      return;
    }

    setStage('evaluating');
    evaluateMutation.mutate({
      promptId: selectedPrompt?._id || '',
      submissionText,
      timeTakenSeconds: secondsElapsed,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getWordCount = (text: string) => {
    if (!text.trim()) return 0;
    return text.trim().split(/\s+/).length;
  };

  if (loadingPrompts) {
    return (
      <div className="py-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-slate-50 min-h-[500px]">
      <AnimatePresence mode="wait">
        
        {/* Stage 1: Select Prompt */}
        {stage === 'select' && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {prompts.map((p) => (
                <div
                  key={p._id}
                  className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm hover:border-slate-350 hover:shadow-md transition-all"
                >
                  <div className="space-y-2">
                    <span className={`text-[9px] uppercase font-extrabold tracking-widest px-2.5 py-0.5 rounded-full border ${
                      p.taskType === 'writing_task_1'
                        ? 'text-emerald-700 bg-emerald-50 border-emerald-100'
                        : 'text-indigo-700 bg-indigo-50 border-indigo-100'
                    }`}>
                      {p.taskType === 'writing_task_1' ? 'Task 1: Report' : 'Task 2: Essay'}
                    </span>
                    <h3 className="text-sm font-black text-slate-900">{p.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{p.question}</p>
                  </div>
                  <button
                    onClick={() => handleStartTask(p)}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-650/10"
                  >
                    <span>Practice Essay</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Stage 2: Practice Writing Workspace */}
        {stage === 'write' && selectedPrompt && (
          <motion.div
            key="write"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-6 md:grid-cols-3"
          >
            {/* Column 1: Prompt details & Timer */}
            <div className="md:col-span-1 space-y-6">
              <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm">
                <button
                  onClick={() => setStage('select')}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-900 font-bold uppercase tracking-wider"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Exit Workspace</span>
                </button>

                <div>
                  <span className="text-[9px] uppercase font-extrabold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {selectedPrompt.taskType === 'writing_task_1' ? 'Task 1 Guidelines' : 'Task 2 Essay'}
                  </span>
                  <h3 className="text-base font-black text-slate-900 mt-2">{selectedPrompt.title}</h3>
                  <p className="text-xs text-slate-655 leading-relaxed mt-2 italic font-semibold">
                    {selectedPrompt.question}
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4.5 w-4.5 text-indigo-600 animate-pulse" />
                    <span className="font-mono text-base font-extrabold text-slate-800">{formatTime(timeLeft)}</span>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">Time Remaining</span>
                </div>
              </div>

              {/* Dynamic AI Blueprint Idea/Template */}
              <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl space-y-3 shadow-sm text-emerald-950">
                <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 flex items-center gap-1.5">
                  <Lightbulb className="h-4.5 w-4.5 text-emerald-600" />
                  <span>IELTS Bangladesh AI Outline Suggestion</span>
                </h4>
                
                {selectedPrompt.taskType === 'writing_task_1' ? (
                  <p className="text-xs leading-relaxed font-semibold">
                    Task 1 Recommendation: Start with an introduction paraphrasing the chart. Write an Overview paragraph identifying major trends (highs, lows, fluctuations). Support using exact figures in Body 1 and Body 2. Avoid listing your opinion!
                  </p>
                ) : (
                  <p className="text-xs leading-relaxed font-semibold">
                    Task 2 Recommendation: Write 4 paragraphs. 1. Introduction with Thesis Statement. 2. Supporting Body (Focus on economic advantages, efficiency, connectivity). 3. Contrasting Body (Drawbacks like digital gap, distractions). 4. Conclusion. Use transition vocabulary like "On the one hand", "Consequently", "In summation".
                  </p>
                )}
              </div>
            </div>

            {/* Column 2 & 3: Editor */}
            <div className="md:col-span-2 space-y-4">
              <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm">
                <div className="flex justify-between items-center text-xs text-slate-400 font-semibold border-b border-slate-100 pb-2">
                  <span>Writing Sandbox Area</span>
                  <span className="font-mono">Words: {getWordCount(submissionText)} / {selectedPrompt.taskType === 'writing_task_1' ? '150' : '250'} minimum</span>
                </div>

                <textarea
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  placeholder="Draft your academic response here..."
                  rows={14}
                  className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-semibold leading-relaxed"
                />

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleFinishWriting}
                    disabled={submissionText.trim().length < 50}
                    className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-650/10 disabled:opacity-50"
                  >
                    <span>Submit Essay for AI Check</span>
                    <CheckCircle className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stage 3: Evaluating Screen */}
        {stage === 'evaluating' && (
          <motion.div
            key="evaluating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-16 text-center space-y-4"
          >
            <Loader2 className="h-10 w-10 animate-spin text-indigo-650 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">AI Criteria Analyzer Running</h3>
            <p className="text-slate-550 text-xs max-w-xs mx-auto">
              Graging Task Achievement, Lexical Variety, Coherence Metrics, and Syntactic Errors...
            </p>
          </motion.div>
        )}

        {/* Stage 4: Result Scorecard Screen */}
        {stage === 'result' && evaluation && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
                  <Award className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Essay Score Assessment</h3>
                  <p className="text-xs text-slate-450 uppercase tracking-widest font-extrabold mt-0.5">Evaluation Outcome</p>
                </div>
              </div>
              <button
                onClick={() => setStage('select')}
                className="flex items-center gap-1 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-550 hover:text-slate-900 text-xs font-bold transition-all"
              >
                <RefreshCw className="h-4.5 w-4.5" />
                <span>Practice Again</span>
              </button>
            </div>

            {/* Score Breakdowns */}
            <div className="grid gap-6 md:grid-cols-3">
              {/* Circular Overall Band */}
              <div className="md:col-span-1 bg-white border border-slate-200 p-6 rounded-2xl flex flex-col items-center justify-between text-center shadow-sm">
                <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">Overall Band Score</h4>
                <div className="relative flex items-center justify-center h-28 w-28 my-4">
                  <svg className="absolute w-full h-full transform -rotate-90">
                    <circle cx="56" cy="56" r="48" className="stroke-slate-100 fill-transparent" strokeWidth="8" />
                    <circle
                      cx="56"
                      cy="56"
                      r="48"
                      className="stroke-indigo-650 fill-transparent"
                      strokeWidth="8"
                      strokeDasharray={2 * Math.PI * 48}
                      strokeDashoffset={2 * Math.PI * 48 * (1 - evaluation.overallBand / 9.0)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="text-2xl font-black text-slate-900">{evaluation.overallBand.toFixed(1)}</span>
                </div>
                <span className="text-xs text-slate-450 uppercase font-bold tracking-wider">Estimated Level</span>
              </div>

              {/* Progress bars criteria */}
              <div className="md:col-span-2 bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm">
                <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">IELTS Criteria Scores</h4>
                
                <div className="space-y-3.5 text-xs">
                  {[
                    { label: 'Task Achievement (TA)', val: evaluation.criteriaScores.taskAchievement },
                    { label: 'Coherence & Cohesion (CC)', val: evaluation.criteriaScores.coherenceCohesion },
                    { label: 'Lexical Resource (LR)', val: evaluation.criteriaScores.lexicalResource },
                    { label: 'Grammatical Range & Accuracy (GRA)', val: evaluation.criteriaScores.grammaticalRangeAccuracy },
                  ].map((crit, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>{crit.label}</span>
                        <span>{crit.val.toFixed(1)} / 9.0</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${(crit.val / 9) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* General Comments */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-3.5 shadow-sm text-xs leading-relaxed">
              <h4 className="font-extrabold text-slate-800 uppercase tracking-widest text-[10px]">AI Coach General Comments</h4>
              <p className="text-slate-655 font-semibold leading-relaxed">{evaluation.generalComments}</p>
            </div>

            {/* Feedback Points Diffs */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm">
              <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">Sentence-Level Corrections</h4>
              
              <div className="space-y-3">
                {evaluation.feedbackPoints.map((pt, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 border rounded-full ${
                        pt.type === 'grammar'
                          ? 'text-rose-700 bg-rose-50 border-rose-100'
                          : pt.type === 'vocabulary'
                          ? 'text-amber-700 bg-amber-50 border-amber-100'
                          : 'text-indigo-700 bg-indigo-50 border-indigo-100'
                      }`}>
                        {pt.type}
                      </span>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="p-2 rounded bg-rose-100/50 border border-rose-200/50 text-rose-900 line-through font-medium">
                        {pt.originalText}
                      </div>
                      <div className="p-2 rounded bg-emerald-100/50 border border-emerald-200/50 text-emerald-900 font-semibold">
                        {pt.suggestedText}
                      </div>
                    </div>

                    <p className="text-slate-550 leading-relaxed font-semibold pl-1">
                      💡 {pt.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Band 9 Improved Version */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-3 shadow-sm text-xs">
              <h4 className="font-extrabold text-indigo-700 uppercase tracking-widest text-[10px] flex items-center gap-1.5">
                <TrendingUp className="h-4.5 w-4.5" />
                <span>Model Band 9.0 Translation Rewrite</span>
              </h4>
              <div className="p-4 bg-indigo-50/50 border border-indigo-100/80 text-indigo-950 font-semibold leading-relaxed rounded-xl whitespace-pre-line">
                {evaluation.improvedVersion}
              </div>
            </div>

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
