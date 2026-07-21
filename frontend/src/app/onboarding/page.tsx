'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Trophy, Clock, Target, ArrowRight, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
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
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form states
  const [targetBand, setTargetBand] = useState<number>(7.0);
  const [examDate, setExamDate] = useState<string>('');
  const [goal, setGoal] = useState<string>('');
  const [studyTime, setStudyTime] = useState<number>(60);

  const totalSteps = 4;

  const nextStep = () => {
    if (step === 2 && !examDate) {
      toast.error('Please select a tentative exam date');
      return;
    }
    if (step === 3 && !goal) {
      toast.error('Please select your primary goal');
      return;
    }
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.patch('/users/onboarding', {
        targetBand,
        examDate,
        goal,
        studyTimePerDay: studyTime,
      });
      await refreshUser();
      toast.success('Onboarding complete! Next, complete your placement test.');
      router.push('/assessment');
    } catch (e: any) {
      console.error(e);
      toast.error(e.response?.data?.message || 'Failed to submit onboarding details');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">What is your target band?</h3>
              <p className="text-sm text-slate-400">Most top universities require 6.5 - 7.5 overall.</p>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {[5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map((score) => (
                <button
                  key={score}
                  type="button"
                  onClick={() => setTargetBand(score)}
                  className={`py-4 rounded-xl border text-sm font-bold transition-all ${
                    targetBand === score
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {score}
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">When is your exam date?</h3>
              <p className="text-sm text-slate-400">If tentative, select an approximate target date.</p>
            </div>

            <div className="space-y-4">
              <input
                type="date"
                required
                value={examDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all [color-scheme:dark]"
              />
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                <Trophy className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">What is your primary goal?</h3>
              <p className="text-sm text-slate-400">This helps align recommendations.</p>
            </div>

            <div className="space-y-3">
              {[
                { id: 'study', label: 'Study Abroad (Academic)', desc: 'Get accepted to foreign universities' },
                { id: 'work', label: 'Work & Employment', desc: 'Secure an international job offer' },
                { id: 'migrate', label: 'Permanent Residency', desc: 'Immigrate to UK, Canada, Australia, etc.' },
              ].map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGoal(g.label)}
                  className={`w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-all ${
                    goal === g.label
                      ? 'bg-slate-900 border-indigo-500 text-slate-100 shadow-md'
                      : 'bg-slate-950 border-slate-900 text-slate-400 hover:border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <div className={`mt-0.5 rounded-full h-4 w-4 border-2 flex items-center justify-center ${
                    goal === g.label ? 'border-indigo-500 bg-indigo-500' : 'border-slate-700 bg-transparent'
                  }`}>
                    {goal === g.label && <div className="h-1.5 w-1.5 bg-white rounded-full" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-white">{g.label}</h4>
                    <p className="text-xs text-slate-500 mt-1">{g.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Daily study commitment?</h3>
              <p className="text-sm text-slate-400">How much time can you practice per day?</p>
            </div>

            <div className="space-y-3">
              {[
                { time: 15, label: '15 Minutes', desc: 'Light workout for busy learners' },
                { time: 30, label: '30 Minutes', desc: 'Consistent progression style' },
                { time: 60, label: '60 Minutes (Recommended)', desc: 'Standard preparation speed' },
                { time: 120, label: '120 Minutes', desc: 'Intensive target boot camp' },
              ].map((t) => (
                <button
                  key={t.time}
                  type="button"
                  onClick={() => setStudyTime(t.time)}
                  className={`w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-all ${
                    studyTime === t.time
                      ? 'bg-slate-900 border-indigo-500 text-slate-100 shadow-md'
                      : 'bg-slate-950 border-slate-900 text-slate-400 hover:border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <div className={`mt-0.5 rounded-full h-4 w-4 border-2 flex items-center justify-center ${
                    studyTime === t.time ? 'border-indigo-500 bg-indigo-500' : 'border-slate-700 bg-transparent'
                  }`}>
                    {studyTime === t.time && <div className="h-1.5 w-1.5 bg-white rounded-full" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-white">{t.label}</h4>
                    <p className="text-xs text-slate-500 mt-1">{t.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      {/* Background blur */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl filter" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl filter" />

      <div className="w-full max-w-lg z-10 space-y-8">
        {/* Progress header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold tracking-wider uppercase">
            <span>Setup Onboarding</span>
            <span>Step {step} of {totalSteps}</span>
          </div>
          <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-indigo-500"
              initial={{ width: '0%' }}
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-8 shadow-2xl">
          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>

          {/* Action buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-800/60">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className={`flex items-center gap-1.5 text-sm font-semibold transition-all ${
                step === 1 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>

            {step === totalSteps ? (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-all shadow-md shadow-emerald-500/10 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <span>Finish Setup</span>
                    <Sparkles className="h-4 w-4" />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shadow-md shadow-indigo-500/10"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
