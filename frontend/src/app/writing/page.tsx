'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Clock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Award,
  Sparkles,
  FileText,
  AlertTriangle,
  RotateCcw,
  BookOpenCheck,
  LayoutGrid
} from 'lucide-react';
import toast from 'react-hot-toast';
import ProtectedRoute from '@/components/shared/protected-route';

interface Prompt {
  id: string;
  title: string;
  type: 'writing_task_1' | 'writing_task_2';
  promptText: string;
  estimatedMinutes: number;
  wordTarget: string;
}

interface Evaluation {
  overallBand: number;
  scores: {
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

function WritingWorkspace() {
  const router = useRouter();

  // Navigation states: 'select' | 'write' | 'evaluating' | 'result'
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

  // Word count calculator
  const wordCount = submissionText.trim().split(/\s+/).filter(Boolean).length;

  useEffect(() => {
    fetchPrompts();
  }, []);

  useEffect(() => {
    if (stage === 'write' && isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            toast.error("Time's up! Submit your essay now.");
            return 0;
          }
          return prev - 1;
        });
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [stage, isRunning]);

  const fetchPrompts = async () => {
    setLoadingPrompts(true);
    try {
      const response = await api.get('/writing/prompts');
      setPrompts(response.data);
    } catch (e: any) {
      toast.error('Failed to load writing prompts');
    } finally {
      setLoadingPrompts(false);
    }
  };

  const startWriting = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setSubmissionText('');
    setTimeLeft(prompt.estimatedMinutes * 60);
    setSecondsElapsed(0);
    setIsRunning(true);
    setStage('write');
  };

  const handleEvaluate = async () => {
    if (!selectedPrompt) return;
    const minWords = selectedPrompt.type === 'writing_task_1' ? 40 : 80;
    if (wordCount < minWords) {
      toast.error(`Please write a comprehensive response (at least ${minWords} words)`);
      return;
    }

    setIsRunning(false);
    setStage('evaluating');

    try {
      const response = await api.post('/writing/evaluate', {
        prompt: selectedPrompt.promptText,
        submission: submissionText,
        taskType: selectedPrompt.type,
        durationSeconds: secondsElapsed,
      });

      setEvaluation(response.data.evaluation);
      toast.success('AI evaluation report generated!');
      setStage('result');
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'AI evaluator error. Please try again.');
      setStage('write');
      setIsRunning(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderSelection = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/dashboard')}
          className="p-2 rounded-xl bg-slate-900 border border-slate-850 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-all"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white">AI Writing Coach</h2>
          <p className="text-xs text-slate-450">Improve your structural writing metrics with instant criteria-level grades.</p>
        </div>
      </div>

      {loadingPrompts ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="h-32 bg-slate-900/40 border border-slate-850 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {prompts.map((p) => (
            <div
              key={p.id}
              className="flex flex-col justify-between p-6 bg-slate-900/50 border border-slate-850/80 rounded-2xl hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5 transition-all group"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                    p.type === 'writing_task_1'
                      ? 'text-sky-400 bg-sky-500/10 border-sky-500/20'
                      : 'text-violet-400 bg-violet-500/10 border-violet-500/20'
                  }`}>
                    {p.type === 'writing_task_1' ? 'Task 1 (Academic)' : 'Task 2 (Essay)'}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-550 font-bold">
                    <Clock className="h-3.5 w-3.5 text-indigo-400" />
                    <span>{p.estimatedMinutes} mins</span>
                  </div>
                </div>

                <h3 className="font-bold text-slate-200 group-hover:text-white transition-colors">{p.title}</h3>
                <p className="text-xs text-slate-450 line-clamp-3 leading-relaxed">{p.promptText}</p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-850 pt-4 text-xs font-semibold">
                <span className="text-slate-500">{p.wordTarget}</span>
                <button
                  onClick={() => startWriting(p)}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-md"
                >
                  <span>Start Practice</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderWorkspace = () => (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Left side: Prompt and word requirements */}
      <div className="space-y-4 flex flex-col justify-between bg-slate-950/40 border border-slate-900 rounded-2xl p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-slate-900 pb-3">
            <span className="text-xs uppercase font-extrabold text-indigo-400 tracking-wider">
              {selectedPrompt?.type === 'writing_task_1' ? 'Writing Task 1' : 'Writing Task 2'}
            </span>
            <button
              onClick={() => {
                if (confirm('Discard changes and return to selection?')) setStage('select');
              }}
              className="text-xs text-slate-500 hover:text-slate-300 font-semibold"
            >
              Cancel Practice
            </button>
          </div>
          <h3 className="text-base font-bold text-white">{selectedPrompt?.title}</h3>
          <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/80 p-4 border border-slate-900/60 rounded-xl italic">
            "{selectedPrompt?.promptText}"
          </p>
        </div>

        <div className="pt-6 border-t border-slate-900 space-y-2 text-xs font-medium text-slate-500">
          <div className="flex justify-between">
            <span>Minimum Requirement:</span>
            <span className="text-slate-350">{selectedPrompt?.wordTarget}</span>
          </div>
          <div className="flex justify-between">
            <span>Target Prep Time:</span>
            <span className="text-slate-350">{selectedPrompt?.estimatedMinutes} mins</span>
          </div>
        </div>
      </div>

      {/* Right side: Editor */}
      <div className="space-y-4 flex flex-col justify-between bg-slate-900/50 border border-slate-850 p-6 rounded-2xl">
        <div className="space-y-4">
          {/* Header controls */}
          <div className="flex justify-between items-center border-b border-slate-850 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4.5 w-4.5 text-indigo-400 animate-pulse" />
              <span className={`text-sm font-extrabold tracking-wider font-mono ${timeLeft < 180 ? 'text-rose-500' : 'text-slate-200'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
              <span>Words:</span>
              <span className={`font-mono text-sm ${wordCount < (selectedPrompt?.type === 'writing_task_1' ? 150 : 250) ? 'text-amber-500' : 'text-emerald-500'}`}>
                {wordCount}
              </span>
            </div>
          </div>

          <textarea
            value={submissionText}
            onChange={(e) => setSubmissionText(e.target.value)}
            placeholder="Write your essay response here. Use indentations for paragraphs..."
            rows={14}
            className="w-full rounded-xl bg-slate-950 border border-slate-850 p-4 text-sm text-slate-200 placeholder-slate-655 focus:outline-none focus:border-indigo-500 transition-all resize-none font-sans leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-between border-t border-slate-850 pt-4 mt-6">
          <button
            onClick={() => {
              if (confirm('Clear essay workspace?')) setSubmissionText('');
            }}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 font-bold transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset Workspace</span>
          </button>

          <button
            onClick={handleEvaluate}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shadow-md shadow-indigo-500/10"
          >
            <span>Request AI Evaluation</span>
            <Sparkles className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderEvaluating = () => (
    <div className="py-16 text-center space-y-4 max-w-sm mx-auto">
      <Loader2 className="h-14 w-14 animate-spin text-indigo-500 mx-auto" />
      <h3 className="text-lg font-bold text-white">AI IELTS Coach Evaluating Essay</h3>
      <p className="text-slate-400 text-xs leading-relaxed">
        Cross-analyzing spelling accuracy, lexical cohesion structures, paragraph organization, grammatical range, and Task Achievement metrics. This will take ~10 seconds.
      </p>
    </div>
  );

  const renderResult = () => (
    <div className="space-y-6">
      {/* Back to selection header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setStage('select')}
          className="p-2 rounded-xl bg-slate-900 border border-slate-850 hover:border-slate-700 text-slate-450 hover:text-slate-200 transition-all"
        >
          <LayoutGrid className="h-5 w-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white">Evaluation Report Card</h2>
          <p className="text-xs text-slate-450">Review grammatical alignments, score breakdown, and custom model alternatives.</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Side: Score Board */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6 text-center space-y-4">
            <div>
              <span className="text-xs text-slate-500 font-extrabold uppercase tracking-wider">Overall Band Score</span>
              <div className="text-6xl font-extrabold text-indigo-400 font-sans mt-2">{evaluation?.overallBand.toFixed(1)}</div>
            </div>

            <div className="border-t border-slate-900 pt-4 space-y-3 text-xs text-left">
              {[
                { label: 'Task Response', val: evaluation?.scores.taskAchievement },
                { label: 'Coherence & Cohesion', val: evaluation?.scores.coherenceCohesion },
                { label: 'Lexical Resource', val: evaluation?.scores.lexicalResource },
                { label: 'Grammar Accuracy', val: evaluation?.scores.grammaticalRangeAccuracy },
              ].map((s) => (
                <div key={s.label} className="flex justify-between items-center font-medium">
                  <span className="text-slate-400">{s.label}</span>
                  <span className="text-slate-200 font-bold px-2 py-0.5 rounded-md bg-slate-900 border border-slate-850 font-mono">
                    {s.val?.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-6 space-y-3">
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">General Recommendations</h4>
            <p className="text-xs text-slate-350 leading-relaxed">{evaluation?.generalComments}</p>
          </div>
        </div>

        {/* Right Side: Corrections & Model Essay */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section: Corrections */}
          <div className="bg-slate-900/50 border border-slate-850 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpenCheck className="h-5 w-5 text-amber-500" />
              <span>Sentence Corrections & Suggestions</span>
            </h3>

            <div className="space-y-3">
              {evaluation?.feedbackPoints.map((fp, idx) => (
                <div key={idx} className="bg-slate-950 p-4 border border-slate-900 rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                      fp.type === 'grammar'
                        ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                        : fp.type === 'vocabulary'
                        ? 'text-sky-400 bg-sky-500/10 border-sky-500/20'
                        : 'text-violet-400 bg-violet-500/10 border-violet-500/20'
                    }`}>
                      {fp.type}
                    </span>
                  </div>
                  <div>
                    <div className="text-rose-400 line-through">"{fp.originalText}"</div>
                    <div className="text-emerald-400 font-semibold mt-1">"{fp.suggestedText}"</div>
                  </div>
                  <p className="text-slate-450 mt-1 leading-relaxed">{fp.explanation}</p>
                </div>
              ))}
              {(!evaluation?.feedbackPoints || evaluation.feedbackPoints.length === 0) && (
                <p className="text-slate-500 text-xs italic">No critical writing mistakes identified. Excellent structural accuracy!</p>
              )}
            </div>
          </div>

          {/* Section: High Band Model */}
          <div className="bg-slate-900/50 border border-slate-850 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-400" />
              <span>Band 8.5+ Model Essay Rewrite</span>
            </h3>
            <p className="text-xs text-slate-350 leading-relaxed bg-slate-950 p-5 rounded-xl border border-slate-900 italic font-sans whitespace-pre-line">
              {evaluation?.improvedVersion}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative flex-1 bg-slate-950 text-slate-100 min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-500/5 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto z-10 relative">
        <AnimatePresence mode="wait">
          {stage === 'select' && renderSelection()}
          {stage === 'write' && renderWorkspace()}
          {stage === 'evaluating' && renderEvaluating()}
          {stage === 'result' && renderResult()}
        </AnimatePresence>
      </div>
    </div>
  );
}
