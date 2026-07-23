'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, TrendingUp, Target, Award, BookOpen, Flame, ChevronRight, Sparkles, Clock, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import ProtectedRoute from '@/components/shared/protected-route';

export default function OnboardingPage() {
  return (
    <ProtectedRoute>
      <OnboardingForm />
    </ProtectedRoute>
  );
}

function OnboardingForm() {
  const { refreshUser } = useAuth();
  const router = useRouter();
  
  // Steps:
  // 1: Onboarding Welcome Screen (Step 1 of 15)
  // 2: Target Band Selection (Step 3 of 15)
  // 3: Select Exam Date (Step 4 of 15)
  // 4: Study Intent Selection (Step 5 of 15)
  // 5: Study Commitment (Step 6 of 15)
  // 6: Personalized Roadmap preview
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Diagnostic baseline statistics
  const [baselineStats, setBaselineStats] = useState<{ currentBand: number; cefrLevel: string } | null>(null);

  // Generated study plan roadmap data
  const [roadmapData, setRoadmapData] = useState<{
    user: any;
    progress: any;
    studyPlan: any;
  } | null>(null);

  // Fetch baseline diagnostic results upon mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/progress/stats');
        setBaselineStats(response.data);
      } catch (err) {
        console.error('Error fetching progress stats:', err);
      }
    };
    fetchStats();
  }, []);

  // Form values
  const [targetBand, setTargetBand] = useState<number | null>(null);
  const [intent, setIntent] = useState<string | null>(null);
  
  // Date Selection states - using functional initializers to satisfy react-hooks/purity
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(
    () => new Date() // Default: today's date
  );

  // Study commitment (in minutes)
  const [studyTime, setStudyTime] = useState<number | null>(null);

  // Parallax rotation states for the Welcome 3D card (Step 1)
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  // Micro-interaction: Pulsing card state for Target Band cards (Step 2)
  const [pulsingCard, setPulsingCard] = useState<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (step === 1 && window.innerWidth > 1024) {
        const x = (window.innerWidth / 2 - e.pageX) / 50;
        const y = (window.innerHeight / 2 - e.pageY) / 50;
        setRotateX(y); // vertical mouse movement rotates X-axis
        setRotateY(-x); // horizontal mouse movement rotates Y-axis
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [step]);

  const triggerPulse = (score: number) => {
    setPulsingCard(score);
    setTimeout(() => setPulsingCard(null), 600);
  };

  const handleSelectBand = (score: number) => {
    setTargetBand(score);
    triggerPulse(score);
  };

  // Calendar Calculation Helpers
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    // Monday as 0, Sunday as 6
    return day === 0 ? 6 : day - 1;
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDayIndex = getFirstDayOfMonth(currentMonth);

  // Previous month trailing days
  const prevMonthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
  const daysInPrevMonth = getDaysInMonth(prevMonthDate);
  const prevMonthDays = [];
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    prevMonthDays.push(daysInPrevMonth - i);
  }

  // Current month days
  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Next month leading days to complete grid rows
  const totalCells = prevMonthDays.length + daysInMonth;
  const nextMonthCells = (7 - (totalCells % 7)) % 7;
  const nextMonthDays = Array.from({ length: nextMonthCells }, (_, i) => i + 1);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleSelectDay = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(newDate);
  };

  const isDaySelected = (day: number) => {
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth.getMonth() &&
      selectedDate.getFullYear() === currentMonth.getFullYear()
    );
  };

  const formatSelectedDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const handleSkipDate = () => {
    // Default to 60 days from now and advance
    const futureDate = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);
    setSelectedDate(futureDate);
    setStep(4);
  };

  const handleSubmitOnboarding = async () => {
    if (!targetBand) {
      toast.error('Please select your target band first');
      setStep(2);
      return;
    }
    if (!intent) {
      toast.error('Please select your study intent');
      setStep(4);
      return;
    }
    if (!studyTime) {
      toast.error('Please select your study commitment');
      return;
    }

    setLoading(true);
    try {
      const response = await api.patch('/users/onboarding', {
        targetBand,
        examDate: selectedDate.toISOString().split('T')[0],
        goal: intent,
        studyTimePerDay: studyTime,
      });
      setRoadmapData(response.data);
      await refreshUser();
      toast.success('Goals configured! Generating your personalized roadmap...');
      setStep(6);
    } catch (e: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      console.error(e);
      toast.error(e.response?.data?.message || 'Failed to submit onboarding details');
    } finally {
      setLoading(false);
    }
  };

  const getStepTitle = () => {
    if (step === 2) {
      if (!targetBand) return "What's your dream band?";
      return targetBand >= 8.0
        ? `Aiming for excellence? Band ${targetBand} it is.`
        : `Solid target. Band ${targetBand} is a great goal.`;
    }
    if (step === 4) {
      return "Why are you taking IELTS?";
    }
    return "";
  };

  const getProgressWidth = () => {
    if (step === 1) return '6.66%';
    if (step === 2) return '20%';
    if (step === 3) return '26.6%';
    if (step === 4) return '33.3%';
    if (step === 5) return '40%';
    return '100%';
  };

  // Top Nav Progress Bar Pills rendering (Step 3 to 6 of 15)
  const renderProgressPills = (activeCount: number) => {
    const total = 9;
    return (
      <div className="flex gap-1 items-center">
        {Array.from({ length: total }).map((_, idx) => {
          const isPill = idx < 7;
          const isActive = idx < activeCount;
          if (isPill) {
            return (
              <div
                key={idx}
                className={`h-2 transition-all duration-500 rounded-full ${
                  isActive ? 'w-8 bg-[#004ac6]' : 'w-8 bg-[#eaedff]'
                }`}
              />
            );
          } else {
            return (
              <div
                key={idx}
                className={`h-2 w-2 transition-all duration-500 rounded-full ${
                  isActive ? 'bg-[#004ac6]' : 'bg-[#eaedff]'
                }`}
              />
            );
          }
        })}
      </div>
    );
  };

  return (
    <div className="bg-[#faf8ff] text-[#131b2e] font-body-md min-h-screen flex flex-col overflow-x-hidden selection:bg-[#004ac6]/10">
      
      {/* Background decoration grid */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="dot-grid absolute inset-0"></div>
        {/* Atmospheric ambient blobs */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#004ac6]/5 rounded-full blur-[100px] animate-float"></div>
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#006242]/5 rounded-full blur-[100px] animate-float" style={{ animationDelay: '-3s' }}></div>
      </div>

      {/* TOP NAVIGATION BAR */}
      <nav className="fixed top-0 left-0 right-0 w-full z-50 bg-[#faf8ff]/70 backdrop-blur-xl border-b border-[#c3c6d7]/10 shadow-[0_8px_32px_0_rgba(15,23,42,0.04)]">
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex justify-between items-center w-full">
          <div className="flex items-center gap-2">
            <span className="font-display-lg text-headline-md text-[#004ac6] tracking-tighter font-extrabold text-xl">IELTS.ai</span>
          </div>

          <div className="flex items-center gap-4">
            {step > 1 && (
              <div className="hidden md:flex gap-1">
                {renderProgressPills(
                  step === 2 ? 3 :
                  step === 3 ? 4 :
                  step === 4 ? 5 : 6
                )}
              </div>
            )}
            
            <div className="flex items-center gap-2 bg-[#d5e4f8] px-3 py-1 rounded-full">
              <span className="font-label-sm text-[#0e1d2b] font-bold text-[10px] uppercase tracking-wider">
                {step === 1 && 'STEP 1 OF 6'}
                {step === 2 && 'STEP 2 OF 6'}
                {step === 3 && 'STEP 3 OF 6'}
                {step === 4 && 'STEP 4 OF 6'}
                {step === 5 && 'STEP 5 OF 6'}
                {step === 6 && 'ROADMAP'}
              </span>
            </div>

            <button className="hover:bg-black/5 transition-colors p-2 rounded-full">
              <span className="material-symbols-outlined text-[#004ac6] text-[24px]">account_circle</span>
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN CANVAS */}
      <main className="flex-1 flex flex-col items-center pt-24 pb-16 px-6 max-w-5xl mx-auto w-full justify-center">
        
        {/* Progress Tracker Bar (Hidden on welcome step) */}
        {step !== 1 && (
          <div className="w-full max-w-md mb-8 animate-reveal">
            <div className="flex justify-between items-center mb-2">
              <span className="font-label-sm text-[#434655] uppercase tracking-widest text-xs font-semibold">
                {step === 2 && 'Step 2 of 6'}
                {step === 3 && 'Step 3 of 6'}
                {step === 4 && 'Step 4 of 6'}
                {step === 5 && 'Step 5 of 6'}
              </span>
              <span className="font-label-sm text-[#004ac6] font-bold text-xs">
                {step === 2 && '33.3% Complete'}
                {step === 3 && '50.0% Complete'}
                {step === 4 && '66.6% Complete'}
                {step === 5 && '83.3% Complete'}
              </span>
            </div>
            <div className="h-1 w-full bg-[#eaedff] rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-[#004ac6] transition-all duration-700 ease-out" 
                initial={{ width: getProgressWidth() }}
                animate={{ width: getProgressWidth() }}
              />
            </div>
          </div>
        )}

        {/* STEP CONTENT GRID */}
        <AnimatePresence mode="wait">
          
          {/* STEP 1: Onboarding Welcome split screen gate */}
          {step === 1 && (
            <motion.div
              key="welcome-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              {/* Content Section */}
              <div className="flex flex-col gap-6 text-center lg:text-left animate-reveal delay-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-600 rounded-full w-fit mx-auto lg:mx-0">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-green-600 font-label-sm text-label-sm uppercase tracking-widest text-xs font-semibold">Assessment Complete 🎉</span>
                </div>
                <h1 className="font-display-lg text-headline-lg-mobile md:text-headline-lg text-[#131b2e] leading-tight font-extrabold">
                  Baseline Mapped: <span className="text-[#004ac6]">Band {baselineStats?.currentBand.toFixed(1) || '6.0'} ({baselineStats?.cefrLevel || 'B2'})</span>
                </h1>
                <p className="font-body-lg text-body-lg text-[#434655] max-w-md mx-auto lg:mx-0 text-base font-semibold leading-relaxed">
                  Excellent job! Your level baseline has been computed. Let's configure your targets to generate your personalized weekly roadmap.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                  <button
                    onClick={() => {
                      toast.loading('Loading target bands...', { id: 'nav-loading', duration: 850 });
                      setTimeout(() => setStep(2), 150);
                    }}
                    className="btn-primary-gradient px-8 h-14 rounded-full text-white font-label-md text-label-md flex items-center gap-2 group glass-edge cursor-pointer text-sm font-bold shadow-md"
                  >
                    Continue
                    <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
                  </button>
                  <button
                    onClick={() => toast.success('Lumina IELTS uses state of the art AI to analyze your vocabulary, writing templates, and speaking pronunciation 24/7.')}
                    className="h-14 px-8 rounded-full border border-[#c3c6d7] font-label-md text-label-md hover:bg-[#faf8ff] hover:border-[#004ac6] transition-colors text-sm font-bold cursor-pointer"
                  >
                    Learn how it works
                  </button>
                </div>
                <div className="mt-6 flex items-center justify-center lg:justify-start gap-4">
                  <div className="flex -space-x-3">
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDHygU7AJkB7e2ou6-NqTK3BgRdHkTv3vakWfXeetZjRNrd_8ctsoGACasK0DEc6FzqEV3iHFhxvWwyK6Ur60iQFawzazvA0fozD5Y_9v8op1he4yvxp0pUsQ6XVoi21i9t8i5Et2WDaFVIUVAoznUsgItLpHBu6TPRbQ1Dwuu6_1YuggzifoSuXwXdKjM59CH2EURCau6IM0utGmEYwlcoYjq4B0ysVxcmLKwR500OPFN_-qPIUrcdThNAfWjQYhqYKb-fs2uNBdkr')`, backgroundSize: 'cover' }}></div>
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDMS5b37mAcjybiCdEkMxb6W9GbjO1tvlww6N8TqrmjRKTbK-BFNvweAxdszbxpQ3d8DZElZsplAHenOLL_UoUAvvzU8nKRhKsSwPN4vauXWmes04RERiHaOQ_Sl2ZmWJCkI2cDvoIXDydaeKN9WUIO1IlLs2ifJDun_g8Y8KHw5JGZEAXu75E9akqPqsMnZq5n6iCCnP80SQWv0hAHmyB0sVlWbGEgnJ56rX4G-eFHkf05ty6APM8WArc5MRy4XXlJBtad2FxhYdK_')`, backgroundSize: 'cover' }}></div>
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuC_hYfohmFVIg_Rc9Cqu1_gfN2Bl6HZXAnSIaRimPKNIutyxkMmbINOqZFLm_Phwy_BwFbWXX1rYzraut_0aQXXNScglGYgaY_zNK0KDV7ajJJSEy0fgnjKjQyucD_Dzj-KsJslfm74V52nTMYNu1b_BWgg_NQS4uqg2QqyaSoZveqWIjHyzLsViqpPsxyUxOYG541dP678M2hsE9xyF6WoBtsp1rc2GWdnf75uKkVUr369TO0D3pOXC91dqo8IxVr89H6cTDCO6uYE')`, backgroundSize: 'cover' }}></div>
                  </div>
                  <p className="text-label-sm font-label-sm text-[#434655] text-xs font-semibold">
                    Joined by <span className="text-[#131b2e] font-bold">12,000+</span> scholars this month
                  </p>
                </div>
              </div>

              {/* AI Illustration Card */}
              <div className="relative flex justify-center items-center animate-reveal delay-2 lg:h-[500px]">
                <div
                  className="relative w-full max-w-[400px] aspect-square lg:aspect-auto lg:h-full glass-card rounded-lg p-8 flex flex-col items-center justify-center overflow-hidden dot-grid"
                  style={{
                    transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                    transition: 'transform 0.1s ease-out',
                  }}
                >
                  {/* Glassy Sphere/Orb Effect */}
                  <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#004ac6]/10 blur-[100px] rounded-full"></div>
                  <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#4edea3]/20 blur-[100px] rounded-full"></div>
                  <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center">
                    <div className="w-48 h-48 mb-8 rounded-3xl bg-white shadow-2xl flex items-center justify-center relative overflow-hidden group border border-slate-100">
                      <img
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        alt="Friendly 3D robot avatar representing AI Coach"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAeZlco3t6w8T8v_wtrTr1DbCz5wIEy-7t0bF-Rs_EkgaFneGCb7hOKMdcLw2pQMo10pbkHVTi7BlkFWIhKqjtCFlgDJaciDImigOEvqlnv36RoqhMo9Ao_qaTv8ASAg9hLiF5VFS4tv1Yw8rNEHy9xr8x_4ZhgLOY8wRXqo4s38vPu_StgqmrB8AG7I_HLPtb4s_FfkckGIt-QZUMj4Ho_efwC_DJWuv-OUYvY8Fktq683lvvJdMKWa0uaAf92JajTnH9Z8QEDsRlv"
                      />
                      <div className="absolute bottom-4 left-4 right-4 h-12 glass-card rounded-xl flex items-center justify-center gap-2 border-white/50">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span className="text-label-sm font-label-sm font-semibold text-xs">AI Coach Online</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="h-4 w-32 bg-[#004ac6]/10 rounded-full mx-auto animate-pulse"></div>
                      <div className="h-4 w-48 bg-[#004ac6]/5 rounded-full mx-auto animate-pulse delay-75"></div>
                    </div>
                  </div>
                  
                  {/* Floating Chips for SaaS aesthetic */}
                  <div className="absolute top-12 -left-4 glass-card px-4 py-2 rounded-full animate-bounce duration-[3000ms] border-white/40 shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#004ac6] text-[18px]">verified</span>
                      <span className="text-label-sm font-label-sm font-semibold text-xs">Instant Scoring</span>
                    </div>
                  </div>
                  <div className="absolute bottom-20 -right-4 glass-card px-4 py-2 rounded-full animate-bounce duration-[4000ms] delay-500 border-white/40 shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#006242] text-[18px]">record_voice_over</span>
                      <span className="text-label-sm font-label-sm font-semibold text-xs">Speaking Mock</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Target Band Selection Screen */}
          {step === 2 && (
            <motion.div
              key="band-selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="relative w-full flex flex-col items-center"
            >
              {/* Dynamic Title Headers */}
              <div className="text-center mb-12 space-y-3 stagger-in">
                <h1 className="font-display-lg text-headline-lg-mobile md:text-headline-lg text-[#131b2e] leading-tight font-bold">
                  {getStepTitle()}
                </h1>
                <p className="text-[#434655] text-sm md:text-base max-w-lg mx-auto font-semibold">
                  Select the target score you need for your university or visa application. We{"'"}ll tailor your roadmap to close the gap.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full relative z-10">
                {[
                  { score: 5.5, label: 'Moderate User', desc: 'Basic operational command of the language.' },
                  { score: 6.0, label: 'Competent User', desc: 'Generally effective command despite inaccuracies.' },
                  { score: 6.5, label: 'Competent+ User', desc: 'Bridging the gap between competent and good.' },
                  { score: 7.0, label: 'Good User', desc: 'Operational command with occasional errors.' },
                  { score: 7.5, label: 'Good+ User', desc: 'High-level proficiency for elite universities.' },
                  { score: 8.0, label: 'Very Good User', desc: 'Full operational command with few inaccuracies.' },
                  { score: 8.5, label: 'Expert- User', desc: 'Near-native fluency and comprehensive mastery.' },
                  { score: 9.0, label: 'Expert User', desc: 'Complete mastery of the English language.' },
                ].map((band) => (
                  <button
                    key={band.score}
                    onClick={() => handleSelectBand(band.score)}
                    className={`band-card glass-card p-6 rounded-lg flex flex-col items-center text-center group cursor-pointer border relative overflow-hidden ${
                      targetBand === band.score ? 'selected border-[#004ac6]' : 'border-transparent'
                    }`}
                  >
                    {/* Micro-interaction pulsing ripple */}
                    {pulsingCard === band.score && (
                      <div className="absolute inset-0 rounded-lg bg-[#004ac6]/10 animate-ping pointer-events-none" />
                    )}

                    <span className={`font-display-lg text-6xl font-extrabold transition-colors duration-300 ${
                      targetBand === band.score ? 'text-[#004ac6]' : 'text-[#004ac6]/40 group-hover:text-[#004ac6]'
                    }`}>
                      {band.score.toFixed(1)}
                    </span>
                    <span className="mt-4 font-label-md text-sm font-semibold text-[#434655] group-hover:text-[#004ac6] transition-colors">
                      {band.label}
                    </span>
                    <p className="mt-2 text-[11px] text-[#434655]/70 leading-relaxed font-body-md font-semibold">
                      {band.desc}
                    </p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 3: Select Exam Date Screen */}
          {step === 3 && (
            <motion.div
              key="exam-date-selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="relative w-full z-10"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left side: content & recommendations */}
                <div className="lg:col-span-5 pt-8">
                  <h1 className="font-display-lg text-headline-lg-mobile lg:text-display-lg text-[#131b2e] mb-4 leading-tight font-extrabold">
                    When is your <br /> <span className="text-[#004ac6]">exam?</span>
                  </h1>
                  <p className="font-body-lg text-body-lg text-[#434655] mb-6 max-w-sm font-semibold">
                    Setting a target date helps our AI architect the most efficient study path for your desired band score.
                  </p>
                  
                  {/* AI Recommendation Badge */}
                  <div className="glass-card glass-edge rounded-2xl p-4 flex items-start gap-4 mb-6">
                    <div className="bg-[#004ac6]/10 p-2 rounded-xl text-[#004ac6]">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                    </div>
                    <div>
                      <p className="font-label-md text-[#004ac6] font-bold mb-1">AI Recommendation</p>
                      <p className="font-body-md text-[#434655]/90 text-sm font-semibold">
                        Your study roadmap will be created based on this date. We recommend at least 4 weeks for intensive prep.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right side: High-End Interactive Calendar UI */}
                <div className="lg:col-span-7">
                  <div className="glass-card glass-edge rounded-xl p-8 relative overflow-hidden">
                    
                    {/* Calendar Header */}
                    <div className="flex justify-between items-center mb-8">
                      <div>
                        <h2 className="font-headline-md text-headline-md text-[#131b2e] font-extrabold">{formatMonthYear(currentMonth)}</h2>
                        <p className="font-label-md text-[#434655] font-semibold text-xs mt-0.5">Select your test date</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handlePrevMonth}
                          className="p-2 rounded-full border border-[#c3c6d7] hover:bg-[#eaedff] transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[20px] flex items-center justify-center">chevron_left</span>
                        </button>
                        <button
                          onClick={handleNextMonth}
                          className="p-2 rounded-full border border-[#c3c6d7] hover:bg-[#eaedff] transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[20px] flex items-center justify-center">chevron_right</span>
                        </button>
                      </div>
                    </div>

                    {/* Calendar Content Grid */}
                    <div className="grid grid-cols-7 text-center gap-y-4 mb-8">
                      
                      {/* Weekday headers */}
                      {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => (
                        <div key={d} className="font-label-sm text-[#737686] uppercase tracking-widest py-2 text-xs font-bold">
                          {d}
                        </div>
                      ))}

                      {/* Prev Month Days */}
                      {prevMonthDays.map((d, idx) => (
                        <div key={`prev-${idx}`} className="py-3 text-[#c3c6d7] font-label-md text-xs font-semibold">
                          {d}
                        </div>
                      ))}

                      {/* Active Month Days */}
                      {currentMonthDays.map((d) => {
                        const active = isDaySelected(d);
                        
                        // Check if day is in the past
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d);
                        checkDate.setHours(0, 0, 0, 0);
                        const isPast = checkDate < today;

                        return (
                          <button
                            key={`curr-${d}`}
                            disabled={isPast}
                            onClick={() => !isPast && handleSelectDay(d)}
                            className={`py-3 font-label-md text-xs font-bold rounded-xl transition-all relative text-center flex items-center justify-center mx-auto w-10 h-10 ${
                              isPast
                                ? 'text-[#c3c6d7] opacity-40 cursor-not-allowed'
                                : active
                                ? 'bg-[#2563eb] text-white shadow-lg calendar-day-active cursor-pointer'
                                : 'text-[#131b2e] hover:bg-[#dbe1ff] cursor-pointer'
                            }`}
                          >
                            <span>{d}</span>
                            {active && (
                              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                            )}
                          </button>
                        );
                      })}

                      {/* Next Month Days */}
                      {nextMonthDays.map((d, idx) => (
                        <div key={`next-${idx}`} className="py-3 text-[#c3c6d7] font-label-md text-xs font-semibold">
                          {d}
                        </div>
                      ))}

                    </div>

                    {/* Date Selection Summary & Confirm */}
                    <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-[#c3c6d7]/30 gap-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#004ac6]/5 flex items-center justify-center text-[#004ac6]">
                          <span className="material-symbols-outlined">event_note</span>
                        </div>
                        <div>
                          <span className="block font-label-sm text-[#737686] uppercase tracking-wider text-[10px] font-bold">Selected Date</span>
                          <span className="block font-headline-md text-on-surface text-base font-extrabold">
                            {formatSelectedDate(selectedDate)}
                          </span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => setStep(4)}
                        className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-b from-[#3B82F6] to-[#2563EB] text-white font-label-md rounded-full shadow-[0_12px_24px_-8px_rgba(37,99,235,0.4)] hover:scale-[1.02] active:scale-95 transition-all glass-edge border-t border-white/20 font-bold text-sm cursor-pointer text-center"
                      >
                        Confirm Date
                      </button>
                    </div>

                  </div>

                  {/* Skip / Placeholder Action */}
                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={handleSkipDate}
                      className="text-[#434655] font-label-md hover:text-[#004ac6] transition-colors flex items-center gap-2 px-4 py-2 font-bold text-xs cursor-pointer"
                    >
                      <span>I haven{"'"}t booked a date yet</span>
                      <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </button>
                  </div>

                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Study Intent Selection Screen */}
          {step === 4 && (
            <motion.div
              key="intent-selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="relative w-full flex flex-col items-center"
            >
              {/* Dynamic Title Headers */}
              <div className="text-center mb-12 space-y-3 stagger-in">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#dbe1ff] text-[#00174b] font-label-sm text-xs font-semibold mb-2">
                  Personalize Your Journey
                </span>
                <h1 className="font-display-lg text-headline-lg-mobile md:text-headline-lg text-[#131b2e] leading-tight font-bold">
                  {getStepTitle()}
                </h1>
                <p className="text-[#434655] text-sm md:text-base max-w-lg mx-auto font-semibold">
                  We{"'"}ll tailor your roadmap, assessment difficulty, and practice material based on your primary goal.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full relative z-10">
                {[
                  {
                    id: 'Study Abroad',
                    icon: 'school',
                    iconBg: 'bg-[#dbe1ff]/60',
                    iconColor: 'text-[#004ac6]',
                    title: 'Study Abroad',
                    desc: 'Applying for undergraduate, postgraduate, or research programs in English-speaking universities.'
                  },
                  {
                    id: 'Immigration',
                    icon: 'travel_explore',
                    iconBg: 'bg-[#6ffbbe]/30',
                    iconColor: 'text-[#006242]',
                    title: 'Immigration',
                    desc: 'Seeking permanent residency or work visas in countries like Canada, Australia, or the UK.'
                  },
                  {
                    id: 'Professional Growth',
                    icon: 'work_outline',
                    iconBg: 'bg-[#d5e4f8]/50',
                    iconColor: 'text-[#516070]',
                    title: 'Professional Growth',
                    desc: 'Registering with professional bodies (medical, nursing, law) or advancing your corporate career.'
                  },
                  {
                    id: 'Self Improvement',
                    icon: 'auto_awesome',
                    iconBg: 'bg-[#e2e7ff]',
                    iconColor: 'text-[#434655]',
                    title: 'Self Improvement',
                    desc: 'Testing your English proficiency levels for personal satisfaction or informal education goals.'
                  }
                ].map((option) => {
                  const isSelected = intent === option.id;
                  return (
                    <div
                      key={option.id}
                      onClick={() => setIntent(option.id)}
                      className={`glass-card glass-edge p-6 rounded-lg cursor-pointer group flex flex-col justify-between transition-all duration-300 ${
                        isSelected ? 'active border-[#004ac6] bg-[#004ac6]/5' : 'border-transparent'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className={`w-16 h-16 rounded-2xl ${option.iconBg} flex items-center justify-center ${option.iconColor} mb-6 transition-transform group-hover:scale-110`}>
                          <span className="material-symbols-outlined text-[32px]">{option.icon}</span>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all checkmark-box ${
                          isSelected ? 'border-[#004ac6] bg-[#004ac6]' : 'border-[#c3c6d7] group-hover:border-[#004ac6]'
                        }`}>
                          <span className={`material-symbols-outlined text-white text-sm transition-all text-[14px] ${
                            isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                          }`}>
                            check
                          </span>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-headline-md text-lg font-bold text-[#131b2e] mb-2">{option.title}</h3>
                        <p className="font-body-md text-xs font-semibold text-[#434655]/85 leading-relaxed">{option.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 5: Study Commitment Selection Screen */}
          {step === 5 && (
            <motion.div
              key="commitment-selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="relative w-full flex flex-col justify-center max-w-[800px] mx-auto z-10"
            >
              {/* Header Section */}
              <div className="mb-8 space-y-2">
                <h1 className="font-display-lg text-headline-lg-mobile md:text-headline-lg text-[#131b2e] font-bold">
                  How much time can you study?
                </h1>
                <p className="font-body-lg text-[#434655] font-semibold text-sm md:text-base max-w-lg">
                  Consistency is key to hitting Band {targetBand?.toFixed(1) || '8.5'}. Choose a daily commitment that fits your lifestyle.
                </p>
              </div>

              {/* Bento Hybrid cards list */}
              <div className="grid grid-cols-1 gap-4 w-full">
                {[
                  { value: 30, label: '30 Mins', subtitle: 'The "Lite" Routine', icon: 'timer_10' },
                  { value: 60, label: '1 Hour', subtitle: 'Balanced Progress', icon: 'schedule' },
                  { value: 120, label: '2 Hours', subtitle: 'Accelerated Growth', icon: 'bolt', recommended: true },
                  { value: 180, label: '3 Hours', subtitle: 'Immersive Training', icon: 'speed' },
                  { value: 240, label: '4+ Hours', subtitle: 'The High-Performance Track', icon: 'rocket_launch' }
                ].map((option) => {
                  const isSelected = studyTime === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setStudyTime(option.value)}
                      className={`commitment-card glass-card inner-highlight w-full p-4 rounded-xl flex items-center justify-between text-left group relative border transition-all duration-300 cursor-pointer ${
                        isSelected ? 'border-[#2563eb] bg-white/90 shadow-[0_0_25px_rgba(37,99,235,0.2)]' : 'border-transparent'
                      }`}
                    >
                      {option.recommended && (
                        <div className="absolute -top-3 right-6 bg-[#2563eb] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                          RECOMMENDED
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#eaedff]/60 flex items-center justify-center text-[#004ac6] group-hover:scale-110 transition-transform duration-300">
                          <span className="material-symbols-outlined text-2xl">{option.icon}</span>
                        </div>
                        <div>
                          <h3 className="font-headline-md text-base font-bold text-[#131b2e]">{option.label}</h3>
                          <p className="text-xs font-semibold text-[#434655]">{option.subtitle}</p>
                        </div>
                      </div>

                      <div className={`selection-indicator transition-all duration-300 ${
                        isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                      }`}>
                        <span className="material-symbols-outlined text-[#2563eb]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          check_circle
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Side Spinning Decoration (Desktop Only) */}
              <div className="hidden lg:block fixed right-10 top-1/2 -translate-y-1/2 w-64 h-64 opacity-20 pointer-events-none z-0">
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 border-[20px] border-[#2563eb] rounded-full animate-[spin_20s_linear_infinite]"></div>
                  <div className="absolute inset-8 border border-[#434655] rounded-full opacity-50"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#004ac6] text-6xl">timelapse</span>
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {/* STEP 6: Personalized Study Roadmap screen */}
          {step === 6 && (
            <motion.div
              key="roadmap-step"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-12 w-full max-w-4xl px-4"
            >
              {/* Header Text */}
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-xs font-bold w-fit mx-auto uppercase tracking-wider">
                  <Sparkles className="h-3 w-3 text-green-500 fill-current animate-pulse" />
                  <span>Personalization Complete</span>
                </div>
                <h1 className="font-display-lg text-3xl md:text-4xl font-extrabold text-[#131b2e]">Your Path to Band {targetBand?.toFixed(1) || '7.5'}</h1>
                <p className="text-sm md:text-base font-semibold text-[#737686] max-w-xl mx-auto leading-relaxed">
                  We've integrated your baseline assessment and study targets to build a custom study plan.
                </p>
              </div>

              {/* Content Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Column: Metrics & Daily Routine */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* Score Progression Panel */}
                  <div className="glass-card rounded-2xl p-6 shadow-md border border-[#c3c6d7]/35 relative overflow-hidden bg-white">
                    <div className="absolute inset-0 dot-grid pointer-events-none"></div>
                    <div className="relative z-10 flex items-center justify-between">
                      <div>
                        <p className="text-[9px] font-bold text-[#737686] uppercase tracking-widest mb-1">Baseline State</p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-[#131b2e]">{roadmapData?.progress?.currentBandEstimate?.toFixed(1) || baselineStats?.currentBand?.toFixed(1) || '6.0'}</span>
                          <span className="text-xs font-semibold text-[#737686]">Band</span>
                        </div>
                      </div>

                      <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-[#004ac6] shadow-sm">
                        <TrendingUp className="h-5 w-5" />
                      </div>

                      <div className="text-right">
                        <p className="text-[9px] font-bold text-[#004ac6] uppercase tracking-widest mb-1">Target Goal</p>
                        <div className="flex items-baseline justify-end gap-1">
                          <span className="text-3xl font-black text-[#004ac6]">{targetBand?.toFixed(1) || '7.5'}</span>
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
                          <p className="text-[10px] font-semibold text-[#737686] mt-0.5">30 Days • Daily AI Coach Sessions</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                        <Clock className="h-5 w-5 text-emerald-600 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-[#131b2e]">Daily Commitment</p>
                          <p className="text-[10px] font-semibold text-[#737686] mt-0.5">{studyTime || 60} Minutes per day</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Strengths & Weaknesses Panel */}
                  <div className="glass-card rounded-2xl p-6 shadow-md border border-[#c3c6d7]/35 relative overflow-hidden bg-white">
                    <h3 className="text-sm font-bold text-[#131b2e] flex items-center gap-2 mb-4 border-b border-slate-50 pb-2">
                      <Award className="h-4.5 w-4.5 text-[#004ac6]" />
                      <span>Skill Diagnostics</span>
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider block mb-1.5">Strong Skills (Maintain)</span>
                        <ul className="space-y-1">
                          {(roadmapData?.progress?.strongSkills?.length ? roadmapData.progress.strongSkills : ['Reading speed', 'Vocabulary width']).slice(0, 2).map((s: string, idx: number) => (
                            <li key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0"></span>
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block mb-1.5">Priority Areas (Focus)</span>
                        <ul className="space-y-1">
                          {(roadmapData?.progress?.weakSkills?.length ? roadmapData.progress.weakSkills : ['Grammatical accuracy', 'Writing structure complexity']).slice(0, 3).map((s: string, idx: number) => (
                            <li key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                              <span className="w-1.5 h-1.5 bg-rose-500 rounded-full shrink-0"></span>
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Column: Visual Timeline Roadmap */}
                <div className="lg:col-span-7">
                  <div className="glass-card rounded-2xl p-6 lg:p-8 shadow-md border border-[#c3c6d7]/35 relative overflow-hidden bg-white min-h-[450px]">
                    <div className="absolute inset-0 dot-grid pointer-events-none"></div>
                    
                    <div className="flex justify-between items-center mb-8 border-b border-slate-50 pb-3">
                      <h2 className="font-headline-md text-base font-bold text-[#131b2e]">Personalized Milestones</h2>
                      <span className="px-3 py-1 bg-[#eaedff] text-[#004ac6] text-[10px] font-black rounded-full uppercase tracking-wider">
                        Custom Plan
                      </span>
                    </div>

                    {/* Timeline list items */}
                    <div className="space-y-8 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:border-l-2 before:border-dashed before:border-[#c3c6d7]/50">
                      
                      {/* Phase 1 */}
                      <div className="relative">
                        <div className="absolute -left-6.5 top-1.5 w-3 h-3 bg-[#004ac6] rounded-full border-2 border-white ring-2 ring-[#004ac6]/10 flex items-center justify-center"></div>
                        <div className="space-y-1">
                          <h4 className="text-xs font-black text-[#004ac6] uppercase tracking-wider font-sans">Phase 1 (Days 1–10): Weakness Elimination</h4>
                          <p className="text-xs text-[#737686] font-semibold leading-relaxed">
                            Focusing heavily on vocabulary building and grammar structure corrections.
                          </p>
                        </div>
                      </div>

                      {/* Phase 2 */}
                      <div className="relative">
                        <div className="absolute -left-6.5 top-1.5 w-3 h-3 bg-[#004ac6] rounded-full border-2 border-white ring-2 ring-[#004ac6]/10 flex items-center justify-center"></div>
                        <div className="space-y-1">
                          <h4 className="text-xs font-black text-[#004ac6] uppercase tracking-wider font-sans">Phase 2 (Days 11–20): Essay Drill & Strategy</h4>
                          <p className="text-xs text-[#737686] font-semibold leading-relaxed">
                            Applying structural cohesion rules to academic essays and skimming/scanning reading speed drills.
                          </p>
                        </div>
                      </div>

                      {/* Phase 3 */}
                      <div className="relative">
                        <div className="absolute -left-6.5 top-1.5 w-3 h-3 bg-[#004ac6] rounded-full border-2 border-white ring-2 ring-[#004ac6]/10 flex items-center justify-center"></div>
                        <div className="space-y-1">
                          <h4 className="text-xs font-black text-[#004ac6] uppercase tracking-wider font-sans">Phase 3 (Days 21–30): Peak Performance</h4>
                          <p className="text-xs text-[#737686] font-semibold leading-relaxed">
                            Simulated test drills, advanced grammatical structures, and expert feedback reports.
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Redirect Footer */}
              <div className="flex flex-col sm:flex-row justify-between items-center p-6 bg-white border border-[#c3c6d7]/35 rounded-2xl gap-4 shadow-sm">
                <div className="space-y-0.5 text-center sm:text-left">
                  <h4 className="text-sm font-bold text-[#131b2e]">Your path is generated! Ready to study?</h4>
                  <p className="text-xs text-[#737686] font-semibold">Your daily missions are waiting on the dashboard.</p>
                </div>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-b from-[#3B82F6] to-[#2563EB] text-white font-bold text-xs rounded-full shadow-lg shadow-indigo-600/10 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer text-center"
                >
                  Enter Dashboard
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* BOTTOM ACTION FOOTER BUTTONS */}
        {step !== 6 && (
          <div className="mt-16 flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            {step === 1 ? (
              null
            ) : step === 3 ? (
              // Calendar is self-contained with inline elements but previous step trigger is useful
              <button
                onClick={() => setStep(2)}
                className="w-full md:w-48 px-8 py-4 border border-[#c3c6d7] rounded-full font-label-md text-[#434655] hover:bg-[#faf8ff] hover:border-[#004ac6] transition-all cursor-pointer font-bold text-sm text-center"
              >
                Previous
              </button>
            ) : (
              <>
                {/* Other wizard steps footer */}
                <button
                  onClick={() => setStep(step - 1)}
                  className="w-full md:w-48 px-8 py-4 border border-[#c3c6d7] rounded-full font-label-md text-[#434655] hover:bg-[#faf8ff] hover:border-[#004ac6] transition-all cursor-pointer font-bold text-sm text-center flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  Previous
                </button>
                
                {step === 5 ? (
                  <button
                    onClick={handleSubmitOnboarding}
                    disabled={studyTime === null || loading}
                    className={`w-full md:w-64 px-8 py-4 rounded-full font-label-md text-white transition-all flex items-center justify-center gap-2 text-sm font-bold relative overflow-hidden ${
                      studyTime !== null && !loading
                        ? 'cursor-pointer hover:shadow-[0_12px_24px_rgba(37,99,235,0.2)] hover:scale-105 active:scale-95'
                        : 'opacity-50 cursor-not-allowed bg-slate-200 text-[#737686]'
                    }`}
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          Continue
                          <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </span>
                        {studyTime !== null && (
                          <div className="absolute inset-0 bg-gradient-to-r from-[#004ac6] to-[#2563eb] transition-opacity duration-300" />
                        )}
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => setStep(step === 2 ? 3 : 5)} // Transition 2 -> 3 or 4 -> 5
                    disabled={step === 2 ? !targetBand : !intent}
                    className={`w-full md:w-64 px-8 py-4 active-pill rounded-full font-label-md text-white transition-all flex items-center justify-center gap-2 text-sm font-bold ${
                      (step === 2 ? targetBand : intent)
                        ? 'cursor-pointer hover:shadow-lg hover:scale-[1.02]'
                        : 'opacity-50 cursor-not-allowed bg-slate-200 text-[#737686]'
                    }`}
                  >
                    Continue
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {/* Page Footer Text Decoration */}
        {step === 2 && (
          <div className="mt-8 opacity-40 hover:opacity-75 transition-all duration-1000 hidden md:block">
            <div className="flex gap-4 items-center">
              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#004ac6]/20 to-transparent"></div>
              <span className="text-[10px] font-bold text-[#434655] tracking-widest uppercase">
                Select one to unlock personalized path
              </span>
              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#004ac6]/20 to-transparent"></div>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
