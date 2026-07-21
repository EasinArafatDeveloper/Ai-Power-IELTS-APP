'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import {
  Compass,
  Sparkles,
  ArrowRight,
  Target,
  FileText,
  HelpCircle,
  CheckCircle,
  ChevronRight,
  BrainCircuit
} from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
    <div className="relative flex-1 bg-slate-50 text-slate-900 min-h-screen overflow-x-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sky-500/5 rounded-full blur-3xl" />
      
      {/* Navbar */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-600">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-wider uppercase text-slate-900">AI IELTS Coach</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block -mt-0.5">Bangladesh</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/10"
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-100 bg-indigo-50 text-indigo-700 text-xs font-bold shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            <span>Premium AI Learning Coach for Bangladesh</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 leading-tight font-sans tracking-tight max-w-3xl mx-auto bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-700">
            Personalized AI Coaching to Master Your Target IELTS Band.
          </h1>

          <p className="text-slate-655 text-base max-w-lg mx-auto leading-relaxed">
            Stop practicing blindly. Get diagnostic assessments, custom daily study guides, and sentence-level AI corrections on writing.
          </p>

          <div className="pt-4 flex items-center justify-center gap-4">
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20"
            >
              <span>Start Free Evaluation</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 border-t border-slate-200">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-2xl font-black text-slate-900 font-sans sm:text-3xl">Engineered for Band 7.5+ Targets.</h2>
          <p className="text-xs text-slate-450 uppercase tracking-widest font-bold">Bangladeshi Student Learning Blueprints</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          
          <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-between hover:border-indigo-500/30 hover:shadow-md transition-all shadow-sm">
            <div className="space-y-3">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100/50">
                <BrainCircuit className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-950">AI Diagnostic Assessment</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Take our 10-minute placement test in grammar, vocab, and reading to unlock an estimated CEFR rating and custom focus plan.
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-between hover:border-emerald-500/30 hover:shadow-md transition-all shadow-sm">
            <div className="space-y-3">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100/50">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-950">Daily Study Blueprints</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Receive customized daily checklists adjusted to target your weak areas. Includes translation prompts and guidance.
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-between hover:border-sky-500/30 hover:shadow-md transition-all shadow-sm">
            <div className="space-y-3">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-sky-50 text-sky-655 border border-sky-100/50">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-950">AI Essay Scoring Engine</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Submit Task 1 and Task 2 essays for grading across IELTS criteria. Review exact grammatical error diffs and band 9 rewrites.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Pricing Mock Placeholder Card */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 border-t border-slate-200">
        <div className="max-w-md mx-auto bg-white border border-indigo-200 rounded-3xl p-8 text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl" />
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border text-indigo-600 bg-indigo-50 border-indigo-100 tracking-widest">
              Pricing Sandbox Mode
            </span>
            <h3 className="text-xl font-bold text-slate-950 font-sans mt-2">Unlimited Coach Access</h3>
            <p className="text-xs text-slate-450">Everything unlocked for the MVP Developer Sandbox evaluation.</p>
          </div>

          <div className="text-4xl font-extrabold text-slate-900">$0 <span className="text-xs text-slate-400 font-semibold">/ forever</span></div>

          <ul className="text-xs text-slate-655 space-y-2.5 text-left max-w-[220px] mx-auto font-medium">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-indigo-500 shrink-0" />
              <span>Full AI Writing Evaluator</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-indigo-500 shrink-0" />
              <span>Spaced Vocabulary Trainer</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-indigo-500 shrink-0" />
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
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 border-t border-slate-200">
        <div className="text-center mb-8">
          <h2 className="text-xl font-black text-slate-900">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {[
            { q: 'Is the evaluation really powered by Gemini/DeepSeek?', a: 'Yes. The backend parses student submissions directly into the structured AI modules to ensure precise corrections based on actual IELTS criteria.' },
            { q: 'How does the dynamic Study Plan checklist work?', a: 'Once onboarding targets and placement diagnostic are completed, the system projects a daily checklist schedule adjusted to target specific focus areas.' },
          ].map((faq, idx) => (
            <div key={idx} className="bg-white border border-slate-200 p-5 rounded-2xl space-y-2 shadow-sm">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <HelpCircle className="h-4 w-4 text-indigo-500" />
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed pl-5.5">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 relative z-10 text-center text-xs text-slate-400">
        <p>© 2026 AI IELTS Coach. Built with Next.js 15, NestJS & DeepSeek/Gemini.</p>
      </footer>
    </div>
  );
}
