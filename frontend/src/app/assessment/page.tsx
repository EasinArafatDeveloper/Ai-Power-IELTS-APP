'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, AlertCircle, CheckCircle2, ChevronRight, Play, Loader2, Award, ListChecks } from 'lucide-react';
import toast from 'react-hot-toast';
import ProtectedRoute from '@/components/shared/protected-route';

export default function AssessmentPage() {
  return (
    <ProtectedRoute>
      <AssessmentFlow />
    </ProtectedRoute>
  );
}

export function AssessmentFlow() {
  const { refreshUser } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'intro' | 'grammar' | 'vocab' | 'reading' | 'writing' | 'evaluating' | 'result'>('intro');

  // Answers states
  const [grammarAnswers, setGrammarAnswers] = useState<Record<string, string>>({});
  const [vocabAnswers, setVocabAnswers] = useState<Record<string, string>>({});
  const [readingAnswers, setReadingAnswers] = useState<Record<string, string>>({});
  const [writingSubmission, setWritingSubmission] = useState('');

  // AI Evaluation output state
  const [evaluationResult, setEvaluationResult] = useState<{
    estimatedBand: number;
    cefrLevel: string;
    strengths: string[];
    weaknesses: string[];
    roadmap: string[];
  } | null>(null);

  const [submitting, setSubmitting] = useState(false);

  // Mock static placement questions
  const grammarQuestions = [
    {
      id: 'g1',
      question: 'Identify the correct sentence structure:',
      options: {
        A: 'Although he studied hard, but he failed the exam.',
        B: 'Although he studied hard, he failed the exam.',
        C: 'He studied hard although, he failed the exam.',
      },
    },
    {
      id: 'g2',
      question: 'By this time next year, I _______ my IELTS preparation.',
      options: {
        A: 'will complete',
        B: 'have completed',
        C: 'will have completed',
      },
    },
  ];

  const vocabQuestions = [
    {
      id: 'v1',
      question: 'Which word is a synonym of "profound"?',
      options: {
        A: 'Shallow',
        B: 'Deep/Insightful',
        C: 'Noisy',
      },
    },
    {
      id: 'v2',
      question: 'Choose the word that describes a problem that is "impossible to solve":',
      options: {
        A: 'Insurmountable',
        B: 'Irregular',
        C: 'Invaluable',
      },
    },
  ];

  const readingQuestion = {
    passage: 'The development of AI has transformed modern education. By automating routine grading and providing student diagnostics, software solutions allow tutors to focus on qualitative instruction. However, concerns regarding algorithmic biases and the erosion of critical thinking skills prompt academics to remain cautious.',
    question: 'According to the passage, what is a primary concern about integrating AI in education?',
    options: {
      A: 'The high cost of maintaining software tools.',
      B: 'Erosion of student critical thinking skills.',
      C: 'Tutors losing their jobs completely.',
    },
  };

  const handleSelectGrammar = (qid: string, opt: string) => {
    setGrammarAnswers((prev) => ({ ...prev, [qid]: opt }));
  };

  const handleSelectVocab = (qid: string, opt: string) => {
    setVocabAnswers((prev) => ({ ...prev, [qid]: opt }));
  };

  const handleSelectReading = (opt: string) => {
    setReadingAnswers({ r1: opt });
  };

  const handleSubmitTest = async () => {
    if (!writingSubmission || writingSubmission.trim().length < 40) {
      toast.error('Please draft a complete response in the writing section (at least 40 characters)');
      return;
    }

    setSubmitting(true);
    setActiveTab('evaluating');

    try {
      const response = await api.post('/users/placement-test', {
        grammarAnswers,
        vocabularyAnswers: vocabAnswers,
        readingAnswers,
        writingSubmission,
      });

      setEvaluationResult(response.data.evaluation);
      await refreshUser();
      setActiveTab('result');
      toast.success('Evaluation complete!');
    } catch (e: any) {
      console.error(e);
      toast.error(e.response?.data?.message || 'Failed to submit placement answers');
      setActiveTab('writing');
    } finally {
      setSubmitting(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'intro':
        return (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6 text-center"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600">
              <BookOpen className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-slate-900">Placement Assessment</h2>
              <p className="text-slate-550 text-sm max-w-md mx-auto leading-relaxed">
                To customize your daily study suggestions, complete this diagnostic placement test.
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left max-w-md mx-auto space-y-3">
              <div className="flex gap-3 items-start text-xs text-slate-600 font-semibold">
                <AlertCircle className="h-5 w-5 text-indigo-650 shrink-0" />
                <span>Covers grammar check, vocab identification, reading analysis, and a short essay response.</span>
              </div>
              <div className="flex gap-3 items-start text-xs text-slate-600 font-semibold">
                <AlertCircle className="h-5 w-5 text-indigo-650 shrink-0" />
                <span>Dashboard access remains locked until this diagnostic step is completed.</span>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('grammar')}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all shadow-lg shadow-indigo-600/10"
            >
              <span>Begin Diagnostic</span>
              <Play className="h-4 w-4 fill-current" />
            </button>
          </motion.div>
        );

      case 'grammar':
        return (
          <motion.div
            key="grammar"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-indigo-600" />
                <span>Part 1: Grammar Assessment</span>
              </h3>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Step 1 of 4</span>
            </div>

            <div className="space-y-6">
              {grammarQuestions.map((q, idx) => (
                <div key={q.id} className="space-y-3 bg-slate-50 p-5 border border-slate-200 rounded-xl">
                  <h4 className="text-sm font-bold text-slate-900">{idx + 1}. {q.question}</h4>
                  <div className="space-y-2">
                    {Object.entries(q.options).map(([key, val]) => (
                      <button
                        key={key}
                        onClick={() => handleSelectGrammar(q.id, key)}
                        className={`w-full text-left px-4 py-2.5 rounded-lg border text-xs transition-all font-semibold ${
                          grammarAnswers[q.id] === key
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-900'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-350 hover:text-slate-900'
                        }`}
                      >
                        <span className="font-bold mr-2 text-indigo-600">{key}.</span>
                        <span>{val}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                onClick={() => setActiveTab('vocab')}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shadow-md shadow-indigo-500/10"
              >
                <span>Continue</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        );

      case 'vocab':
        return (
          <motion.div
            key="vocab"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-indigo-600" />
                <span>Part 2: Vocabulary Diagnostics</span>
              </h3>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Step 2 of 4</span>
            </div>

            <div className="space-y-6">
              {vocabQuestions.map((q, idx) => (
                <div key={q.id} className="space-y-3 bg-slate-50 p-5 border border-slate-200 rounded-xl">
                  <h4 className="text-sm font-bold text-slate-900">{idx + 1}. {q.question}</h4>
                  <div className="space-y-2">
                    {Object.entries(q.options).map(([key, val]) => (
                      <button
                        key={key}
                        onClick={() => handleSelectVocab(q.id, key)}
                        className={`w-full text-left px-4 py-2.5 rounded-lg border text-xs transition-all font-semibold ${
                          vocabAnswers[q.id] === key
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-900'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-350 hover:text-slate-900'
                        }`}
                      >
                        <span className="font-bold mr-2 text-indigo-600">{key}.</span>
                        <span>{val}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setActiveTab('grammar')}
                className="text-xs text-slate-500 hover:text-slate-900 font-bold"
              >
                Back
              </button>
              <button
                onClick={() => setActiveTab('reading')}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shadow-md shadow-indigo-500/10"
              >
                <span>Continue</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        );

      case 'reading':
        return (
          <motion.div
            key="reading"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-indigo-600" />
                <span>Part 3: Reading Comprehension</span>
              </h3>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Step 3 of 4</span>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-slate-700 text-sm leading-relaxed italic">
                {readingQuestion.passage}
              </div>

              <div className="space-y-3 bg-slate-50 p-5 border border-slate-200 rounded-xl">
                <h4 className="text-sm font-bold text-slate-900">{readingQuestion.question}</h4>
                <div className="space-y-2">
                  {Object.entries(readingQuestion.options).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => handleSelectReading(key)}
                      className={`w-full text-left px-4 py-2.5 rounded-lg border text-xs transition-all font-semibold ${
                        readingAnswers['r1'] === key
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-900'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-350 hover:text-slate-900'
                      }`}
                    >
                      <span className="font-bold mr-2 text-indigo-600">{key}.</span>
                      <span>{val}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setActiveTab('vocab')}
                className="text-xs text-slate-500 hover:text-slate-900 font-bold"
              >
                Back
              </button>
              <button
                onClick={() => setActiveTab('writing')}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shadow-md shadow-indigo-500/10"
              >
                <span>Continue</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        );

      case 'writing':
        return (
          <motion.div
            key="writing"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-indigo-600" />
                <span>Part 4: Mini Essay Submission</span>
              </h3>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Step 4 of 4</span>
            </div>

            <div className="space-y-4">
              <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl">
                <h4 className="text-xs font-black text-indigo-700 uppercase tracking-wider mb-1">Writing Prompt</h4>
                <p className="text-sm text-slate-900 leading-relaxed font-bold">
                  Why is learning a second language important in the global economy? State your opinion and give examples.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Essay Response</label>
                <textarea
                  required
                  placeholder="Draft your response here (Minimum 40 characters)..."
                  value={writingSubmission}
                  onChange={(e) => setWritingSubmission(e.target.value)}
                  rows={6}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 p-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all font-semibold"
                />
                <div className="flex justify-between items-center text-[10px] text-slate-450 font-bold uppercase tracking-wider">
                  <span>Characters: {writingSubmission.length}</span>
                  <span>Minimum recommendation: 100+ words</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setActiveTab('reading')}
                className="text-xs text-slate-500 hover:text-slate-900 font-bold"
              >
                Back
              </button>
              <button
                onClick={handleSubmitTest}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-all shadow-md shadow-emerald-500/10"
              >
                <span>Submit Assessment</span>
                <CheckCircle2 className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        );

      case 'evaluating':
        return (
          <motion.div
            key="evaluating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 text-center space-y-4"
          >
            <Loader2 className="h-12 w-12 animate-spin text-indigo-650 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">AI Coach Evaluating Answers</h3>
            <p className="text-slate-500 text-xs max-w-xs mx-auto">
              Analyzing lexical coherence structures, grammar patterns, spelling, and vocab ranges. Generating CEFR assessment and IELTS roadmap...
            </p>
          </motion.div>
        );

      case 'result':
        return (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 text-center"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Award className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-950">Diagnostic Evaluation Complete</h2>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-extrabold">Ready to begin learning</p>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-sm">
                <div className="text-[10px] text-slate-450 font-bold mb-1 uppercase tracking-wider">Estimated Band</div>
                <div className="text-4xl font-black text-indigo-600">{evaluationResult?.estimatedBand.toFixed(1)}</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-sm">
                <div className="text-[10px] text-slate-450 font-bold mb-1 uppercase tracking-wider">CEFR Level</div>
                <div className="text-4xl font-black text-sky-655">{evaluationResult?.cefrLevel}</div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left space-y-4 max-w-md mx-auto text-xs">
              <div>
                <h4 className="font-extrabold text-emerald-700 mb-1.5 uppercase tracking-wider text-[10px]">Linguistic Strengths</h4>
                <ul className="list-disc pl-4 space-y-1 text-slate-655 font-semibold">
                  {evaluationResult?.strengths.map((s, idx) => <li key={idx}>{s}</li>)}
                </ul>
              </div>
              
              <div className="border-t border-slate-200 pt-3">
                <h4 className="font-extrabold text-amber-700 mb-1.5 uppercase tracking-wider text-[10px]">Areas to Focus</h4>
                <ul className="list-disc pl-4 space-y-1 text-slate-655 font-semibold">
                  {evaluationResult?.weaknesses.map((w, idx) => <li key={idx}>{w}</li>)}
                </ul>
              </div>

              <div className="border-t border-slate-200 pt-3">
                <h4 className="font-extrabold text-indigo-700 mb-1.5 uppercase tracking-wider text-[10px]">Initial Learning Roadmap</h4>
                <ul className="list-decimal pl-4 space-y-1 text-slate-655 font-semibold">
                  {evaluationResult?.roadmap.map((r, idx) => <li key={idx}>{r}</li>)}
                </ul>
              </div>
            </div>

            <button
              onClick={() => router.push('/dashboard')}
              className="inline-flex items-center gap-1.5 px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all shadow-md shadow-indigo-500/10"
            >
              <span>Unlock My Dashboard</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </motion.div>
        );
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl" />

      <div className="w-full max-w-xl z-10 space-y-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
