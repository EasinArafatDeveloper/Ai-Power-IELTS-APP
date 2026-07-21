'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  BrainCircuit,
  TrendingUp,
  Flame,
  Award,
  Globe,
  Star,
  Plus,
  Minus,
  MessageSquare,
  Clock,
  BookOpen,
  Volume2,
  ChevronDown,
  Play
} from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  
  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Live Writing Demo State
  const [writingTab, setWritingTab] = useState<'original' | 'improved'>('original');

  useEffect(() => {
    if (heroRef.current) {
      const children = heroRef.current.children;
      gsap.fromTo(
        children,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
        }
      );
    }
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="relative flex-1 bg-[#faf8ff] text-[#131b2e] min-h-screen overflow-x-hidden font-sans">
      
      {/* Background blobs & glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-300/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
      <div className="absolute top-[800px] left-10 w-[500px] h-[500px] bg-indigo-200/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" style={{ animationDelay: '2.5s' }} />
      <div className="absolute bottom-[400px] right-10 w-[600px] h-[600px] bg-sky-200/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" style={{ animationDelay: '5s' }} />

      {/* Header Sticky Navbar */}
      <header className="border-b border-[#c3c6d7]/40 bg-white/70 backdrop-blur-md sticky top-0 z-50 shadow-sm transition-all">
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0053db]/10 border border-[#0053db]/20 text-[#004ac6] shadow-sm animate-float">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight font-sans text-[#131b2e] block">Lumina IELTS</span>
              <span className="text-[9px] font-bold text-[#004ac6] uppercase tracking-widest block -mt-1 font-mono">Premium AI Coach</span>
            </div>
          </div>

          {/* Navigation Links list */}
          <nav className="hidden md:flex items-center gap-6 text-[13px] font-semibold text-[#434655]">
            <a href="#advantages" className="hover:text-[#004ac6] transition-colors">Advantages</a>
            <a href="#roadmap" className="hover:text-[#004ac6] transition-colors">Roadmap</a>
            <a href="#writing" className="hover:text-[#004ac6] transition-colors">Writing Coach</a>
            <a href="#pricing" className="hover:text-[#004ac6] transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-xs font-bold text-[#434655] hover:text-[#131b2e] transition-colors uppercase tracking-wider font-sans"
            >
              Sign In
            </Link>
            
            {/* Pill Success button style */}
            <Link href="/login" className="btn-pill-primary px-5 py-2.5 text-xs font-bold uppercase">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* 1. Hero Section */}
      <section className="max-w-[1280px] mx-auto px-6 py-20 lg:py-24 grid lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left column hero title & info */}
        <div ref={heroRef} className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-100 bg-[#f2f3ff] text-[#004ac6] text-xs font-bold shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-[#004ac6]" />
            <span>AI-First IELTS Learning Experience</span>
          </div>

          <h1 className="text-[40px] sm:text-[54px] font-black text-[#131b2e] leading-[1.1] font-sans tracking-tight max-w-2xl">
            Move from Band 6 to 8 with <span className="text-[#004ac6]">AI guidance.</span>
          </h1>

          <p className="text-[#434655] text-base leading-[1.6] font-normal max-w-xl">
            The first dynamic, adaptive system that builds custom daily lessons and reviews. Get instant, sentence-level corrections on writing, grammar, and speaking.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 items-center">
            <Link
              href="/login"
              className="btn-pill-primary px-7 py-3.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2"
            >
              <span>Get Started</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </Link>

            <Link
              href="/login"
              className="btn-pill-secondary px-6 py-3.5 text-xs font-bold uppercase flex items-center gap-2"
            >
              <Play className="h-3.5 w-3.5 fill-current text-[#434655]" />
              <span>Watch Demo</span>
            </Link>
          </div>
        </div>

        {/* Right column: Glassmorphic Dashboard Preview panel */}
        <div className="lg:col-span-5 relative">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-[#0053db] to-[#2563eb] opacity-10 blur-xl animate-pulse-slow" />
          
          {/* Frosted glass template layout overlay */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative glass-card dot-grid p-6 rounded-3xl space-y-6"
          >
            {/* Header / Streak */}
            <div className="flex justify-between items-center border-b border-[#c3c6d7]/30 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[10px] font-bold text-[#434655] uppercase tracking-widest">Live Progress</span>
              </div>
              <div className="flex items-center gap-1.5 bg-amber-500/10 text-amber-700 px-2 py-0.5 border border-amber-200/50 rounded-lg text-[10px] font-bold">
                <Flame className="h-3.5 w-3.5 fill-current text-amber-500" />
                <span>3 Day Streak</span>
              </div>
            </div>

            {/* Current vs Target score circle charts */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/50 border border-[#c3c6d7]/20 rounded-2xl text-center space-y-1">
                <span className="text-[9px] text-[#434655] font-bold uppercase tracking-wider block">Current Score</span>
                <div className="text-3xl font-black text-[#131b2e]">6.0</div>
                <span className="text-[8px] font-bold text-[#434655]">CEFR B2 Level</span>
              </div>
              <div className="p-4 bg-[#f2f3ff] border border-blue-100 rounded-2xl text-center space-y-1">
                <span className="text-[9px] text-[#004ac6] font-bold uppercase tracking-wider block">Target Band</span>
                <div className="text-3xl font-black text-[#004ac6]">8.0</div>
                <span className="text-[8px] font-bold text-blue-500">Premium Goal</span>
              </div>
            </div>

            {/* Today's Focus Checklist */}
            <div className="space-y-3.5">
              <span className="text-[9px] text-[#434655] font-bold uppercase tracking-widest block">Today's Focus Tasks</span>
              
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-3 p-3 bg-white/70 border border-[#c3c6d7]/30 rounded-xl shadow-sm">
                  <div className="h-5 w-5 rounded-full border border-[#0053db] bg-blue-50 flex items-center justify-center text-[#004ac6] shrink-0">
                    <CheckCircle className="h-3.5 w-3.5 text-[#004ac6] fill-current" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-[#131b2e]">Review 5 AI Vocabulary Words</div>
                    <div className="text-[9px] text-[#004ac6] font-bold mt-0.5 font-mono">Suggested definitions ready</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white/70 border border-[#c3c6d7]/30 rounded-xl shadow-sm">
                  <div className="h-5 w-5 rounded-full border border-slate-200 shrink-0" />
                  <div className="flex-1">
                    <div className="font-bold text-[#131b2e]">Draft Essay Task 2 Outline</div>
                    <div className="text-[9px] text-emerald-600 font-bold mt-0.5">Topic: Technology & Education</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Trend progression bar graph visual */}
            <div className="pt-2 border-t border-[#c3c6d7]/30">
              <div className="flex justify-between items-center text-[10px] text-[#434655] font-bold uppercase tracking-wider mb-2">
                <span>Band Progression Trend</span>
                <span className="text-emerald-600 font-black">+2.0 Bands</span>
              </div>
              <div className="h-16 flex items-end gap-1.5 justify-between">
                {[4.5, 4.8, 5.0, 5.5, 6.0, 6.5, 7.0, 8.0].map((val, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className={`w-full rounded-t-md transition-all ${
                        idx === 7 ? 'bg-[#004ac6]' : 'bg-[#e2e7ff]'
                      }`}
                      style={{ height: `${(val / 9) * 45}px` }}
                    />
                    <span className="text-[8px] font-mono text-[#434655]">D{idx+1}</span>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        </div>

      </section>

      {/* 2. Trusted By logos section */}
      <section className="max-w-[1280px] mx-auto px-6 py-10 text-center relative z-10 border-t border-b border-[#c3c6d7]/30 my-8">
        <p className="text-[10px] text-[#434655] font-bold uppercase tracking-widest mb-6">Designed to match scoring metrics set by</p>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 opacity-50 grayscale font-mono">
          <span className="text-xs sm:text-sm font-black tracking-widest text-[#131b2e] uppercase">Oxford University</span>
          <span className="text-xs sm:text-sm font-black tracking-widest text-[#131b2e] uppercase">Cambridge ESOL</span>
          <span className="text-xs sm:text-sm font-black tracking-widest text-[#131b2e] uppercase">Stanford Uni</span>
          <span className="text-xs sm:text-sm font-black tracking-widest text-[#131b2e] uppercase">Harvard Partner</span>
        </div>
      </section>

      {/* 3. Why Choose Us (The AI Advantage) */}
      <section id="advantages" className="max-w-[1280px] mx-auto px-6 py-16 relative z-10 text-center space-y-12">
        <div className="space-y-3">
          <h2 className="text-[32px] font-black text-[#131b2e] leading-[1.2] font-sans tracking-tight">The AI Advantage</h2>
          <p className="text-xs text-[#004ac6] font-bold uppercase tracking-widest font-mono">Traditional learning is expensive and limited. IELTS AI is your active 24/7 personal tutor.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          
          <div className="glass-card dot-grid p-6 rounded-2xl text-left hover:border-[#004ac6]/30 hover:shadow-md transition-all">
            <div className="h-10 w-10 bg-blue-50 border border-blue-100 text-[#004ac6] rounded-xl flex items-center justify-center mb-4">
              <Globe className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-[#131b2e] text-sm mb-2">Personalized Roadmap</h3>
            <p className="text-xs text-[#434655] leading-[1.6] font-medium">
              We analyze your dynamic level from a 10-min test and balance your daily focus tasks automatically. Every weakness turns into a goal task.
            </p>
          </div>

          <div className="glass-card dot-grid p-6 rounded-2xl text-left hover:border-emerald-500/30 hover:shadow-md transition-all">
            <div className="h-10 w-10 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-[#131b2e] text-sm mb-2">AI Writing Feedback</h3>
            <p className="text-xs text-[#434655] leading-[1.6] font-medium">
              Submit Task 1 and Task 2 essays for grading across IELTS criteria. Review exact grammatical error diffs and band 9 rewrites instantly.
            </p>
          </div>

          <div className="glass-card dot-grid p-6 rounded-2xl text-left hover:border-violet-500/30 hover:shadow-md transition-all">
            <div className="h-10 w-10 bg-[#eaedff] border border-blue-100 text-[#004ac6] rounded-xl flex items-center justify-center mb-4">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-[#131b2e] text-sm mb-2">Real-time Speaking Coach</h3>
            <p className="text-xs text-[#434655] leading-[1.6] font-medium">
              Future speech modules will analyze pronunciation, lexical resource limits, flow dynamics, and pauses to grade speaking skills.
            </p>
          </div>

        </div>
      </section>

      {/* 4. How It Works Timeline (Your Path to Band 8) */}
      <section id="roadmap" className="max-w-[1280px] mx-auto px-6 py-16 relative z-10 text-center space-y-12">
        <div className="space-y-3">
          <h2 className="text-[32px] font-black text-[#131b2e] font-sans tracking-tight">Your Path to Band 8</h2>
          <p className="text-xs text-[#004ac6] font-bold uppercase tracking-widest font-mono">Simple, data-driven milestones to build your target capabilities.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-5 relative">
          
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#c3c6d7]/30 -translate-y-1/2 hidden sm:block z-0" />
          
          {[
            { step: '01', title: 'Assessment', desc: '10-minute diagnostic test of your reading, writing, and grammar base.', color: 'bg-indigo-50 text-[#004ac6]' },
            { step: '02', title: 'Analysis', desc: 'Identifying grammatical gaps and vocabulary range limits.', color: 'bg-blue-50 text-blue-600' },
            { step: '03', title: 'Study Plan', desc: 'Dynamic daily planner with translation prompts and task lists.', color: 'bg-emerald-50 text-emerald-600' },
            { step: '04', title: 'Improve', desc: 'Detailed, criteria-wise scoring checks from our AI model.', color: 'bg-amber-50 text-amber-600' },
            { step: '08', title: 'Band 8', desc: 'Securing your target score for PR visas or universities.', color: 'bg-emerald-100 text-emerald-800' }
          ].map((item, idx) => (
            <div key={idx} className="glass-card p-6 rounded-2xl relative z-10 space-y-3 shadow-sm hover:shadow-md transition-all text-left">
              <span className={`text-[11px] font-black uppercase px-2.5 py-0.5 rounded-md font-mono ${item.color}`}>
                {item.step}
              </span>
              <h4 className="font-bold text-[#131b2e] text-sm">{item.title}</h4>
              <p className="text-[11px] text-[#434655] leading-relaxed font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. AI Writing Demo (The Writing Revolution) */}
      <section id="writing" className="max-w-[1280px] mx-auto px-6 py-16 relative z-10 grid lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side Info */}
        <div className="lg:col-span-6 space-y-6">
          <h2 className="text-[32px] font-black text-[#131b2e] font-sans tracking-tight leading-[1.2]">
            The Writing Revolution
          </h2>
          <p className="text-sm text-[#434655] leading-[1.6]">
            Writing is the most difficult module for 90% of students. Our AI detects grammar slips and vocabulary limits dynamically while explaining why.
          </p>

          <ul className="space-y-3.5 text-xs text-[#434655] font-semibold">
            <li className="flex items-center gap-3">
              <CheckCircle className="h-4.5 w-4.5 text-[#004ac6] shrink-0" />
              <span>Real-time difference highlighted comparisons</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle className="h-4.5 w-4.5 text-[#004ac6] shrink-0" />
              <span>Criteria scoring across all 4 official metrics</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle className="h-4.5 w-4.5 text-[#004ac6] shrink-0" />
              <span>Sentence alternative suggestions for vocabulary</span>
            </li>
          </ul>
        </div>

        {/* Right Side Editor preview */}
        <div className="lg:col-span-6">
          <div className="glass-card rounded-3xl p-6 shadow-xl space-y-4 text-left">
            <div className="flex justify-between items-center border-b border-[#c3c6d7]/30 pb-3">
              <div className="flex gap-2">
                <button
                  onClick={() => setWritingTab('original')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider ${
                    writingTab === 'original'
                      ? 'bg-rose-50 border border-rose-100 text-rose-700'
                      : 'text-[#434655] hover:text-[#131b2e]'
                  }`}
                >
                  Draft (Band 6.0)
                </button>
                <button
                  onClick={() => setWritingTab('improved')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider ${
                    writingTab === 'improved'
                      ? 'bg-emerald-50 border border-emerald-100 text-emerald-700'
                      : 'text-[#434655] hover:text-[#131b2e]'
                  }`}
                >
                  AI Rewritten (Band 8.0)
                </button>
              </div>
            </div>

            <div className="text-xs leading-relaxed font-semibold p-4 rounded-xl min-h-24 bg-[#faf8ff] border border-[#c3c6d7]/40">
              {writingTab === 'original' ? (
                <p>
                  In the present days, technology <span className="bg-rose-100 text-rose-900 px-1 border border-rose-200 rounded line-through">have a big impact on</span> education. Many students <span className="bg-rose-100 text-rose-900 px-1 border border-rose-200 rounded line-through">don't goes to</span> school and learn from home computer. But sometimes computers <span className="bg-rose-100 text-rose-900 px-1 border border-rose-200 rounded line-through">makes student distracted</span>.
                </p>
              ) : (
                <p>
                  In contemporary society, technology <span className="bg-emerald-100 text-emerald-900 px-1 border border-emerald-200 rounded font-bold">exerts a profound influence on</span> education. Numerous students <span className="bg-emerald-100 text-emerald-900 px-1 border border-emerald-200 rounded font-bold">opt for remote learning rather than attending</span> traditional classrooms. However, digital devices can occasionally <span className="bg-emerald-100 text-emerald-900 px-1 border border-emerald-200 rounded font-bold">engender student distraction</span>.
                </p>
              )}
            </div>

            <div className="p-3 bg-[#eaedff] border border-blue-100 rounded-xl text-[11px] text-[#004ac6] font-semibold">
              {writingTab === 'original' ? (
                <span>⚠️ Syntax errors and basic verbs limit Lexical Resource to band 6.0.</span>
              ) : (
                <span>💡 Academic collocations and precise syntax lift criteria score to band 8.0.</span>
              )}
            </div>
          </div>
        </div>

      </section>

      {/* 9. Success Stories Section */}
      <section className="max-w-[1280px] mx-auto px-6 py-16 relative z-10 text-center space-y-12">
        <div className="space-y-2">
          <h2 className="text-[32px] font-black text-[#131b2e] font-sans tracking-tight">Success Stories</h2>
          <p className="text-xs text-[#004ac6] font-bold uppercase tracking-widest font-mono">Ambitious professionals who reached target scores.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: 'Sandeep Sharma', score: 'IELTS Band 8.5', desc: 'The detailed error analysis fixed my essay structure. I scored 8.5 in writing after using Lumina IELTS for 3 weeks!', region: 'Delhi, India', stars: 5 },
            { name: 'Nusrat Jahan', score: 'IELTS Band 8.0', desc: 'Spaced repetition cards with local Bangla translations are outstanding. The reading passage helpers really improved my scores.', region: 'Dhaka, Bangladesh', stars: 5 },
            { name: 'Li Wei', score: 'IELTS Band 7.5', desc: 'Unlike other practice tests, Lumina IELTS is completely adaptive. The AI focus lists helped manage my review time.', region: 'Shanghai, China', stars: 5 },
          ].map((t, idx) => (
            <div key={idx} className="glass-card p-6 rounded-2xl text-left space-y-4 shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-extrabold text-sm text-[#131b2e]">{t.name}</h4>
                  <span className="text-[10px] text-[#434655] font-bold block">{t.region}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-[#004ac6] block">{t.score}</span>
                  <div className="flex gap-0.5 text-amber-500 mt-1">
                    {[...Array(t.stars)].map((_, s) => <Star key={s} className="h-3 w-3 fill-current" />)}
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#434655] leading-relaxed font-semibold italic">"{t.desc}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* 10. Pricing Plans */}
      <section id="pricing" className="max-w-[1280px] mx-auto px-6 py-16 relative z-10 text-center space-y-12">
        <div className="space-y-3">
          <h2 className="text-[32px] font-black text-[#131b2e] font-sans tracking-tight">Simple, Transparent Pricing</h2>
          <p className="text-xs text-[#004ac6] font-bold uppercase tracking-widest font-mono">No hidden fees. Cancel anytime.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3 items-stretch max-w-4xl mx-auto">
          
          {/* Plan 1: Starter BDT 0 */}
          <div className="glass-card p-8 rounded-3xl flex flex-col justify-between text-left shadow-sm hover:shadow-md transition-all">
            <div className="space-y-4">
              <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-md border border-[#c3c6d7]/30 text-[#434655] bg-slate-50 uppercase tracking-widest">
                Starter
              </span>
              <h3 className="text-xl font-bold text-[#131b2e]">Free Access</h3>
              <p className="text-xs text-[#434655] leading-relaxed">Evaluation and mock diagnostic sandbox limits.</p>
              
              <div className="text-3xl font-black text-[#131b2e]">$0 <span className="text-xs text-[#434655] font-semibold">/ month</span></div>

              <ul className="space-y-2.5 text-xs text-[#434655] font-semibold pt-4 border-t border-[#c3c6d7]/30">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#004ac6] shrink-0" />
                  <span>Grammar Check</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#004ac6] shrink-0" />
                  <span>3 daily roadmap tasks</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#004ac6] shrink-0" />
                  <span>Limited Vocabulary Decks</span>
                </li>
              </ul>
            </div>

            <Link href="/login" className="btn-pill-secondary w-full py-3.5 text-xs font-bold uppercase text-center mt-6">
              Current Plan
            </Link>
          </div>

          {/* Plan 2: Professional (Active blue container style) */}
          <div className="bg-[#2563eb] text-white rounded-3xl p-8 flex flex-col justify-between text-left shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#004ac6] text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-xl">
              RECOMMENDED
            </div>

            <div className="space-y-4">
              <span className="text-[9px] font-extrabold px-2.5 py-0.5 rounded-md border border-blue-400 text-white bg-blue-600/50 uppercase tracking-widest">
                Professional
              </span>
              <h3 className="text-xl font-bold">Premium</h3>
              <p className="text-xs text-blue-100 leading-relaxed">Complete DeepSeek/Gemini diagnostic support & unlimited writing checking.</p>
              
              <div className="text-3xl font-black">$29 <span className="text-xs text-blue-200 font-semibold">/ month</span></div>

              <ul className="space-y-2.5 text-xs text-blue-100 font-medium pt-4 border-t border-blue-400">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#bdffdb] shrink-0" />
                  <span>Unlimited Practice Tests</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#bdffdb] shrink-0" />
                  <span>Full AI Writing Evaluator</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#bdffdb] shrink-0" />
                  <span>Adaptive Focus Roadmaps</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#bdffdb] shrink-0" />
                  <span>Premium Support</span>
                </li>
              </ul>
            </div>

            <Link href="/login" className="w-full py-3.5 text-xs font-bold uppercase text-center mt-6 bg-white text-[#004ac6] rounded-full hover:bg-slate-50 transition-all shadow-sm">
              Get Professional
            </Link>
          </div>

          {/* Plan 3: Enterprise */}
          <div className="glass-card p-8 rounded-3xl flex flex-col justify-between text-left shadow-sm hover:shadow-md transition-all">
            <div className="space-y-4">
              <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-md border border-[#c3c6d7]/30 text-[#434655] bg-slate-50 uppercase tracking-widest">
                Enterprise
              </span>
              <h3 className="text-xl font-bold text-[#131b2e]">Custom</h3>
              <p className="text-xs text-[#434655] leading-relaxed">For language schools and study agency licenses.</p>
              
              <div className="text-3xl font-black text-[#131b2e]">Custom <span className="text-xs text-[#434655] font-semibold">/ pricing</span></div>

              <ul className="space-y-2.5 text-xs text-[#434655] font-semibold pt-4 border-t border-[#c3c6d7]/30">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#004ac6] shrink-0" />
                  <span>Multi-user Dashboards</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#004ac6] shrink-0" />
                  <span>Batch progress reports</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#004ac6] shrink-0" />
                  <span>Dedicated server resources</span>
                </li>
              </ul>
            </div>

            <Link href="/login" className="btn-pill-secondary w-full py-3.5 text-xs font-bold uppercase text-center mt-6">
              Contact Sales
            </Link>
          </div>

        </div>
      </section>

      {/* 11. FAQ Accordions */}
      <section className="max-w-[1280px] mx-auto px-6 py-16 relative z-10 text-center space-y-8">
        <div className="space-y-2">
          <h2 className="text-xl font-black text-[#131b2e] sm:text-2xl">Frequently Asked Questions</h2>
          <p className="text-xs text-[#434655] uppercase tracking-wider font-bold">Learn more about how Lumina IELTS operates</p>
        </div>

        <div className="space-y-3 text-left max-w-3xl mx-auto">
          {[
            { q: 'Can I pay with local payment methods in Bangladesh?', a: 'Yes. BDT payment options including bKash, Nagad, Rocket, and local debit cards are supported through our payment partner checkout flows.' },
            { q: 'Is the initial placement test mandatory?', a: 'Yes. The placement test determines your base CEFR level (B1, B2, C1, etc.) and allows the AI engine to customize your daily task lists correctly.' },
            { q: 'How accurate is the essay grading?', a: 'Lumina IELTS uses advanced LLM grading calibrated against standard IELTS assessment criteria (GRA, LR, CC, TA), delivering precise score estimates and sentence suggestions.' },
          ].map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="bg-white border border-[#c3c6d7]/40 rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex justify-between items-center p-5 text-xs font-bold text-[#131b2e] text-left transition-colors hover:bg-slate-50/50"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-4.5 w-4.5 text-[#434655] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 pt-0 border-t border-[#c3c6d7]/20 text-xs text-[#434655] leading-relaxed font-semibold pl-5">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* 12. Final CTA */}
      <section className="max-w-[1280px] mx-auto px-6 py-16 relative z-10 text-center">
        <div className="bg-gradient-to-tr from-[#004ac6] to-[#2563eb] rounded-3xl p-10 sm:p-16 text-white space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-[32px] sm:text-[40px] font-black tracking-tight leading-[1.1] font-sans">
            Your dream band starts here.
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-lg mx-auto font-semibold">
            Join thousands of ambitious students who skipped expensive classes and secured their target IELTS band score.
          </p>
          <div className="pt-4 flex justify-center">
            {/* Glossy Primary pill button */}
            <Link href="/login" className="btn-pill-primary px-8 py-4 text-xs font-bold uppercase flex items-center gap-2 bg-[#ffffff] text-[#004ac6] hover:bg-slate-50">
              <span>Get Started for Free</span>
              <ChevronRight className="h-4.5 w-4.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 13. Footer */}
      <footer className="border-t border-[#c3c6d7]/30 bg-white py-12 relative z-10 text-xs text-[#434655]">
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 text-left">
          
          <div className="space-y-4 col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-[#004ac6]" />
              <span className="text-[#131b2e] font-extrabold tracking-tight">Lumina IELTS</span>
            </div>
            <p className="text-[11px] text-[#434655] leading-relaxed">
              Providing self-paced, AI-first preparation modules designed to unlock target band scores for global careers.
            </p>
          </div>

          <div className="space-y-3">
            <h5 className="font-extrabold text-[#131b2e] uppercase text-[10px] tracking-wider">Product</h5>
            <ul className="space-y-2 text-[11px] font-semibold">
              <li><Link href="/dashboard" className="hover:text-[#004ac6]">Dashboard</Link></li>
              <li><Link href="/dashboard" className="hover:text-[#004ac6]">AI Roadmap</Link></li>
              <li><Link href="/dashboard" className="hover:text-[#004ac6]">Writing Evaluator</Link></li>
              <li><Link href="/dashboard" className="hover:text-[#004ac6]">Speaking Evaluator</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-extrabold text-[#131b2e] uppercase text-[10px] tracking-wider">Resources</h5>
            <ul className="space-y-2 text-[11px] font-semibold">
              <li><a href="#" className="hover:text-[#004ac6]">Career Guide</a></li>
              <li><a href="#" className="hover:text-[#004ac6]">Tutor Stories</a></li>
              <li><a href="#" className="hover:text-[#004ac6]">Help Center</a></li>
              <li><a href="#" className="hover:text-[#004ac6]">FAQ</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-extrabold text-[#131b2e] uppercase text-[10px] tracking-wider">Company</h5>
            <ul className="space-y-2 text-[11px] font-semibold">
              <li><a href="#" className="hover:text-[#004ac6]">About Us</a></li>
              <li><a href="#" className="hover:text-[#004ac6]">Careers</a></li>
              <li><a href="#" className="hover:text-[#004ac6]">Contact</a></li>
              <li><a href="#" className="hover:text-[#004ac6]">Privacy</a></li>
            </ul>
          </div>

        </div>

        <div className="max-w-[1280px] mx-auto px-6 pt-6 border-t border-[#c3c6d7]/20 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 Lumina IELTS. All rights reserved.</p>
          <div className="flex gap-4 font-semibold text-[11px]">
            <a href="#" className="hover:text-[#004ac6]">Privacy Policy</a>
            <a href="#" className="hover:text-[#004ac6]">Terms of Use</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
