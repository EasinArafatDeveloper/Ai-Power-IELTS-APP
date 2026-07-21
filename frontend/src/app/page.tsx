'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import {
  Compass,
  Sparkles,
  ArrowRight,
  Target,
  FileText,
  Flame,
  HelpCircle,
  CheckCircle,
  MessageCircle,
  Lock,
  ChevronRight,
  TrendingUp,
  BrainCircuit,
  BookOpen
} from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const router = useRouter();

  // Ref container for GSAP animations
  const heroRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP landing page entrance animations
    if (heroRef.current) {
      const children = heroRef.current.children;
      gsap.fromTo(
        children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
        }
      );
    }
  }, []);

  return (
    <div className="relative flex-1 bg-slate-950 text-slate-100 min-h-screen overflow-x-hidden">
      {/* Background glow grids */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sky-500/5 rounded-full blur-3xl animate-pulse" />
      
      {/* Sticky Top Navbar */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
              <Compass className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-sm tracking-wider uppercase text-white">AI IELTS Coach</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-xs font-bold text-slate-400 hover:text-slate-200 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-500/10"
            >
              <span>Get Started</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center relative z-10">
        <div ref={heroRef} className="space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Next-Gen IELTS Coach (Beta)</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight font-sans tracking-tight max-w-3xl mx-auto bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-100 to-slate-400">
            Personalized AI Coaching to Master Your Target IELTS Band.
          </h1>

          <p className="text-slate-400 text-base max-w-lg mx-auto leading-relaxed">
            Stop practicing blindly. Get diagnostic level assessments, custom daily study guides, and sentence-level AI feedback on writing.
          </p>

          <div className="pt-4 flex items-center justify-center gap-4">
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20"
            >
              <span>Start Free Evaluation</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Bento Grid Features Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 border-t border-slate-900/60">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-2xl font-black text-white font-sans sm:text-3xl">Engineered for Band 7.5+ Targets.</h2>
          <p className="text-xs text-slate-450 uppercase tracking-widest font-semibold">Four Modular Systems Combined</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          
          <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-2xl flex flex-col justify-between hover:border-slate-800 transition-colors">
            <div className="space-y-3">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                <BrainCircuit className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-200">AI Diagnostic Assessment</h3>
              <p className="text-xs text-slate-450 leading-relaxed">
                Take our 10-minute diagnostic test in grammar, vocab, and reading to unlock an estimated CEFR rating and custom focus plan.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-2xl flex flex-col justify-between hover:border-slate-800 transition-colors">
            <div className="space-y-3">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-200">Daily Study Guides</h3>
              <p className="text-xs text-slate-450 leading-relaxed">
                Receive customized daily focus checksheets dynamically adjusted to target weak areas. Finish daily tasks to increase streaks.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-2xl flex flex-col justify-between hover:border-slate-800 transition-colors">
            <div className="space-y-3">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-sky-500/10 text-sky-400">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-200">AI Essay Scoring Engine</h3>
              <p className="text-xs text-slate-450 leading-relaxed">
                Submit Task 1 and Task 2 essays for grading across IELTS criteria. Review exact grammatical error diffs and band 9 rewrites.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Pricing Mock Placeholder Card */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 border-t border-slate-900/60">
        <div className="max-w-md mx-auto bg-slate-900/60 border border-indigo-500/20 rounded-3xl p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl" />
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border text-indigo-400 bg-indigo-500/10 border-indigo-500/20 tracking-widest">
              Pricing Sandbox Mode
            </span>
            <h3 className="text-xl font-bold text-white font-sans mt-2">Unlimited Access</h3>
            <p className="text-xs text-slate-450">Everything unlocked for the MVP Developer Sandbox evaluation.</p>
          </div>

          <div className="text-4xl font-extrabold text-white">$0 <span className="text-xs text-slate-500 font-semibold">/ forever</span></div>

          <ul className="text-xs text-slate-350 space-y-2.5 text-left max-w-[220px] mx-auto font-medium">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-indigo-400 shrink-0" />
              <span>Full AI Writing Evaluator</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-indigo-400 shrink-0" />
              <span>Spaced-Repetition Vocabulary</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-indigo-400 shrink-0" />
              <span>Daily Study Checklists</span>
            </li>
          </ul>

          <Link
            href="/login"
            className="block w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/10"
          >
            Start Practicing Instantly
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 border-t border-slate-900/60">
        <div className="text-center mb-8">
          <h2 className="text-xl font-black text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {[
            { q: 'Is the evaluation really powered by Gemini/DeepSeek?', a: 'Yes. The backend parses student submissions directly into the structured AI modules to ensure precise corrections based on actual IELTS criteria.' },
            { q: 'How does the dynamic Study Plan checklist work?', a: 'Once onboarding targets and placement diagnostic are completed, the system projects a daily checklist schedule adjusted to target specific focus areas.' },
          ].map((faq, idx) => (
            <div key={idx} className="bg-slate-900/30 border border-slate-850 p-5 rounded-2xl space-y-2">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <HelpCircle className="h-4 w-4 text-indigo-400" />
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs text-slate-450 leading-relaxed pl-5.5">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 relative z-10 text-center text-xs text-slate-550">
        <p>© 2026 AI IELTS Coach. Built with Next.js 15, NestJS & DeepSeek/Gemini.</p>
      </footer>
    </div>
  );
}
