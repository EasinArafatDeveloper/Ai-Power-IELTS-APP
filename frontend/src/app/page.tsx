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
  ChevronDown
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
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
          ease: 'power4.out',
        }
      );
    }
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="relative flex-1 bg-slate-50 text-slate-900 min-h-screen overflow-x-hidden font-sans">
      
      {/* Background blobs & glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-[400px] h-[400px] bg-indigo-400/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-1/4 right-10 w-[600px] h-[600px] bg-sky-300/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" style={{ animationDelay: '4s' }} />

      {/* Header Sticky Navbar */}
      <header className="border-b border-slate-200/80 bg-white/70 backdrop-blur-md sticky top-0 z-50 shadow-sm transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-600 shadow-sm animate-float">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <span className="font-black text-sm tracking-wider uppercase text-slate-900 block">IELTS Coach</span>
              <span className="text-[9px] font-extrabold text-blue-600 uppercase tracking-widest block -mt-0.5">Bangladesh</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider"
            >
              Sign In
            </Link>
            
            {/* Custom 3D Glossy Button matching user screenshot */}
            <Link href="/login" className="btn-3d-primary px-5 py-2.5 text-xs font-extrabold uppercase">
              এখনই এনরোল করো!
            </Link>
          </div>
        </div>
      </header>

      {/* 1. Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 grid lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left column info */}
        <div ref={heroRef} className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-100 bg-blue-50 text-blue-700 text-xs font-bold shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            <span>Premium AI IELTS Learning Partner</span>
          </div>

          {/* Styled matching second user screenshot */}
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 leading-tight font-sans tracking-tight">
            Build Your <span className="text-blue-600">Foundation.</span><br />
            Secure Your <span className="text-blue-600">Career.</span>
          </h1>

          <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-xl font-medium">
            বাংলাদেশ থেকে বিদেশে উচ্চশিক্ষা ও ক্যারিয়ার গড়ার স্বপ্ন পূরণ করুন। AI ডায়াগনস্টিক টেস্ট দিয়ে আপনার দুর্বলতা চিহ্নিত করুন এবং প্রতিদিনের পার্সোনালাইজড রোডম্যাপ ধরে এগিয়ে যান।
          </p>

          <div className="pt-2 flex flex-wrap gap-4 items-center">
            {/* 3D Primary Button */}
            <Link
              href="/login"
              className="btn-3d-primary px-8 py-4 text-sm font-black uppercase tracking-wider flex items-center gap-2"
            >
              <span>ফ্রি ডায়াগনস্টিক টেস্ট দিন</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </Link>

            <Link
              href="/login"
              className="px-6 py-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-bold transition-all shadow-sm"
            >
              স্যান্ডবক্স ডেমো দেখুন
            </Link>
          </div>
        </div>

        {/* Right column: Interactive Dashboard Preview Panel */}
        <div className="lg:col-span-5 relative">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-blue-600 to-sky-400 opacity-20 blur-xl animate-pulse-slow" />
          
          {/* Glassmorphism Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative bg-white/80 border border-slate-200/80 p-6 rounded-3xl shadow-xl space-y-6"
          >
            {/* Header / Streak */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Session</span>
              </div>
              <div className="flex items-center gap-1 bg-amber-500/10 text-amber-700 px-2 py-0.5 border border-amber-200/50 rounded-lg text-[10px] font-bold">
                <Flame className="h-3.5 w-3.5 fill-current text-amber-500" />
                <span>3 Day Streak</span>
              </div>
            </div>

            {/* Current vs Target score widget */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-1">
                <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block">Estimated Band</span>
                <div className="text-3xl font-black text-indigo-655">5.5</div>
                <span className="text-[8px] font-bold text-slate-400">CEFR B1 Level</span>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl text-center space-y-1">
                <span className="text-[9px] text-blue-550 font-extrabold uppercase tracking-wider block">Target Band</span>
                <div className="text-3xl font-black text-blue-600">7.5</div>
                <span className="text-[8px] font-bold text-blue-500">PR / Visa Required</span>
              </div>
            </div>

            {/* Today's Mission Checklist Preview */}
            <div className="space-y-3.5">
              <span className="text-[9px] text-slate-450 font-extrabold uppercase tracking-widest block">Today's Focus Tasks</span>
              
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
                  <div className="h-5 w-5 rounded-full border border-blue-500 bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <CheckCircle className="h-3.5 w-3.5 text-blue-600 fill-current" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-slate-900">Review 5 AI Vocabulary Words</div>
                    <div className="text-[9px] text-indigo-600 font-bold mt-0.5">Sugg: Mitigate, Ubiquitous...</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
                  <div className="h-5 w-5 rounded-full border border-slate-200 shrink-0" />
                  <div className="flex-1">
                    <div className="font-bold text-slate-900">Draft Essay Task 2 Outline</div>
                    <div className="text-[9px] text-emerald-600 font-bold mt-0.5">Topic: Technology & Education</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Graph progression visual */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">
                <span>Monthly Progression</span>
                <span className="text-emerald-500 font-black">+2.0 Bands</span>
              </div>
              <div className="h-16 flex items-end gap-1.5 justify-between">
                {[4.5, 4.8, 5.0, 5.2, 5.5, 6.0, 6.5, 7.5].map((val, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className={`w-full rounded-t-md transition-all ${
                        idx === 7 ? 'bg-blue-600' : 'bg-slate-200'
                      }`}
                      style={{ height: `${(val / 9) * 45}px` }}
                    />
                    <span className="text-[8px] font-mono text-slate-400">D{idx+1}</span>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        </div>

      </section>

      {/* 2. Trusted By logos section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center relative z-10 border-t border-b border-slate-200/80 my-8">
        <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-6">Designed to match scoring metrics set by</p>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 opacity-40 grayscale">
          <span className="text-xs sm:text-sm font-black tracking-widest text-slate-900 uppercase">British Council</span>
          <span className="text-xs sm:text-sm font-black tracking-widest text-slate-900 uppercase">IDP Australia</span>
          <span className="text-xs sm:text-sm font-black tracking-widest text-slate-900 uppercase">Cambridge ESOL</span>
          <span className="text-xs sm:text-sm font-black tracking-widest text-slate-900 uppercase">CEFR Grid</span>
        </div>
      </section>

      {/* 3. Why Choose Us */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 text-center space-y-12">
        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Stop Practicing IELTS blindly.</h2>
          <p className="text-xs text-blue-600 font-extrabold uppercase tracking-widest">Why AI IELTS Coach is the best system</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          
          <div className="bg-white border border-slate-200/85 p-6 rounded-2xl shadow-sm text-left hover:border-slate-350 hover:shadow-md transition-all">
            <div className="h-10 w-10 bg-blue-50 border border-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
              <Globe className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-2">Bangla Definition Tooltips</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              বাংলা ব্যাখ্যাসহ ভোকাবুলারি কার্ড। প্রতিটি কঠিন ইংরেজি শব্দের পাশে বাংলা অর্থ ও সঠিক কনটেক্সট দেওয়া থাকে যাতে সহজে আয়ত্ত করা যায়।
            </p>
          </div>

          <div className="bg-white border border-slate-200/85 p-6 rounded-2xl shadow-sm text-left hover:border-slate-350 hover:shadow-md transition-all">
            <div className="h-10 w-10 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-2">AI Essay Diff Inspector</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              বানান ও ব্যাকরণগত ভুল লাল এবং সঠিকটি সবুজ রঙে হাইলাইট করে দেখায়। সাথে যুক্ত করা হয়েছে ব্যান্ড ৯.০ স্ট্যান্ডার্ডে রিরাইট গাইডেন্স।
            </p>
          </div>

          <div className="bg-white border border-slate-200/85 p-6 rounded-2xl shadow-sm text-left hover:border-slate-350 hover:shadow-md transition-all">
            <div className="h-10 w-10 bg-indigo-50 border border-indigo-100 text-indigo-650 rounded-xl flex items-center justify-center mb-4">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-2">Dynamic Focus suggestion</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              আপনার প্লেসমেন্ট টেস্টের উপর ভিত্তি করে সাজানো হয় ডেইলি স্টাডি গাইড। কোনো টপিক বাড়তি অনুশীলনের প্রয়োজন হলে AI স্বয়ংক্রিয়ভাবে সেটি শিডিউলে অ্যাড করবে।
            </p>
          </div>

        </div>
      </section>

      {/* 4. How It Works Timeline */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 text-center space-y-12">
        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Your Structured Journey to Target Band.</h2>
          <p className="text-xs text-blue-600 font-extrabold uppercase tracking-widest">How the platform operates</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-4 relative">
          
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200/60 -translate-y-1/2 hidden sm:block z-0" />
          
          {[
            { step: 'Step 1', title: 'Placement Check', desc: '১০ মিনিটের ডায়াগনস্টিক এসেসমেন্ট দিয়ে প্রাথমিক ব্যান্ড নির্ধারণ করুন।', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
            { step: 'Step 2', title: 'AI Score Profiling', desc: 'আইইএলটিএস-এর ৪টি ক্রাইটেরিয়া ধরে আপনার দুর্বল জায়গা চিহ্নিত করা হবে।', color: 'bg-blue-50 text-blue-600 border-blue-100' },
            { step: 'Step 3', title: 'Daily Missions', desc: 'প্রতিদিন AI রিকমেন্ডেড ভোকাবুলারি, রাইটিং ও রিডিং টাস্ক পূরণ করুন।', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
            { step: 'Step 4', title: 'Secure Band 7.5+', desc: 'ধাপে ধাপে আপনার লক্ষ্য পূরণ করুন এবং স্বপ্নের স্কলারশিপ নিশ্চিত করুন।', color: 'bg-amber-50 text-amber-600 border-amber-100' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white border border-slate-200 p-6 rounded-2xl relative z-10 space-y-3 shadow-sm hover:shadow-md transition-all text-left">
              <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 border rounded-full ${item.color}`}>
                {item.step}
              </span>
              <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. AI Writing Demo (Interactive Comparison Slider Mock) */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 text-center space-y-8">
        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Grammatical Difference Inspector</h2>
          <p className="text-xs text-blue-600 font-extrabold uppercase tracking-widest">See how the writing coach fixes syntax errors</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl space-y-4 text-left">
          {/* Switch tabs */}
          <div className="flex gap-2 border-b border-slate-100 pb-3">
            <button
              onClick={() => setWritingTab('original')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider ${
                writingTab === 'original'
                  ? 'bg-rose-50 border border-rose-100 text-rose-700'
                  : 'text-slate-400 hover:text-slate-900'
              }`}
            >
              Student Draft (Band 5.5)
            </button>
            <button
              onClick={() => setWritingTab('improved')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider ${
                writingTab === 'improved'
                  ? 'bg-emerald-50 border border-emerald-100 text-emerald-700'
                  : 'text-slate-400 hover:text-slate-900'
              }`}
            >
              AI Corrected (Band 7.5+)
            </button>
          </div>

          <div className="text-xs leading-relaxed font-semibold p-4 rounded-xl min-h-24 bg-slate-50/50 border border-slate-150">
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

          <div className="p-3 bg-blue-50 border border-blue-100/60 rounded-xl text-[11px] text-blue-900 font-semibold">
            {writingTab === 'original' ? (
              <span>⚠️ Grammatical errors and simple vocabulary restrict coherence and grammar scores to band 5.5.</span>
            ) : (
              <span>💡 Lexical precision, advanced structure transitions, and correct agreement elevate score to band 7.5+.</span>
            )}
          </div>
        </div>
      </section>

      {/* 9. Testimonials Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 text-center space-y-12">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Success Stories from Bangladesh.</h2>
          <p className="text-xs text-blue-600 font-extrabold uppercase tracking-widest">Achieved Dream scores to go abroad</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: 'Tanvir Rahman', score: 'IELTS Band 7.5', desc: 'AI Writing কোচের কারণে মাত্র ১ মাস প্র্যাকটিস করে রাইটিং ব্যান্ড ৬.০ থেকে ৭.৫ পেয়েছি। বানান ও স্ট্রাকচারাল ভুলের ফিডব্যাক অসাধারণ ছিল!', region: 'Dhaka, Bangladesh', stars: 5 },
            { name: 'Nusrat Jahan', score: 'IELTS Band 8.0', desc: 'অসাধারণ ভোকাবুলারি স্পেসড রেপিটিশন সিস্টেম! প্রতিদিনের সাজেস্টেড বাংলা মিনিং পড়ার কারণে রিডিং সেকশনে অনেক ভালো করতে পেরেছি।', region: 'Chittagong, Bangladesh', stars: 5 },
            { name: 'Rahat Chowdhury', score: 'IELTS Band 7.0', desc: 'অন্যান্য প্র্যাকটিস ওয়েবসাইট থেকে এটা অনেক আলাদা। প্লেসমেন্ট এসেসমেন্ট অনুযায়ী প্রতিদিনের রোডম্যাপ পাওয়ায় টাইম ম্যানেজমেন্ট সহজ হয়েছে।', region: 'Sylhet, Bangladesh', stars: 5 },
          ].map((t, idx) => (
            <div key={idx} className="bg-white border border-slate-200 p-6 rounded-2xl text-left space-y-4 shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">{t.name}</h4>
                  <span className="text-[10px] text-slate-400 font-bold block">{t.region}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-indigo-650 block">{t.score}</span>
                  <div className="flex gap-0.5 text-amber-500 mt-1">
                    {[...Array(t.stars)].map((_, s) => <Star key={s} className="h-3 w-3 fill-current" />)}
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold italic">"{t.desc}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* 10. Pricing Plans */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 text-center space-y-12">
        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Simple, Transparent Pricing Plans.</h2>
          <p className="text-xs text-blue-600 font-extrabold uppercase tracking-widest">Pricing customized for students in Bangladesh</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 items-stretch max-w-2xl mx-auto">
          
          {/* Plan 1: Free Sandbox */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col justify-between text-left shadow-sm hover:shadow-md transition-all">
            <div className="space-y-4">
              <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full border border-slate-200 text-slate-500 bg-slate-50 uppercase tracking-widest">
                Developer Sandbox
              </span>
              <h3 className="text-xl font-bold text-slate-900">Free Practice</h3>
              <p className="text-xs text-slate-450 leading-relaxed">Evaluation and sandbox bypass limits with mock API responses.</p>
              
              <div className="text-3xl font-black text-slate-900">$0 <span className="text-xs text-slate-400 font-semibold">/ forever</span></div>

              <ul className="space-y-2.5 text-xs text-slate-500 font-semibold pt-4 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>Interactive Placement Test</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>3 daily study checklist tasks</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>5 basic vocab decks reviewed</span>
                </li>
              </ul>
            </div>

            <Link href="/login" className="btn-3d-primary w-full py-3.5 text-xs font-black uppercase text-center mt-6">
              স্যান্ডবক্স এক্সেস নিন
            </Link>
          </div>

          {/* Plan 2: Premium (Duolingo 3D active styled) */}
          <div className="bg-white border-2 border-blue-500 rounded-3xl p-8 flex flex-col justify-between text-left shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-xl">
              Most Popular
            </div>

            <div className="space-y-4">
              <span className="text-[9px] font-extrabold px-2.5 py-0.5 rounded-full border border-blue-200 text-blue-600 bg-blue-50 uppercase tracking-widest">
                Premium Coach
              </span>
              <h3 className="text-xl font-bold text-slate-900">Full AI Access</h3>
              <p className="text-xs text-slate-450 leading-relaxed">Complete DeepSeek/Gemini diagnostic support & unlimited writing checking.</p>
              
              <div className="text-3xl font-black text-slate-900">BDT 1,500 <span className="text-xs text-slate-400 font-semibold">/ 3 months</span></div>

              <ul className="space-y-2.5 text-xs text-slate-500 font-semibold pt-4 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Unlimited Task 1 & 2 Evaluations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Complete Custom Study Guide Roadmap</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Bangla Definition Context Tooltips</span>
                </li>
              </ul>
            </div>

            <Link href="/login" className="btn-3d-success w-full py-3.5 text-xs font-black uppercase text-center mt-6">
              এখনই এনরোল করো!
            </Link>
          </div>

        </div>
      </section>

      {/* 11. FAQ Accordions */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 text-center space-y-8">
        <div className="space-y-2">
          <h2 className="text-xl font-black text-slate-900 sm:text-2xl">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Common inquiries regarding the program</p>
        </div>

        <div className="space-y-3 text-left">
          {[
            { q: 'আমি কি বিকাশ (bKash) দিয়ে পেমেন্ট করতে পারবো?', a: 'হ্যাঁ। আমাদের প্রিমিয়াম প্ল্যানে জয়েন করতে বিকাশ, রকেট বা যেকোনো বাংলাদেশি ডেবিট/ক্রেডিট কার্ড দিয়ে পেমেন্ট সম্পন্ন করতে পারবেন।' },
            { q: 'প্লেসমেন্ট এসেসমেন্ট দেওয়া কি বাধ্যতামূলক?', a: 'হ্যাঁ। আপনার বর্তমান রিডিং, রাইটিং ও গ্রামার লেভেল নির্ধারণের জন্য প্রথমে এসেসমেন্ট দিতে হবে। এর মাধ্যমে AI আপনার উপযুক্ত ডেইলি রোডম্যাপ তৈরি করবে।' },
            { q: 'AI রাইটিং ইভ্যালুয়েশন কি নির্ভুল তথ্য দেয়?', a: 'হ্যাঁ। আমাদের রাইটিং ভ্যালিডেটর ক্রাইটেরিয়া সেটআপ করা হয়েছে আইইএলটিএস অফিসিয়াল ৪টি মেট্রিক (Task Achievement, Coherence, Lexical, Grammar) বিশ্লেষণ করে, যা অত্যন্ত নির্ভুল।' },
          ].map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex justify-between items-center p-5 text-xs font-bold text-slate-900 text-left transition-colors hover:bg-slate-50/50"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-4.5 w-4.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
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
                      <div className="p-5 pt-0 border-t border-slate-100 text-xs text-slate-500 leading-relaxed font-semibold pl-5">
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
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 text-center">
        <div className="bg-gradient-to-tr from-blue-600 to-indigo-700 rounded-3xl p-10 sm:p-16 text-white space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            আজই শুরু করুন আপনার IELTS প্রস্তুতি।
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-lg mx-auto font-semibold">
            বিদেশের শীর্ষ বিশ্ববিদ্যালয়ে স্কলারশিপ নিয়ে উচ্চশিক্ষা অথবা পিআর প্রসেসিং-এর জন্য প্রথম এবং প্রয়োজনীয় লক্ষ্য পূরণ করুন।
          </p>
          <div className="pt-4 flex justify-center">
            {/* 3D Success button matching user screenshot */}
            <Link href="/login" className="btn-3d-success px-8 py-4 text-sm font-black uppercase flex items-center gap-2">
              <span>এখনই এনরোল করো!</span>
              <ChevronRight className="h-4.5 w-4.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 13. Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 relative z-10 text-center text-xs text-slate-400 font-semibold space-y-4">
        <div className="flex justify-center items-center gap-2">
          <Compass className="h-4 w-4 text-blue-600" />
          <span className="text-slate-800 font-black tracking-widest uppercase">AI IELTS Coach</span>
        </div>
        <p>© 2026 AI IELTS Coach Bangladesh. Powered by Next.js 15, NestJS & Mongoose.</p>
      </footer>

    </div>
  );
}
