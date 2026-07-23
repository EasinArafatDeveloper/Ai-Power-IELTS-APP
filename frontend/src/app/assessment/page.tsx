'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  ChevronRight, 
  Loader2, 
  Award, 
  Compass,
  Sparkles,
  TrendingUp,
  GraduationCap,
  Map,
  Settings,
  Check,
  Clock,
  Zap,
  Undo2,
  Redo2,
  Brush,
  ArrowLeft,
  ArrowRight,
  EyeOff,
  Eye,
  Calendar,
  Sparkle
} from 'lucide-react';
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
  const { user, refreshUser } = useAuth();
  const router = useRouter();

  // Tabs: 'intro' | 'overview' | 'grammar' | 'vocab' | 'reading' | 'writing' | 'evaluating' | 'result' | 'roadmap'
  const [activeTab, setActiveTab] = useState<'intro' | 'overview' | 'grammar' | 'vocab' | 'reading' | 'writing' | 'evaluating' | 'result' | 'roadmap'>('intro');

  // Answers states
  const [grammarAnswers, setGrammarAnswers] = useState<Record<string, string>>({});
  const [vocabAnswers, setVocabAnswers] = useState<Record<string, string>>({});
  const [readingAnswers, setReadingAnswers] = useState<Record<string, string>>({});
  const [writingSubmission, setWritingSubmission] = useState('');

  // Diagnostic Test Step Index
  const [currentGrammarIndex, setCurrentGrammarIndex] = useState(0);
  const [currentVocabIndex, setCurrentVocabIndex] = useState(0);

  // Undo / Redo history stacks for Writing
  const [writingHistory, setWritingHistory] = useState<string[]>(['']);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Count-down timer state (seconds)
  const [timerSeconds, setTimerSeconds] = useState(0);

  // Highlight tool toggle state
  const [highlightToggle, setHighlightToggle] = useState(false);

  // Time tracking states
  const [startTime] = useState(() => Date.now());
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);

  // Simulated progress percentage for active processing step (Step 13 of 15)
  const [evalProgress, setEvalProgress] = useState(54);

  // AI Evaluation output state
  const [evaluationResult, setEvaluationResult] = useState<{
    estimatedBand: number;
    cefrLevel: string;
    strengths: string[];
    weaknesses: string[];
    roadmap: string[];
  } | null>(null);

  // Submit test function (declared first so it can be safely referenced)
  const handleSubmitTest = async () => {
    if (!writingSubmission || writingSubmission.trim().length < 40) {
      toast.error('Please draft a complete response in the writing section (at least 40 characters)');
      return;
    }

    setTimeSpentSeconds(Math.round((Date.now() - startTime) / 1000));
    handleTransitionToTab('evaluating');

    try {
      const response = await api.post('/users/placement-test', {
        grammarAnswers,
        vocabularyAnswers: vocabAnswers,
        readingAnswers,
        writingSubmission,
      });

      setEvaluationResult(response.data.evaluation);
      await refreshUser();
    } catch (e: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      console.error(e);
      toast.error(e.response?.data?.message || 'Failed to submit placement answers');
      handleTransitionToTab('writing');
    }
  };

  // Helper to transition tabs and manage timers without useEffect cascading renders
  const handleTransitionToTab = (tab: typeof activeTab) => {
    if (tab === 'reading') {
      setTimerSeconds(1200); // 20 minutes
    } else if (tab === 'writing') {
      setTimerSeconds(2400); // 40 minutes
    }
    setActiveTab(tab);
  };

  // Timer runner effect
  useEffect(() => {
    if (activeTab !== 'reading' && activeTab !== 'writing') return;
    if (timerSeconds <= 0) return;

    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (activeTab === 'reading') {
            handleTransitionToTab('writing');
          } else if (activeTab === 'writing') {
            handleSubmitTest();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTab, timerSeconds]);

  // Simulated processing screen timer
  useEffect(() => {
    if (activeTab !== 'evaluating') return;
    const interval = setInterval(() => {
      setEvalProgress((prev) => {
        if (prev >= 98) {
          clearInterval(interval);
          handleTransitionToTab('result');
          return 100;
        }
        return prev + Math.floor(Math.random() * 8) + 4;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [activeTab]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Mock static placement questions
  const grammarQuestions = [
    {
      id: 'g1',
      category: 'Sentence Structure',
      question: 'Identify the correct sentence structure:',
      options: {
        A: 'Although he studied hard, but he failed the exam.',
        B: 'Although he studied hard, he failed the exam.',
        C: 'He studied hard although, he failed the exam.',
      },
    },
    {
      id: 'g2',
      category: 'Future Perfect Tense',
      question: 'By this time next year, I _______ my IELTS preparation.',
      options: {
        A: 'will complete',
        B: 'have completed',
        C: 'will have completed',
      },
    },
    {
      id: 'g3',
      category: 'Tense Consistency',
      question: 'By the time the new research center ________ in 2026, the team will have already completed the preliminary environmental impact reports.',
      options: {
        A: 'opens',
        B: 'will open',
        C: 'opened',
        D: 'has opened',
      },
    },
  ];

  const vocabQuestions = [
    {
      id: 'v1',
      category: 'Synonym Identification',
      word: 'Profound',
      question: 'Choose the word that most closely matches the meaning of "Profound" in the context of academic research.',
      sentence: 'The speaker\'s lecture on the economic impacts of automation left a profound impression on the audience.',
      options: {
        A: { title: 'Shallow', desc: 'Lacking depth or serious thought; superficial.' },
        B: { title: 'Deep/Insightful', desc: 'Having or showing great knowledge, insight, or understanding.' },
        C: { title: 'Noisy', desc: 'Making or given to making a lot of loud, unpleasant noise.' },
        D: { title: 'Common', desc: 'Occurring, found, or done often; ordinary.' }
      },
    },
    {
      id: 'v2',
      category: 'Vocabulary Diagnostics',
      word: 'Insurmountable',
      question: 'Choose the word that describes a problem that is "impossible to solve":',
      sentence: 'The logistical challenges of distributing vaccine doses to remote areas seemed insurmountable.',
      options: {
        A: { title: 'Insurmountable', desc: 'Too great to be overcome or resolved.' },
        B: { title: 'Irregular', desc: 'Not even or balanced in shape, arrangement, or occurrence.' },
        C: { title: 'Invaluable', desc: 'Extremely useful; indispensable.' },
        D: { title: 'Inconsequential', desc: 'Not important or significant.' }
      },
    },
    {
      id: 'v3',
      category: 'Synonym Identification',
      word: 'Meticulous',
      question: 'Choose the word that most closely matches the meaning of "Meticulous" in the context of academic research.',
      sentence: 'The lead researcher was praised for her meticulous attention to detail when documenting the clinical trial results.',
      options: {
        A: { title: 'Thorough', desc: 'Showing great attention to detail; very careful and precise.' },
        B: { title: 'Occasional', desc: 'Happening from time to time; not constant or regular.' },
        C: { title: 'Hasty', desc: 'Done or made with excessive speed or urgency; hurried.' },
        D: { title: 'Ambiguous', desc: 'Open to more than one interpretation; having a double meaning.' }
      },
    },
  ];

  const handleSelectGrammar = (qid: string, opt: string) => {
    setGrammarAnswers((prev) => ({ ...prev, [qid]: opt }));
  };

  const handleSelectVocab = (qid: string, opt: string) => {
    setVocabAnswers((prev) => ({ ...prev, [qid]: opt }));
  };

  // Writing editor content changes with history tracking
  const handleWritingChange = (text: string) => {
    setWritingSubmission(text);
    const newHistory = writingHistory.slice(0, historyIndex + 1);
    newHistory.push(text);
    if (newHistory.length > 50) newHistory.shift();
    setWritingHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setWritingSubmission(writingHistory[prevIndex]);
      toast.success('Undo action applied', { id: 'editor-action', duration: 800 });
    }
  };

  const handleRedo = () => {
    if (historyIndex < writingHistory.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setWritingSubmission(writingHistory[nextIndex]);
      toast.success('Redo action applied', { id: 'editor-action', duration: 800 });
    }
  };

  const getGrammarScore = () => {
    let score = 0;
    if (grammarAnswers['g1'] === 'B') score += 1;
    if (grammarAnswers['g2'] === 'C') score += 1;
    if (grammarAnswers['g3'] === 'A') score += 1;
    return (score / 3) * 100;
  };

  const getVocabScore = () => {
    let score = 0;
    if (vocabAnswers['v1'] === 'B') score += 1;
    if (vocabAnswers['v2'] === 'A') score += 1;
    if (vocabAnswers['v3'] === 'A') score += 1;
    return (score / 3) * 100;
  };

  const getReadingScore = () => {
    let score = 0;
    if (readingAnswers['q1'] === 'C') score += 1;
    if (readingAnswers['q2'] === 'A') score += 1;
    if (readingAnswers['q3'] === 'B') score += 1;
    if (readingAnswers['q4']?.trim().toLowerCase() === 'pattern recognition') score += 1;
    if (readingAnswers['q5']?.trim().toLowerCase() === 'critical reasoning') score += 1;
    return (score / 5) * 100;
  };

  const getWritingScore = () => {
    if (!writingSubmission) return 0;
    const words = writingSubmission.trim().split(/\s+/).length;
    if (words > 250) return 90;
    if (words > 150) return 75;
    if (words > 80) return 60;
    if (words > 40) return 45;
    return 30;
  };

  const getWordCount = (text: string) => {
    if (!text || text.trim() === '') return 0;
    return text.trim().split(/\s+/).length;
  };

  // High-fidelity content tabs rendering
  const renderContent = () => {
    switch (activeTab) {
      case 'intro':
        return (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full"
          >
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#004ac6]/10 text-[#004ac6] rounded-full text-xs font-bold w-fit uppercase tracking-wider">
                <Sparkles className="h-3 w-3 text-[#004ac6] fill-current animate-pulse" />
                <span>AI Powered Analysis</span>
              </div>
              
              <h1 className="font-display-lg text-4xl lg:text-5xl font-extrabold text-[#131b2e] leading-tight">
                Let{"'"}s Understand <br /> <span className="text-[#004ac6]">Your English</span>
              </h1>
              
              <p className="font-body-lg text-[#434655] font-semibold leading-relaxed text-base lg:text-lg max-w-xl">
                Our precision-engineered placement engine uses advanced LLMs to map your current proficiency across 4 critical IELTS domains in real-time.
              </p>

              <div className="flex gap-4">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#eaedff] text-[#004ac6] font-bold text-xs rounded-full shadow-sm">
                  <Clock className="h-4 w-4" />
                  10 Minutes
                </span>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#6ffbbe]/25 text-[#006242] font-bold text-xs rounded-full shadow-sm">
                  <Zap className="h-4 w-4 fill-current" />
                  Instant Result
                </span>
              </div>

              <div className="pt-4 space-y-3">
                <button
                  onClick={() => handleTransitionToTab('overview')}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-b from-[#3B82F6] to-[#2563EB] text-white font-bold rounded-full shadow-[0_12px_24px_-8px_rgba(37,99,235,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border-t border-white/20"
                >
                  Start Assessment
                  <ChevronRight className="h-5 w-5" />
                </button>
                <p className="text-[#737686] text-xs font-bold">You can pause and resume anytime.</p>
              </div>

              {/* Bottom statistics display */}
              <div className="pt-8 border-t border-[#c3c6d7]/30 flex items-center gap-4">
                <div className="flex -space-x-3">
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDHygU7AJkB7e2ou6-NqTK3BgRdHkTv3vakWfXeetZjRNrd_8ctsoGACasK0DEc6FzqEV3iHFhxvWwyK6Ur60iQFawzazvA0fozD5Y_9v8op1he4yvxp0pUsQ6XVoi21i9t8i5Et2WDaFVIUVAoznUsgItLpHBu6TPRbQ1Dwuu6_1YuggzifoSuXwXdKjM59CH2EURCau6IM0utGmEYwlcoYjq4B0ysVxcmLKwR500OPFN_-qPIUrcdThNAfWjQYhqYKb-fs2uNBdkr')`, backgroundSize: 'cover' }}></div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDMS5b37mAcjybiCdEkMxb6W9GbjO1tvlww6N8TqrmjRKTbK-BFNvweAxdszbxpQ3d8DZElZsplAHenOLL_UoUAvvzU8nKRhKsSwPN4vauXWmes04RERiHaOQ_Sl2ZmWJCkI2cDvoIXDydaeKN9WUIO1IlLs2ifJDun_g8Y8KHw5JGZEAXu75E9akqPqsMnZq5n6iCCnP80SQWv0hAHmyB0sVlWbGEgnJ56rX4G-eFHkf05ty6APM8WArc5MRy4XXlJBtad2FxhYdK_')`, backgroundSize: 'cover' }}></div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuC_hYfohmFVIg_Rc9Cqu1_gfN2Bl6HZXAnSIaRimPKNIutyxkMmbINOqZFLm_Phwy_BwFbWXX1rYzraut_0aQXXNScglGYgaY_zNK0KDV7ajJJSEy0fgnjKjQyucD_Dzj-KsJslfm74V52nTMYNu1b_BWgg_NQS4uqg2QqyaSoZveqWIjHyzLsViqpPsxyUxOYG541dP678M2hsE9xyF6WoBtsp1rc2GWdnf75uKkVUr369TO0D3pOXC91dqo8IxVr89H6cTDCO6uYE')`, backgroundSize: 'cover' }}></div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-[#2563eb] text-white flex items-center justify-center text-[10px] font-bold">+24k</div>
                </div>
                <p className="text-xs font-bold text-[#434655]">
                  Join 24,000+ students who benchmarked their levels today.
                </p>
              </div>
            </div>

            {/* Right Card / Graphic Column */}
            <div className="lg:col-span-5 space-y-6">
              {/* Glowing active engine card */}
              <div className="glass-card p-6 rounded-2xl border border-white/20 shadow-xl flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#004ac6]/10 to-transparent pointer-events-none"></div>
                <img 
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80" 
                  alt="Glowing neural net network visual representation" 
                  className="w-24 h-24 mb-4 object-cover rounded-full animate-float border-2 border-[#004ac6]/30 shadow-lg" 
                />
                <span className="text-[10px] font-extrabold text-[#004ac6] tracking-widest uppercase">IELTS.AI NEURAL ENGINE ACTIVE</span>
              </div>

              {/* Tested Skills list card */}
              <div className="bg-white border border-[#c3c6d7]/30 rounded-2xl p-6 shadow-md space-y-4">
                <h3 className="text-base font-extrabold text-[#131b2e] border-b border-slate-100 pb-2">Tested Skills</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Grammar', desc: 'Syntax accuracy & structures' },
                    { label: 'Vocab', desc: 'Lexical resource & range' },
                    { label: 'Reading', desc: 'Skimming, scanning & speed' },
                    { label: 'Writing', desc: 'Coherence, cohesion & task response' }
                  ].map((s) => (
                    <div key={s.label} className="flex items-center justify-between p-3 rounded-xl hover:bg-[#faf8ff] transition-all border border-transparent hover:border-[#eaedff]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#004ac6]/5 flex items-center justify-center text-[#004ac6]">
                          {s.label === 'Grammar' && <span className="material-symbols-outlined text-[18px]">spellcheck</span>}
                          {s.label === 'Vocab' && <span className="material-symbols-outlined text-[18px]">menu_book</span>}
                          {s.label === 'Reading' && <span className="material-symbols-outlined text-[18px]">chrome_reader_mode</span>}
                          {s.label === 'Writing' && <span className="material-symbols-outlined text-[18px]">edit_note</span>}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#131b2e]">{s.label}</p>
                          <p className="text-[10px] font-semibold text-[#737686]">{s.desc}</p>
                        </div>
                      </div>
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center">
                        <Check className="h-3 w-3" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'overview':
        return (
          <motion.div
            key="overview"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8 w-full"
          >
            {/* Title / Description */}
            <div className="space-y-1">
              <h1 className="font-display-lg text-3xl font-extrabold text-[#131b2e]">Your Path to Band {user?.targetBand?.toFixed(1) || '8.5'}</h1>
              <p className="text-[#737686] text-sm font-semibold">We{"'"}ve tailored this assessment to identify your precise strengths and focus areas.</p>
            </div>

            {/* Bento Grid layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Left Bento: Circle timer progress card */}
              <div className="lg:col-span-4 glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-md">
                <div className="relative w-36 h-36 mb-6 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="72" cy="72" r="64" fill="transparent" stroke="#eaedff" strokeWidth="6" />
                    <circle cx="72" cy="72" r="64" fill="transparent" stroke="#004ac6" strokeWidth="6" strokeDasharray="402" strokeDashoffset="100" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-[#004ac6]">12</span>
                    <span className="text-[10px] text-[#737686] font-bold uppercase tracking-wider">Minutes</span>
                  </div>
                </div>
                <h3 className="font-headline-md text-base font-bold text-[#131b2e] mb-1">Estimated Time</h3>
                <p className="text-xs text-[#737686] font-semibold max-w-[150px]">Optimal duration for a baseline diagnostic score.</p>
              </div>

              {/* Right Bento: Components grid */}
              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { part: 'Part 1', label: 'Grammar', desc: 'Sentence structure and grammatical accuracy.', questions: '20 Questions', icon: 'spellcheck', borderHover: 'hover:border-blue-300', bg: 'bg-[#dbe1ff]/20', textColor: 'text-[#004ac6]' },
                  { part: 'Part 2', label: 'Vocabulary', desc: 'Lexical resource and contextual usage.', questions: '20 Questions', icon: 'menu_book', borderHover: 'hover:border-emerald-300', bg: 'bg-[#6ffbbe]/15', textColor: 'text-[#006242]' },
                  { part: 'Part 3', label: 'Reading', desc: 'Scanning, skimming, and comprehension.', questions: '1 Academic Passage', icon: 'chrome_reader_mode', borderHover: 'hover:border-slate-350', bg: 'bg-[#d5e4f8]/30', textColor: 'text-[#516070]' },
                  { part: 'Part 4', label: 'Writing', desc: 'Coherence, cohesion, and task response.', questions: '1 Critical Essay', icon: 'edit_note', borderHover: 'hover:border-rose-300', bg: 'bg-rose-50', textColor: 'text-rose-600' }
                ].map((item) => (
                  <div key={item.label} className={`glass-card p-4 rounded-xl flex flex-col justify-between border border-transparent transition-all duration-300 ${item.borderHover} hover:shadow-sm`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center ${item.textColor}`}>
                        <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                      </div>
                      <span className={`text-[10px] font-bold ${item.bg} ${item.textColor} px-2.5 py-0.5 rounded-full`}>{item.part}</span>
                    </div>
                    <div>
                      <h4 className="font-headline-md text-sm font-bold text-[#131b2e]">{item.label}</h4>
                      <p className="text-[11px] font-semibold text-[#737686] mt-1 mb-4 leading-normal">{item.desc}</p>
                      <div className="flex items-center gap-1.5 text-[#737686] text-[10px] font-bold uppercase tracking-wider">
                        <span className="material-symbols-outlined text-[14px]">assignment</span>
                        <span>{item.questions}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Assessment Action Section */}
            <div className="flex flex-col md:flex-row items-center justify-between bg-white border border-[#c3c6d7]/30 rounded-2xl p-6 gap-6 shadow-sm">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-[#131b2e]">Ready to begin?</h4>
                <p className="text-xs text-[#737686] font-semibold">Ensure you are in a quiet environment for the best results.</p>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full md:w-auto px-6 py-3 border border-[#c3c6d7] hover:bg-slate-50 transition-colors text-xs font-bold rounded-full text-[#434655] cursor-pointer text-center"
                >
                  I{"'"}ll do it later
                </button>
                <button
                  onClick={() => handleTransitionToTab('grammar')}
                  className="w-full md:w-auto px-8 py-3 bg-[#004ac6] text-white hover:bg-[#003ea8] hover:shadow-md transition-all text-xs font-bold rounded-full flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Start Assessment</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Pro Tip Banner */}
            <div className="bg-gradient-to-r from-[#eaedff] to-white border border-[#c3c6d7]/20 rounded-2xl p-5 flex flex-col md:flex-row items-center gap-6 shadow-sm overflow-hidden relative">
              <div className="space-y-1 flex-1 relative z-10">
                <span className="bg-[#2563eb] text-white font-bold text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">Pro Tip</span>
                <h4 className="text-sm font-bold text-[#131b2e] pt-1">Focus on accuracy over speed for Part 1.</h4>
                <p className="text-[11px] text-[#737686] font-semibold">
                  Grammatical correctness forms the bedrock of a Band 8.0 score. Re-read sentences before submitting.
                </p>
              </div>
              <div className="w-full md:w-36 h-20 shrink-0 relative flex items-center justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=300&q=80" 
                  alt="Laptop displaying test setup on office workspace desk" 
                  className="w-full h-full object-cover rounded-xl border border-slate-100 shadow-sm" 
                />
              </div>
            </div>
          </motion.div>
        );

      case 'grammar': {
        const q = grammarQuestions[currentGrammarIndex];
        const selectedOpt = grammarAnswers[q.id];
        const progressPercentage = Math.round(((currentGrammarIndex + 1) / grammarQuestions.length) * 100);

        return (
          <motion.div
            key={`grammar-${currentGrammarIndex}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8 w-full max-w-2xl"
          >
            {/* Progress Section */}
            <div className="w-full">
              <div className="flex justify-between items-end mb-3">
                <div>
                  <span className="text-[#004ac6] font-bold text-xs uppercase tracking-widest">Section: Grammar Mastery</span>
                  <h3 className="font-headline-md text-lg font-bold text-[#131b2e] mt-1">Question {currentGrammarIndex + 1} of {grammarQuestions.length}</h3>
                </div>
                <span className="text-xs font-bold text-[#737686] bg-slate-100 px-3 py-1 rounded-full">{progressPercentage}% Complete</span>
              </div>
              <div className="h-2 w-full bg-[#eaedff] rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-gradient-to-r from-[#3B82F6] to-[#2563EB] transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
              </div>
            </div>

            {/* Question Card */}
            <div className="glass-card rounded-2xl p-6 lg:p-8 relative overflow-hidden border border-[#c3c6d7]/35 shadow-xl">
              <div className="absolute inset-0 dot-grid rounded-2xl pointer-events-none"></div>
              
              <div className="mb-8">
                <span className="text-[#516070] font-bold text-xs uppercase tracking-wider mb-2 block">{q.category}</span>
                <h2 className="font-headline-lg text-lg lg:text-xl font-extrabold text-[#131b2e] leading-snug">
                  {q.question}
                </h2>
              </div>

              {/* Options */}
              <div className="space-y-4">
                {Object.entries(q.options).map(([key, val]) => {
                  const isOptSelected = selectedOpt === key;
                  return (
                    <button
                      key={key}
                      onClick={() => handleSelectGrammar(q.id, key)}
                      className={`option-card w-full text-left p-4 rounded-xl border flex items-center gap-4 group cursor-pointer transition-all duration-200 ${
                        isOptSelected 
                          ? 'border-[#2563eb] bg-[#2563eb] text-white shadow-lg' 
                          : 'border-[#c3c6d7]/35 bg-white hover:border-[#2563eb] hover:bg-[#2563eb]/5'
                      }`}
                    >
                      <span className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-colors ${
                        isOptSelected 
                          ? 'border-white bg-white/20 text-white' 
                          : 'border-[#c3c6d7]/60 group-hover:border-[#2563eb] text-[#737686] group-hover:text-[#2563eb]'
                      }`}>
                        {key}
                      </span>
                      <span className="text-sm font-semibold">{val}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between items-center w-full">
              <button
                onClick={() => {
                  if (currentGrammarIndex > 0) {
                    setCurrentGrammarIndex(prev => prev - 1);
                  } else {
                    handleTransitionToTab('overview');
                  }
                }}
                className="flex items-center gap-1.5 px-6 py-3 rounded-xl font-bold text-xs text-[#737686] hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </button>

              <div className="hidden md:flex gap-1.5">
                {grammarQuestions.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      idx === currentGrammarIndex ? 'bg-[#004ac6] w-4' : 'bg-slate-200'
                    }`} 
                  />
                ))}
              </div>

              <button
                onClick={() => {
                  if (!selectedOpt) {
                    toast.error('Please select an option to proceed');
                    return;
                  }
                  if (currentGrammarIndex < grammarQuestions.length - 1) {
                    setCurrentGrammarIndex(prev => prev + 1);
                  } else {
                    handleTransitionToTab('vocab');
                  }
                }}
                className="px-8 py-3 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white flex items-center gap-1.5 rounded-xl font-bold text-xs shadow-md shadow-[#2563eb]/20 active:scale-95 hover:scale-[1.02] transition-all cursor-pointer"
              >
                Next Question
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Focus Mode Indicator */}
            <div className="flex justify-center items-center gap-2 text-[#737686] opacity-60 text-[10px] uppercase font-extrabold tracking-wider mt-4">
              <EyeOff className="h-3.5 w-3.5" />
              <span>Focus Mode Active: All notifications silenced</span>
            </div>
          </motion.div>
        );
      }

      case 'vocab': {
        const q = vocabQuestions[currentVocabIndex];
        const selectedOpt = vocabAnswers[q.id];
        const progressPercentage = Math.round(((currentVocabIndex + 1) / vocabQuestions.length) * 100);

        return (
          <motion.div
            key={`vocab-${currentVocabIndex}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8 w-full max-w-3xl"
          >
            {/* Progress Section */}
            <div className="w-full">
              <div className="flex justify-between items-end mb-3">
                <div>
                  <span className="text-[#004ac6] font-bold text-xs uppercase tracking-widest">Vocabulary Proficiency</span>
                  <h3 className="font-headline-md text-lg font-bold text-[#131b2e] mt-1">Step {currentVocabIndex + 1} of {vocabQuestions.length}</h3>
                </div>
                <span className="text-xs font-bold text-[#737686] bg-slate-100 px-3 py-1 rounded-full">{progressPercentage}% Complete</span>
              </div>
              <div className="h-2 w-full bg-[#eaedff] rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-gradient-to-r from-[#3B82F6] to-[#2563EB] transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
              </div>
            </div>

            {/* Question Card */}
            <div className="glass-card rounded-2xl p-6 lg:p-10 relative overflow-hidden border border-[#c3c6d7]/35 shadow-xl">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#004ac6]"></div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#6ffbbe]/15 text-[#006242] rounded-full text-[10px] font-bold uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[14px]">psychology</span>
                    {q.category}
                  </span>
                  
                  <h2 className="font-headline-lg text-lg lg:text-xl font-extrabold text-[#131b2e] leading-snug">
                    {q.question}
                  </h2>
                </div>

                {/* Contextual Sentence Box */}
                {q.sentence && (
                  <div className="p-4 bg-slate-50 border border-[#c3c6d7]/30 rounded-xl italic text-xs font-semibold text-[#434655]/95 leading-relaxed">
                    {q.sentence}
                  </div>
                )}

                {/* Grid Choices */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(q.options).map(([key, val]) => {
                    const isOptSelected = selectedOpt === key;
                    return (
                      <button
                        key={key}
                        onClick={() => handleSelectVocab(q.id, key)}
                        className={`group relative w-full text-left p-5 rounded-xl border transition-all duration-300 cursor-pointer active:scale-[0.98] ${
                          isOptSelected 
                            ? 'border-[#2563eb] bg-white shadow-xl shadow-indigo-600/5' 
                            : 'border-[#c3c6d7]/30 bg-white/50 hover:bg-white hover:border-[#2563eb] hover:shadow-xl hover:shadow-indigo-600/5'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className={`font-label-sm text-[10px] font-bold transition-colors ${
                            isOptSelected ? 'text-[#2563eb]' : 'text-[#737686] group-hover:text-[#2563eb]'
                          }`}>
                            OPTION {key}
                          </span>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            isOptSelected ? 'border-[#2563eb]' : 'border-[#c3c6d7] group-hover:border-[#2563eb]'
                          }`}>
                            <div className={`w-2.5 h-2.5 rounded-full bg-[#2563eb] transition-opacity duration-300 ${
                              isOptSelected ? 'opacity-100' : 'opacity-0'
                            }`} />
                          </div>
                        </div>

                        <span className={`font-headline-md text-base font-extrabold transition-colors ${
                          isOptSelected ? 'text-[#2563eb]' : 'text-[#131b2e] group-hover:text-[#2563eb]'
                        }`}>
                          {val.title}
                        </span>
                        <p className="mt-2 text-[11px] font-semibold text-[#737686] leading-relaxed">
                          {val.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  if (currentVocabIndex > 0) {
                    setCurrentVocabIndex(prev => prev - 1);
                  } else {
                    handleTransitionToTab('grammar');
                  }
                }}
                className="flex items-center gap-1.5 px-6 py-3 font-bold text-xs text-[#737686] hover:text-[#004ac6] transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous Question
              </button>

              <div className="flex gap-4 w-full sm:w-auto">
                <button
                  onClick={() => {
                    if (currentVocabIndex < vocabQuestions.length - 1) {
                      setCurrentVocabIndex(prev => prev + 1);
                    } else {
                      handleTransitionToTab('reading');
                    }
                  }}
                  className="flex-1 sm:flex-none px-6 py-3 bg-white border border-[#c3c6d7] text-[#737686] font-bold text-xs rounded-full hover:bg-slate-50 transition-all active:scale-95 cursor-pointer text-center"
                >
                  Skip Question
                </button>
                <button
                  onClick={() => {
                    if (!selectedOpt) {
                      toast.error('Please select an option to confirm');
                      return;
                    }
                    if (currentVocabIndex < vocabQuestions.length - 1) {
                      setCurrentVocabIndex(prev => prev + 1);
                    } else {
                      handleTransitionToTab('reading');
                    }
                  }}
                  disabled={!selectedOpt}
                  className={`flex-1 sm:flex-none px-10 py-3 text-white rounded-full font-bold text-xs transition-all active:scale-95 cursor-pointer text-center ${
                    selectedOpt 
                      ? 'bg-gradient-to-r from-[#3B82F6] to-[#2563EB] shadow-lg shadow-[#2563eb]/20 hover:shadow-[#2563eb]/45' 
                      : 'bg-slate-200 text-[#737686] opacity-50 cursor-not-allowed'
                  }`}
                >
                  Confirm & Next
                </button>
              </div>
            </div>

            {/* Tip Bento Box */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-12">
              <div className="md:col-span-8 glass-card rounded-2xl p-6 flex items-center gap-6 shadow-md border border-[#c3c6d7]/35">
                <div className="h-14 w-14 shrink-0 bg-[#004ac6]/10 rounded-2xl flex items-center justify-center text-[#004ac6]">
                  <span className="material-symbols-outlined text-3xl">lightbulb</span>
                </div>
                <div>
                  <h4 className="font-headline-md text-sm font-bold text-[#131b2e]">Pro Tip: Tone of Voice</h4>
                  <p className="text-[11px] font-semibold text-[#737686] mt-1 leading-normal">
                    In IELTS Reading, context often reveals if a word is positive, negative, or neutral. {q.word === 'Meticulous' ? '"Meticulous" is almost always used as a compliment in professional settings.' : 'Read the surrounding sentences to determine context tone.'}
                  </p>
                </div>
              </div>

              <div className="md:col-span-4 glass-card rounded-2xl p-6 flex flex-col justify-center text-center shadow-md border border-[#c3c6d7]/35">
                <div className="font-display-lg text-[#004ac6] text-4xl font-extrabold mb-1">94%</div>
                <p className="text-[10px] font-bold text-[#737686] uppercase tracking-wider">Users answered correctly</p>
              </div>
            </div>
          </motion.div>
        );
      }

      case 'reading':
        return (
          <motion.div
            key="reading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-grow flex flex-col w-full h-[calc(100vh-4rem)] overflow-hidden"
          >
            {/* Split Content Pane */}
            <div className="flex flex-1 overflow-hidden h-full">
              
              {/* Left Pane: Reading Passage */}
              <section className="w-1/2 flex flex-col border-r border-[#c3c6d7]/40 bg-white relative h-full overflow-hidden">
                <div className="p-6 pb-4 flex justify-between items-end border-b border-[#c3c6d7]/10 shrink-0">
                  <div>
                    <h2 className="font-headline-lg text-xl font-bold text-[#131b2e]">The Rise of Cognitive Automation</h2>
                    <p className="text-[#737686] text-[10px] font-bold uppercase tracking-wider mt-0.5">Passage 1 | Time recommended: 20 minutes</p>
                  </div>
                  <button
                    onClick={() => {
                      setHighlightToggle(prev => !prev);
                      toast.success(highlightToggle ? 'Highlight Tool Disabled' : 'Highlight Tool Enabled: Click and select text inside the passage to draw highlights.', { id: 'highlight-tool' });
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all cursor-pointer uppercase ${
                      highlightToggle 
                        ? 'bg-amber-100 border-amber-300 text-amber-800' 
                        : 'border-[#c3c6d7]/35 text-[#004ac6] hover:bg-slate-50'
                    }`}
                  >
                    <Brush className="h-3.5 w-3.5" />
                    <span>Highlight Tool</span>
                  </button>
                </div>

                {/* Passage Text */}
                <div className={`flex-1 overflow-y-auto px-6 py-6 space-y-6 text-sm leading-relaxed text-[#131b2e]/90 select-text ${
                  highlightToggle ? 'selection:bg-yellow-200' : 'selection:bg-[#004ac6]/10'
                }`}>
                  <p>
                    <span className="font-bold text-[#004ac6] mr-1">A.</span> Cognitive automation represents the intersection of traditional robotic process automation (RPA) and artificial intelligence. Unlike its predecessor, which primarily handled repetitive, rule-based tasks, cognitive automation is designed to mimic human thought patterns. It leverages machine learning, natural language processing, and pattern recognition to manage complex data sets and make semi-autonomous decisions. This shift marks a significant milestone in the Fourth Industrial Revolution.
                  </p>

                  <p>
                    <span className="font-bold text-[#004ac6] mr-1">B.</span> One of the most compelling applications of this technology is found in the financial sector. Analysts are increasingly using sophisticated algorithms to scan thousands of regulatory documents and market reports in seconds. Where a human team might take weeks to identify a potential risk factor, these systems can highlight anomalies in real-time, providing a competitive edge that was previously unimaginable.
                  </p>

                  {/* Inline Illustration Image */}
                  <div className="my-6 rounded-2xl overflow-hidden border border-[#c3c6d7]/20 shadow-md">
                    <img 
                      src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80" 
                      alt="Modern computer workplace setup visualizing corporate artificial intelligence" 
                      className="w-full h-48 object-cover" 
                    />
                  </div>

                  <p>
                    <span className="font-bold text-[#004ac6] mr-1">C.</span> However, the integration of such advanced systems is not without its limitations. Educators and academics have raised critical questions about the impact of automated reasoning tools on learning environments. Specifically, concerns regarding algorithmic biases in grading templates and the potential erosion of independent critical reasoning skills prompt institutions to remain highly cautious before roll-outs.
                  </p>
                </div>
              </section>

              {/* Right Pane: Reading Questions */}
              <section className="w-1/2 flex flex-col bg-[#faf8ff] h-full overflow-hidden">
                <div className="flex-grow overflow-y-auto p-6 space-y-6">
                  
                  {/* Instructions Header */}
                  <div className="space-y-1">
                    <h3 className="text-base font-extrabold text-[#131b2e]">Questions 1–5</h3>
                    <p className="text-xs text-[#737686] font-semibold">Complete the answers on the right by reviewing the passage details on the left.</p>
                  </div>

                  {/* Questions 1-3 (Matching Dropdowns) */}
                  <div className="bg-white border border-[#c3c6d7]/35 rounded-2xl p-5 shadow-sm space-y-4">
                    <div className="bg-[#eaedff]/40 border border-[#004ac6]/10 p-3.5 rounded-xl">
                      <span className="text-[10px] font-black text-[#004ac6] uppercase tracking-wider block mb-1">Instructions</span>
                      <p className="text-xs font-semibold text-[#434655]">
                        Which paragraph contains the following information? Choose the correct letter (A–C) from the dropdown select list.
                      </p>
                    </div>

                    {[
                      { id: 'q1', text: '1. A reference to educational doubts associated with AI algorithms.' },
                      { id: 'q2', text: '2. The core definitions of cognitive automation and RPA.' },
                      { id: 'q3', text: '3. A description of real-time data inspection in financial models.' }
                    ].map((item) => (
                      <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                        <span className="text-xs font-bold text-[#131b2e] leading-snug">{item.text}</span>
                        <select
                          value={readingAnswers[item.id] || ''}
                          onChange={(e) => setReadingAnswers(prev => ({ ...prev, [item.id]: e.target.value }))}
                          className="bg-slate-50 border border-[#c3c6d7]/60 text-xs font-bold rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#2563eb] text-[#434655] cursor-pointer"
                        >
                          <option value="">-</option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                        </select>
                      </div>
                    ))}
                  </div>

                  {/* Questions 4-5 (Text Inputs) */}
                  <div className="bg-white border border-[#c3c6d7]/35 rounded-2xl p-5 shadow-sm space-y-4">
                    <div className="bg-[#eaedff]/40 border border-[#004ac6]/10 p-3.5 rounded-xl">
                      <span className="text-[10px] font-black text-[#004ac6] uppercase tracking-wider block mb-1">Instructions</span>
                      <p className="text-xs font-semibold text-[#434655]">
                        Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.
                      </p>
                    </div>

                    <div className="space-y-4 text-xs font-semibold text-[#434655]">
                      <div className="space-y-2">
                        <p className="leading-relaxed">
                          4. Cognitive automation utilizes natural language processing and <span className="text-[#004ac6] font-bold">________</span> to manage complex data sets.
                        </p>
                        <input
                          type="text"
                          placeholder="your answer"
                          value={readingAnswers['q4'] || ''}
                          onChange={(e) => setReadingAnswers(prev => ({ ...prev, q4: e.target.value }))}
                          className="w-full max-w-xs rounded-lg border border-[#c3c6d7]/60 bg-slate-50 px-3 py-2 text-xs font-bold focus:outline-none focus:border-[#2563eb]"
                        />
                      </div>

                      <div className="space-y-2">
                        <p className="leading-relaxed">
                          5. Academic critics are concerned about the erosion of independent <span className="text-[#004ac6] font-bold">________</span> skills.
                        </p>
                        <input
                          type="text"
                          placeholder="your answer"
                          value={readingAnswers['q5'] || ''}
                          onChange={(e) => setReadingAnswers(prev => ({ ...prev, q5: e.target.value }))}
                          className="w-full max-w-xs rounded-lg border border-[#c3c6d7]/60 bg-slate-50 px-3 py-2 text-xs font-bold focus:outline-none focus:border-[#2563eb]"
                        />
                      </div>
                    </div>
                  </div>

                </div>

                {/* Footer Controls */}
                <div className="p-4 bg-white border-t border-[#c3c6d7]/20 flex justify-between items-center shrink-0">
                  <button
                    onClick={() => handleTransitionToTab('vocab')}
                    className="flex items-center gap-1.5 px-6 py-2.5 rounded-lg border border-[#c3c6d7] text-xs font-bold text-[#737686] hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                  <button
                    onClick={() => handleTransitionToTab('writing')}
                    className="px-8 py-2.5 bg-[#004ac6] text-white font-bold text-xs rounded-lg shadow-md hover:bg-[#003ea8] active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    Next Section
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </section>

            </div>
          </motion.div>
        );

      case 'writing': {
        const wordCount = getWordCount(writingSubmission);
        return (
          <motion.div
            key="writing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-grow flex flex-col w-full h-[calc(100vh-4rem)] overflow-hidden"
          >
            <div className="flex flex-1 overflow-hidden h-full">
              
              {/* Left Pane: Prompt */}
              <section className="w-2/5 flex flex-col border-r border-[#c3c6d7]/40 bg-white p-6 relative overflow-y-auto justify-between">
                <div className="space-y-6">
                  <span className="inline-flex items-center px-3.5 py-1 bg-teal-50 text-teal-700 border border-teal-100 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    Academic Writing Task 2
                  </span>
                  
                  <h2 className="font-display-lg text-lg lg:text-xl font-extrabold text-[#131b2e]">
                    The Impact of AI on Global Employment
                  </h2>

                  <div className="space-y-4 text-xs font-semibold text-[#434655] leading-relaxed">
                    <p>
                      Some people believe that artificial intelligence will eventually replace human workers in almost all industries, leading to mass unemployment. Others argue that AI will create new types of jobs and enhance human productivity.
                    </p>
                    <p className="font-bold text-[#131b2e] border-l-2 border-[#2563eb] pl-3">
                      Discuss both views and give your own opinion. Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.
                    </p>
                  </div>
                </div>

                {/* Writing Tip bottom box */}
                <div className="glass-card rounded-2xl p-4 border border-[#c3c6d7]/35 flex items-start gap-4 shadow-sm mt-8">
                  <div className="bg-[#004ac6]/10 p-2 rounded-xl text-[#004ac6]">
                    <span className="material-symbols-outlined text-[20px] flex items-center justify-center">lightbulb</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#131b2e]">Tip: Structure your essay</h4>
                    <p className="text-[10px] font-semibold text-[#737686] mt-0.5 leading-relaxed">
                      Ensure you structure your essay with a clear introduction, two balanced body paragraphs representing both sides, and a strong conclusion.
                    </p>
                  </div>
                </div>
              </section>

              {/* Right Pane: Drafting Workspace */}
              <section className="w-3/5 flex flex-col bg-[#faf8ff] h-full overflow-hidden">
                
                {/* Editor Header Tools */}
                <div className="p-4 bg-white border-b border-[#c3c6d7]/10 flex justify-between items-center shrink-0">
                  <div className="flex gap-2">
                    <button
                      onClick={handleUndo}
                      disabled={historyIndex <= 0}
                      className="p-2 rounded-lg border border-[#c3c6d7]/50 text-[#737686] hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Undo"
                    >
                      <Undo2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleRedo}
                      disabled={historyIndex >= writingHistory.length - 1}
                      className="p-2 rounded-lg border border-[#c3c6d7]/50 text-[#737686] hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Redo"
                    >
                      <Redo2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold text-[#737686] uppercase tracking-wider">Drafting Essay</span>
                    <span className="flex items-center gap-1 text-[9px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-2 py-0.5">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                      Autosaved just now
                    </span>
                  </div>
                </div>

                {/* Drafting Textarea */}
                <div className="flex-1 p-6 flex flex-col">
                  <textarea
                    value={writingSubmission}
                    onChange={(e) => handleWritingChange(e.target.value)}
                    placeholder="Start writing your essay here..."
                    className="w-full flex-grow bg-white border border-[#c3c6d7]/35 rounded-2xl p-6 text-sm text-[#131b2e] leading-relaxed placeholder-slate-400 focus:outline-none focus:border-[#2563eb] shadow-sm resize-none font-semibold"
                  />
                </div>

                {/* Workspace footer actions */}
                <div className="p-4 bg-white border-t border-[#c3c6d7]/20 flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#434655]">
                    <span>Word Count:</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                      wordCount >= 250 ? 'bg-emerald-500/10 text-emerald-700' : 'bg-slate-100 text-[#737686]'
                    }`}>
                      {wordCount} / 250 min
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => toast.success('Essay draft saved to dashboard drafts!')}
                      className="px-6 py-2.5 bg-white border border-[#c3c6d7] text-xs font-bold rounded-full text-[#434655] hover:bg-slate-50 transition-all active:scale-95 cursor-pointer text-center"
                    >
                      Save as Draft
                    </button>
                    <button
                      onClick={handleSubmitTest}
                      className="px-8 py-2.5 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white font-bold text-xs rounded-full shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Submit Task</span>
                      <CheckCircle2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

              </section>

            </div>
          </motion.div>
        );
      }

      case 'evaluating':
        return (
          <motion.div
            key="evaluating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-4xl px-4 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center relative z-10"
          >
            {/* Ambient Background decoration */}
            <div className="absolute inset-0 bg-[#004ac6]/5 rounded-full blur-[100px] scale-150 animate-pulse pointer-events-none -z-10"></div>
            
            {/* Animated Brain Orb */}
            <div className="relative mb-8 group shrink-0">
              <div className="absolute inset-0 bg-[#004ac6]/20 blur-[100px] rounded-full scale-150 animate-pulse"></div>
              <div className="absolute inset-0 bg-[#006242]/10 blur-[60px] rounded-full translate-x-12 translate-y-8"></div>
              
              <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center glass-card rounded-full border-[#004ac6]/20 pulse-core shadow-2xl">
                <div className="absolute inset-4 rounded-full border border-dashed border-[#004ac6]/30 animate-[spin_20s_linear_infinite]"></div>
                <div className="absolute inset-8 rounded-full border border-[#004ac6]/10 animate-[spin_10s_linear_infinite_reverse]"></div>
                
                <div className="relative z-20 flex flex-col items-center">
                  <span className="material-symbols-outlined text-[#004ac6] text-[80px] md:text-[100px] select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                    psychology
                  </span>
                  <div className="mt-4 flex gap-1 justify-center">
                    <div className="w-1.5 h-1.5 bg-[#004ac6] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1.5 h-1.5 bg-[#004ac6] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-[#004ac6] rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>

              {/* Floating tags */}
              <div className="absolute -top-4 -right-8 glass-card px-4 py-2 rounded-xl flex items-center gap-2 border-white/40 shadow-xl animate-bounce [animation-duration:4s]">
                <span className="material-symbols-outlined text-[#004ac6] text-xs">spellcheck</span>
                <span className="text-[10px] font-bold text-[#131b2e]">Grammar Matrix</span>
              </div>
              <div className="absolute top-1/2 -left-16 glass-card px-4 py-2 rounded-xl flex items-center gap-2 border-white/40 shadow-xl animate-bounce [animation-duration:5s] [animation-delay:1s]">
                <span className="material-symbols-outlined text-[#006242] text-xs">auto_awesome</span>
                <span className="text-[10px] font-bold text-[#131b2e]">Cohesion Flow</span>
              </div>
              <div className="absolute bottom-0 -right-8 glass-card px-4 py-2 rounded-xl flex items-center gap-2 border-white/40 shadow-xl animate-bounce [animation-duration:3.5s] [animation-delay:0.5s]">
                <span className="material-symbols-outlined text-rose-500 text-xs">equalizer</span>
                <span className="text-[10px] font-bold text-[#131b2e]">CEFR Calibration</span>
              </div>
            </div>

            {/* Titles */}
            <div className="space-y-2 mb-8">
              <h1 className="font-display-lg text-2xl md:text-3xl font-extrabold text-[#131b2e] leading-snug">
                Fine-tuning your evaluation
              </h1>
              <p className="text-xs text-[#737686] font-semibold max-w-sm mx-auto">
                Our AI model is cross-referencing your speech patterns against 100k+ band-certified exam responses.
              </p>
            </div>

            {/* Progress checklist items */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl text-left">
              <div className="glass-card p-4 rounded-xl flex items-center justify-between border border-[#c3c6d7]/35 shadow-sm bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-55/40 text-emerald-600 flex items-center justify-center">
                    <Check className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-xs font-bold text-[#131b2e]">Analyzing Grammar...</span>
                </div>
                <span className="text-xs font-black text-[#004ac6]">100%</span>
              </div>

              <div className="glass-card p-4 rounded-xl flex items-center justify-between border border-[#c3c6d7]/35 shadow-sm bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-55/40 text-emerald-600 flex items-center justify-center">
                    <Check className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-xs font-bold text-[#131b2e]">Vocabulary Range</span>
                </div>
                <span className="text-xs font-black text-[#004ac6]">100%</span>
              </div>

              <div className="glass-card p-4 rounded-xl flex items-center justify-between border-[#004ac6]/30 bg-slate-50 col-span-1 md:col-span-2 shadow-inner">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#004ac6] text-white flex items-center justify-center animate-pulse">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#004ac6]">Estimating CEFR Level...</span>
                    <span className="text-[9px] font-black uppercase text-[#737686]">Step 13 in progress</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#004ac6] transition-all duration-300" style={{ width: `${evalProgress}%` }}></div>
                  </div>
                  <span className="text-xs font-black text-[#004ac6] tabular-nums">{evalProgress}%</span>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'result': {
        const estimatedScore = evaluationResult?.estimatedBand || 6.5;
        const cefr = evaluationResult?.cefrLevel || 'B1';
        // Compute offset value for progress circle (radius 42, circumference ~263.89)
        const circumference = 2 * Math.PI * 42;
        const strokeDashoffset = circumference - (estimatedScore / 9.0) * circumference;

        return (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8 w-full max-w-5xl"
          >
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#c3c6d7]/20">
              <div className="space-y-2">
                <span className="inline-flex items-center px-3 py-1 bg-[#006242]/10 text-[#006242] border border-[#006242]/15 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Step 14 of 15 • Assessment Complete
                </span>
                <h1 className="font-display-lg text-3xl font-extrabold text-[#131b2e]">Congratulations 🎉</h1>
                <p className="text-sm font-semibold text-[#737686] max-w-lg leading-relaxed">
                  Your IELTS baseline has been established. You{"'"}re closer to your goal than you think.
                </p>
              </div>
              <button
                onClick={() => router.push('/onboarding')}
                className="w-full md:w-auto px-8 py-4 bg-gradient-to-b from-[#3B82F6] to-[#2563EB] text-white font-bold text-sm rounded-full shadow-[0_12px_24px_-8px_rgba(37,99,235,0.4)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border-t border-white/20"
              >
                Next: Set Study Goals
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>

            {/* Bento Grid Results */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
              
              {/* Estimated Band Score (Col 4) */}
              <div className="md:col-span-4 glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-md relative overflow-hidden border border-[#c3c6d7]/35 min-h-[350px]">
                <div className="absolute inset-0 dot-grid pointer-events-none"></div>
                <h3 className="font-label-sm text-[10px] font-black text-[#737686] uppercase tracking-widest mb-6">Estimated Band Score</h3>
                
                <div className="relative w-44 h-44">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="transparent" stroke="#eaedff" strokeWidth="6" />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="42" 
                      fill="transparent" 
                      stroke="#004ac6" 
                      strokeWidth="6" 
                      strokeDasharray={circumference} 
                      strokeDashoffset={strokeDashoffset} 
                      strokeLinecap="round" 
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black text-[#004ac6]">{estimatedScore.toFixed(1)}</span>
                    <span className="text-[10px] font-bold text-[#737686] mt-0.5">
                      {estimatedScore >= 8.0 ? 'Expert User' : 
                       estimatedScore >= 7.0 ? 'Good User' : 
                       estimatedScore >= 6.0 ? 'Competent User' : 'Moderate User'}
                    </span>
                  </div>
                </div>

                <p className="mt-6 text-xs text-[#737686] font-semibold px-4">
                  You{"'"}re at the upper end of {estimatedScore.toFixed(1)}. A focused 4-week plan can push you to {(estimatedScore + 1.0).toFixed(1)}.
                </p>
              </div>

              {/* Radar Proficiency Breakdown (Col 8) */}
              <div className="md:col-span-8 glass-card rounded-2xl p-6 shadow-md relative border border-[#c3c6d7]/35">
                <div className="absolute inset-0 dot-grid pointer-events-none"></div>
                
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-headline-md text-base font-bold text-[#131b2e]">Proficiency Breakdown</h3>
                    <p className="text-[10px] font-bold text-[#737686] uppercase tracking-wider mt-0.5">Stripe-style visualized skill distribution</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-[#004ac6] rounded-full"></span>
                    <span className="text-[10px] font-black text-[#737686] uppercase tracking-wider">Current Skills</span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Radar Diagram SVG */}
                  <div className="relative w-52 h-52 shrink-0">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
                      <circle cx="50" cy="50" r="30" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
                      <circle cx="50" cy="50" r="20" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
                      <circle cx="50" cy="50" r="10" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
                      
                      <line x1="50" y1="10" x2="50" y2="90" stroke="#e2e8f0" strokeWidth="0.5" />
                      <line x1="10" y1="50" x2="90" y2="50" stroke="#e2e8f0" strokeWidth="0.5" />
                      
                      {/* Points: Reading, Vocab, Writing, Grammar */}
                      <polygon 
                        points={`50,${50 - 40 * (getReadingScore() / 100)} ${50 + 40 * (getVocabScore() / 100)},50 50,${50 + 40 * (getWritingScore() / 100)} ${50 - 40 * (getGrammarScore() / 100)},50`} 
                        fill="rgba(37, 99, 235, 0.15)" 
                        stroke="#2563eb" 
                        strokeWidth="1.5" 
                      />
                      
                      <text x="50" y="6" textAnchor="middle" className="text-[5px] font-bold fill-slate-500">READING</text>
                      <text x="96" y="52" textAnchor="middle" className="text-[5px] font-bold fill-slate-500">VOCABULARY</text>
                      <text x="50" y="98" textAnchor="middle" className="text-[5px] font-bold fill-slate-500">WRITING</text>
                      <text x="4" y="52" textAnchor="middle" className="text-[5px] font-bold fill-slate-500">GRAMMAR</text>
                    </svg>
                  </div>

                  {/* Recommendations */}
                  <div className="flex-grow w-full space-y-4">
                    {(evaluationResult?.strengths?.length 
                      ? evaluationResult.strengths 
                      : (getReadingScore() >= 60 ? ['Good text skimming speed', 'Solid key-matching accuracy'] : ['Good basic comprehension effort', 'Clear intent focus'])
                    ).slice(0, 2).map((strength: string, idx: number) => (
                      <div key={`str-${idx}`} className="p-4 bg-[#006242]/5 border border-[#006242]/10 rounded-xl flex items-start gap-3">
                        <TrendingUp className="h-5 w-5 text-[#006242] shrink-0" />
                        <div>
                          <h4 className="text-xs font-bold text-[#006242]">Strength: {idx === 0 ? 'Primary' : 'Secondary'}</h4>
                          <p className="text-[10px] font-semibold text-[#737686] mt-0.5 leading-normal">
                            {strength}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {(evaluationResult?.weaknesses?.length 
                      ? evaluationResult.weaknesses 
                      : (getGrammarScore() < 60 ? ['Inconsistent syntax constructions', 'Frequent complex verb errors'] : ['Vocabulary range needs extension', 'Lack of academic sentence links'])
                    ).slice(0, 2).map((weakness: string, idx: number) => (
                      <div key={`weak-${idx}`} className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3">
                        <Sparkles className="h-5 w-5 text-rose-500 shrink-0" />
                        <div>
                          <h4 className="text-xs font-bold text-rose-600">Growth Area: {idx === 0 ? 'Primary' : 'Secondary'}</h4>
                          <p className="text-[10px] font-semibold text-[#737686] mt-0.5 leading-normal">
                            {weakness}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CEFR Indicator (Col 3) */}
              <div className="md:col-span-3 glass-card rounded-2xl p-6 shadow-md border border-[#c3c6d7]/35 flex flex-col justify-between">
                <div>
                  <h3 className="font-label-sm text-[10px] font-black text-[#737686] uppercase tracking-widest mb-4">CEFR Level</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-display-lg text-4xl font-extrabold text-[#004ac6]">{cefr}</span>
                      <p className="text-[10px] font-bold text-[#737686] mt-0.5">
                        {cefr === 'B1' ? 'Intermediate' : cefr === 'B2' ? 'Upper Intermediate' : 'Advanced'}
                      </p>
                    </div>
                    
                    {/* stacked CEFR bar graphic */}
                    <div className="flex flex-col gap-1">
                      <div className="w-10 h-1.5 rounded-full bg-slate-200"></div>
                      <div className="w-10 h-1.5 rounded-full bg-[#004ac6] shadow-sm"></div>
                      <div className="w-10 h-1.5 rounded-full bg-slate-200"></div>
                      <div className="w-10 h-1.5 rounded-full bg-slate-200"></div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <p className="text-[10px] font-bold text-[#737686] leading-relaxed">
                    Recognized globally by universities and immigration departments.
                  </p>
                </div>
              </div>

              {/* Action Card: Roadmap preview (Col 9) */}
              <div className="md:col-span-9 glass-card rounded-2xl p-6 shadow-md border border-[#c3c6d7]/35 flex flex-col md:flex-row gap-6 items-center">
                <div className="w-16 h-16 bg-[#004ac6]/10 rounded-2xl flex items-center justify-center text-[#004ac6] shrink-0">
                  <Sparkle className="h-8 w-8 fill-current" />
                </div>
                
                <div className="flex-grow space-y-1 text-center md:text-left">
                  <h3 className="font-headline-md text-base font-bold text-[#131b2e]">Your Roadmap is Ready</h3>
                  <p className="text-xs font-semibold text-[#737686] leading-normal">
                    Based on your weaknesses in Grammar and Writing, we{"'"}ve designed a custom 60-day syllabus focusing on "Academic Task 2" and "Complex Structures".
                  </p>
                </div>

                <button
                  onClick={() => router.push('/onboarding')}
                  className="w-full md:w-auto px-6 py-3 border border-[#131b2e] hover:bg-slate-50 font-bold text-xs rounded-full flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                >
                  <ArrowRight className="h-4 w-4" />
                  <span>Configure Roadmap</span>
                </button>
              </div>

              {/* Bottom Insight Tiles */}
              {(() => {
                const avgResponseTimeVal = Math.max(15, Math.round((timeSpentSeconds || 320) / 11));
                const focusStabilityVal = Math.min(99, Math.max(70, 100 - Math.round(avgResponseTimeVal / 4)));
                const estimatedVocabRange = Math.round(getVocabScore() * 25 + 1200);

                const responseTimeStatus = avgResponseTimeVal < 30 ? 'Optimal' : avgResponseTimeVal < 60 ? 'Steady' : 'Sustained';
                const responseTimeColor = avgResponseTimeVal < 30 ? 'text-[#006242] bg-emerald-50' : 'text-amber-700 bg-amber-50';
                const focusStabilityStatus = focusStabilityVal > 85 ? 'Strong' : focusStabilityVal > 75 ? 'Stable' : 'Intermittent';
                const focusStabilityColor = focusStabilityVal > 85 ? 'text-[#006242] bg-emerald-50' : 'text-amber-700 bg-amber-50';
                const vocabRangeStatus = estimatedVocabRange > 2850 ? 'Extensive' : estimatedVocabRange > 2000 ? 'Moderate' : 'Developing';
                const vocabRangeColor = estimatedVocabRange > 2000 ? 'text-[#006242] bg-emerald-50' : 'text-rose-600 bg-rose-50';

                return (
                  <>
                    <div className="md:col-span-4 glass-card rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-[#c3c6d7]/35">
                      <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-[#737686] uppercase tracking-wider">Avg. Response Time</p>
                        <p className="text-base font-extrabold text-[#131b2e] mt-0.5">
                          {avgResponseTimeVal}s <span className={`text-[10px] font-black uppercase tracking-wider ml-1 px-2 py-0.5 rounded-full ${responseTimeColor}`}>{responseTimeStatus}</span>
                        </p>
                      </div>
                    </div>

                    <div className="md:col-span-4 glass-card rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-[#c3c6d7]/35">
                      <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg">
                        <Zap className="h-5 w-5 fill-current" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-[#737686] uppercase tracking-wider">Focus Stability</p>
                        <p className="text-base font-extrabold text-[#131b2e] mt-0.5">
                          {focusStabilityVal}% <span className={`text-[10px] font-black uppercase tracking-wider ml-1 px-2 py-0.5 rounded-full ${focusStabilityColor}`}>{focusStabilityStatus}</span>
                        </p>
                      </div>
                    </div>

                    <div className="md:col-span-4 glass-card rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-[#c3c6d7]/35">
                      <div className="p-2.5 bg-orange-50 text-orange-600 rounded-lg">
                        <Compass className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-[#737686] uppercase tracking-wider">Vocab Range</p>
                        <p className="text-base font-extrabold text-[#131b2e] mt-0.5">
                          {(estimatedVocabRange / 1000).toFixed(1)}k <span className={`text-[10px] font-black uppercase tracking-wider ml-1 px-2 py-0.5 rounded-full ${vocabRangeColor}`}>{vocabRangeStatus}</span>
                        </p>
                      </div>
                    </div>
                  </>
                );
              })()}

            </div>
          </motion.div>
        );
      }

      case 'roadmap':
        return (
          <motion.div
            key="roadmap"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-12 w-full max-w-5xl px-4"
          >
            {/* Header Text */}
            <div className="text-center space-y-3">
              <h1 className="font-display-lg text-3xl font-extrabold text-[#131b2e]">Your Path to Excellence</h1>
              <p className="text-sm font-semibold text-[#737686] max-w-xl mx-auto leading-relaxed">
                We{"'"}ve analyzed your assessment responses. Here is your personalized milestone study roadmap to achieve your target Band {user?.targetBand?.toFixed(1) || '8.0'} score in 12 weeks.
              </p>
            </div>

            {/* Content Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Metrics & Daily Routine */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Score Progression Panel */}
                <div className="glass-card rounded-2xl p-6 shadow-md border border-[#c3c6d7]/35 relative overflow-hidden">
                  <div className="absolute inset-0 dot-grid pointer-events-none"></div>
                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-bold text-[#737686] uppercase tracking-widest mb-1">Current State</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-[#131b2e]">{evaluationResult?.estimatedBand.toFixed(1) || '5.5'}</span>
                        <span className="text-xs font-semibold text-[#737686]">Band</span>
                      </div>
                    </div>

                    <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-[#004ac6] shadow-sm">
                      <TrendingUp className="h-5 w-5" />
                    </div>

                    <div className="text-right">
                      <p className="text-[9px] font-bold text-[#004ac6] uppercase tracking-widest mb-1">Target Goal</p>
                      <div className="flex items-baseline justify-end gap-1">
                        <span className="text-3xl font-black text-[#004ac6]">{user?.targetBand?.toFixed(1) || '8.0'}</span>
                        <span className="text-xs font-semibold text-[#004ac6]">Band</span>
                      </div>
                    </div>
                  </div>

                  {/* Core indicators */}
                  <div className="space-y-4 mt-8 pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-4 p-3 bg-[#004ac6]/5 border border-[#004ac6]/10 rounded-xl">
                      <Calendar className="h-5 w-5 text-[#004ac6] shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-[#131b2e]">Estimated Timeline</p>
                        <p className="text-[10px] font-semibold text-[#737686] mt-0.5">12 Weeks • 84 Daily Sessions</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-3 bg-[#006242]/5 border border-[#006242]/10 rounded-xl">
                      <Clock className="h-5 w-5 text-[#006242] shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-[#131b2e]">Daily Commitment</p>
                        <p className="text-[10px] font-semibold text-[#737686] mt-0.5">45 - 60 Minutes per day</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Daily Routine Summary */}
                <div className="glass-card rounded-2xl p-6 shadow-md border border-[#c3c6d7]/35 relative overflow-hidden bg-white">
                  <h3 className="text-sm font-bold text-[#131b2e] flex items-center gap-2 mb-4 border-b border-slate-50 pb-2">
                    <Sparkles className="h-4.5 w-4.5 text-[#004ac6]" />
                    <span>Daily Routine</span>
                  </h3>
                  <ul className="space-y-3 text-xs font-semibold text-[#737686]">
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-[#004ac6] rounded-full mt-1.5 shrink-0"></span>
                      <span>15m Focused AI Speaking Practice</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-[#004ac6] rounded-full mt-1.5 shrink-0"></span>
                      <span>2x Academic Reading Passages</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-[#004ac6] rounded-full mt-1.5 shrink-0"></span>
                      <span>Vocabulary Expansion (10 new words)</span>
                    </li>
                  </ul>
                </div>

              </div>

              {/* Right Column: Visual Timeline Roadmap */}
              <div className="lg:col-span-7">
                <div className="glass-card rounded-2xl p-6 lg:p-8 shadow-md border border-[#c3c6d7]/35 relative overflow-hidden bg-white min-h-[500px]">
                  <div className="absolute inset-0 dot-grid pointer-events-none"></div>
                  
                  <div className="flex justify-between items-center mb-8 border-b border-slate-50 pb-3">
                    <h2 className="font-headline-md text-base font-bold text-[#131b2e]">Milestones</h2>
                    <span className="px-3 py-1 bg-[#eaedff] text-[#004ac6] text-[10px] font-black rounded-full uppercase tracking-wider">
                      Phase 1: Foundations
                    </span>
                  </div>

                  {/* Timeline list items */}
                  <div className="space-y-8 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:border-l-2 before:border-dashed before:border-[#c3c6d7]/50">
                    
                    {/* Item 1 */}
                    <div className="relative">
                      <div className="absolute -left-6.5 top-1.5 w-3 h-3 bg-[#004ac6] rounded-full border-2 border-white ring-2 ring-[#004ac6]/10 flex items-center justify-center"></div>
                      <div className="space-y-2">
                        <h4 className="text-xs font-black text-[#004ac6] uppercase tracking-wider">Week 1–2: Core Mechanics</h4>
                        <p className="text-xs text-[#737686] font-semibold leading-relaxed">
                          Mastering grammar structures and identifying your primary lexical gaps.
                        </p>
                        <div className="flex gap-2 pt-1">
                          <span className="px-2 py-0.5 bg-slate-100 text-[#737686] text-[9px] font-black rounded-full uppercase tracking-wider">Grammar</span>
                          <span className="px-2 py-0.5 bg-slate-100 text-[#737686] text-[9px] font-black rounded-full uppercase tracking-wider">Lexis</span>
                        </div>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="relative">
                      <div className="absolute -left-6.5 top-1.5 w-3 h-3 bg-[#004ac6] rounded-full border-2 border-white ring-2 ring-[#004ac6]/10 flex items-center justify-center"></div>
                      <div className="space-y-2">
                        <h4 className="text-xs font-black text-[#004ac6] uppercase tracking-wider">Week 3–6: Strategy Phase</h4>
                        <p className="text-xs text-[#737686] font-semibold leading-relaxed">
                          Developing test-taking shortcuts for Listening and Reading efficiency.
                        </p>
                        <div className="flex gap-2 pt-1">
                          <span className="px-2 py-0.5 bg-slate-100 text-[#737686] text-[9px] font-black rounded-full uppercase tracking-wider">Time Management</span>
                          <span className="px-2 py-0.5 bg-slate-100 text-[#737686] text-[9px] font-black rounded-full uppercase tracking-wider">Skimming</span>
                        </div>
                      </div>
                    </div>

                    {/* Item 3 */}
                    <div className="relative">
                      <div className="absolute -left-6.5 top-1.5 w-3 h-3 bg-slate-200 rounded-full border-2 border-white"></div>
                      <div className="space-y-2">
                        <h4 className="text-xs font-black text-[#737686] uppercase tracking-wider">Week 7–10: Advanced Fluency</h4>
                        <p className="text-xs text-[#737686] font-semibold leading-relaxed">
                          Complex sentence structures and high-level academic writing tasks.
                        </p>
                        <div className="flex gap-2 pt-1">
                          <span className="px-2 py-0.5 bg-slate-100 text-[#737686] text-[9px] font-black rounded-full uppercase tracking-wider">Writing Task 2</span>
                        </div>
                      </div>
                    </div>

                    {/* Item 4 */}
                    <div className="relative">
                      <div className="absolute -left-6.5 top-1.5 w-3 h-3 bg-slate-200 rounded-full border-2 border-white"></div>
                      <div className="space-y-2">
                        <h4 className="text-xs font-black text-[#737686] uppercase tracking-wider">Week 11–12: Peak Performance</h4>
                        <p className="text-xs text-[#737686] font-semibold leading-relaxed">
                          Simulated exams under pressure and finalizing the target score.
                        </p>
                        <div className="flex gap-2 pt-1">
                          <span className="px-2 py-0.5 bg-slate-100 text-[#737686] text-[9px] font-black rounded-full uppercase tracking-wider">Mock Tests</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Redirect Footer */}
            <div className="flex flex-col sm:flex-row justify-between items-center p-6 bg-white border border-[#c3c6d7]/35 rounded-2xl gap-4 shadow-sm">
              <div className="space-y-0.5 text-center sm:text-left">
                <h4 className="text-sm font-bold text-[#131b2e]">All set! Your profile is 100% complete.</h4>
                <p className="text-xs text-[#737686] font-semibold">Ready to start your first session?</p>
              </div>
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-b from-[#3B82F6] to-[#2563EB] text-white font-bold text-xs rounded-full shadow-lg shadow-indigo-600/10 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer text-center"
              >
                Go To Dashboard
              </button>
            </div>
          </motion.div>
        );
    }
  };

  const showSidebar = activeTab !== 'reading' && activeTab !== 'writing' && activeTab !== 'evaluating' && activeTab !== 'roadmap';

  return (
    <div className="flex h-screen bg-[#faf8ff] text-slate-900 overflow-hidden font-sans">
      
      {/* 1. Left Navigation Sidebar */}
      {showSidebar && (
        <aside className="w-64 bg-white border-r border-[#c3c6d7]/35 p-6 flex flex-col justify-between shrink-0 h-full hidden lg:flex">
          <div className="space-y-8">
            
            {/* Header Brand */}
            <div>
              <h2 className="font-display-lg text-xl font-black text-[#004ac6] tracking-tighter">Future Scholar</h2>
              <p className="text-[#737686] text-xs font-bold uppercase tracking-wider mt-0.5">
                Target: Band {user?.targetBand?.toFixed(1) || '8.5'}
              </p>
            </div>

            {/* Navigation Links list */}
            <div className="space-y-1.5">
              {[
                { id: 'onboarding', label: 'Onboarding', icon: <Compass className="h-4.5 w-4.5" />, path: '/onboarding' },
                { id: 'assessment', label: 'Assessment', icon: <GraduationCap className="h-4.5 w-4.5" />, path: '/assessment', active: true },
                { id: 'roadmap', label: 'Roadmap', icon: <Map className="h-4.5 w-4.5" />, path: '#' },
                { id: 'performance', label: 'Performance', icon: <TrendingUp className="h-4.5 w-4.5" />, path: '#' },
                { id: 'settings', label: 'Settings', icon: <Settings className="h-4.5 w-4.5" />, path: '#' },
              ].map((tab) => {
                const isActive = tab.active;
                return (
                  <button
                    key={tab.id}
                    onClick={() => tab.path !== '#' ? router.push(tab.path) : toast.success('This section will unlock after completing the placement assessment.')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-[#004ac6] text-white shadow-md shadow-[#004ac6]/10'
                        : 'text-[#434655] hover:bg-slate-100 hover:text-slate-950 hover:translate-x-1'
                    }`}
                  >
                    <span className={isActive ? 'text-white' : 'text-[#737686]'}>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Upgrade to Pro Button */}
          <button
            onClick={() => toast.success('Pro upgrading is coming soon!')}
            className="mt-auto bg-[#eaedff] text-[#004ac6] py-3 px-4 rounded-xl font-bold hover:scale-[1.02] active:scale-95 transition-all text-xs cursor-pointer border border-[#004ac6]/10"
          >
            Upgrade to Pro
          </button>
        </aside>
      )}

      {/* 2. Top Header Bar for Reading/Writing/Evaluating/Roadmap sections */}
      {!showSidebar && (
        <header className="fixed top-0 left-0 right-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-[#faf8ff]/70 backdrop-blur-xl border-b border-[#c3c6d7]/10 shadow-[0_8px_32px_0_rgba(15,23,42,0.04)]">
          <div className="flex items-center gap-4">
            <span className="font-display-lg text-lg font-black text-[#004ac6] tracking-tighter">IELTS.ai</span>
            <div className="h-6 w-px bg-[#c3c6d7]/30 mx-2 hidden md:block"></div>
            <div className="hidden md:flex items-center gap-3">
              <span className="text-xs font-bold text-[#737686] bg-slate-100 px-3 py-1 rounded-full">
                {activeTab === 'reading' && 'Step 11 of 15'}
                {activeTab === 'writing' && 'Step 12 of 15'}
                {activeTab === 'evaluating' && 'Step 13 of 15'}
                {activeTab === 'roadmap' && 'Step 15 of 15'}
              </span>
              <span className="text-xs font-black text-[#004ac6] uppercase tracking-wider">
                {activeTab === 'reading' && 'Reading Assessment'}
                {activeTab === 'writing' && 'Writing Assessment'}
                {activeTab === 'evaluating' && 'Processing Assessment'}
                {activeTab === 'roadmap' && 'Milestone Roadmap'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            {(activeTab === 'reading' || activeTab === 'writing') && (
              <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 rounded-full border border-rose-100 text-rose-600 shadow-sm animate-pulse">
                <Clock className="h-4 w-4" />
                <span className="text-xs font-bold tabular-nums">{formatTimer(timerSeconds)}</span>
              </div>
            )}
            {activeTab === 'evaluating' && (
              <div className="flex items-center gap-2 px-4 py-2 bg-[#004ac6]/5 rounded-full border border-[#004ac6]/10 text-[#004ac6] shadow-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-xs font-bold uppercase tracking-wider">Processing</span>
              </div>
            )}
            {activeTab === 'roadmap' && (
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#737686]">Profile 100% complete</span>
                <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-[#004ac6]"></div>
                </div>
              </div>
            )}
            <button className="flex items-center justify-center p-2 rounded-full hover:bg-slate-50 transition-colors">
              <span className="material-symbols-outlined text-[#737686] text-[24px]">account_circle</span>
            </button>
          </div>
        </header>
      )}

      {/* 3. Right Workspace Content Canvas */}
      <main className={`flex-1 overflow-y-auto bg-[#faf8ff]/85 h-full relative ${
        showSidebar ? 'lg:pl-0' : 'pt-16 w-full'
      }`}>
        {/* Background Atmospheric Effect */}
        {showSidebar && (
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#004ac6]/5 rounded-full blur-[120px] animate-float"></div>
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#006242]/5 rounded-full blur-[100px] animate-float" style={{ animationDelay: '-3s' }}></div>
          </div>
        )}

        <div className={`max-w-5xl mx-auto relative z-10 h-full flex flex-col justify-center ${
          showSidebar ? 'space-y-8 p-6 lg:p-12' : 'w-full'
        }`}>
          
          {/* Header Progress step section (for intro/overview/grammar/vocab tabs) */}
          {showSidebar && activeTab !== 'result' && (
            <div className="shrink-0 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[#004ac6] font-bold text-xs uppercase tracking-widest">
                  {activeTab === 'intro' && 'Step 7 of 15'}
                  {activeTab === 'overview' && 'Step 8 of 15'}
                  {activeTab === 'grammar' && 'Step 9 of 15'}
                  {activeTab === 'vocab' && 'Step 10 of 15'}
                </span>
                <span className="text-[#737686] text-xs font-bold">Placement Phase</span>
              </div>
              <div className="h-1.5 w-full bg-[#eaedff] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#004ac6] rounded-full transition-all duration-700 ease-out" 
                  style={{ 
                    width: 
                      activeTab === 'intro' ? '46.6%' : 
                      activeTab === 'overview' ? '53.3%' :
                      activeTab === 'grammar' ? '60%' : '66.6%'
                  }}
                />
              </div>
            </div>
          )}

          {/* Render Tab Content */}
          <div className="flex-1 flex items-center justify-center w-full h-full">
            {/* If taking diagnostic questions, put them in a beautiful, focused centered container card */}
            {activeTab !== 'intro' && activeTab !== 'overview' && activeTab !== 'reading' && activeTab !== 'writing' && activeTab !== 'evaluating' && activeTab !== 'roadmap' && activeTab !== 'result' ? (
              <div className="w-full max-w-xl bg-white border border-[#c3c6d7]/35 rounded-3xl p-6 lg:p-8 shadow-xl">
                <AnimatePresence mode="wait">
                  {renderContent()}
                </AnimatePresence>
              </div>
            ) : (
              renderContent()
            )}
          </div>

        </div>
      </main>

    </div>
  );
}
