'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CheckCircle, ChevronLeft, ChevronRight, RotateCw, Sparkles, Loader2, Bookmark, Lightbulb } from 'lucide-react';
import toast from 'react-hot-toast';
import ProtectedRoute from '@/components/shared/protected-route';

interface ExampleSentence {
  sentence: string;
  translation: string;
}

interface Word {
  _id: string;
  word: string;
  partOfSpeech: string;
  definition: string;
  synonyms: string[];
  examples: ExampleSentence[];
  ieltsBandLevel: number;
  category: string;
}

export default function VocabularyPage() {
  return (
    <ProtectedRoute>
      <VocabularyWorkspace />
    </ProtectedRoute>
  );
}

export function VocabularyWorkspace() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const { data: words = [], isLoading, error } = useQuery<Word[]>({
    queryKey: ['vocabulary-words'],
    queryFn: async () => {
      const response = await api.get('/vocabulary/words');
      return response.data;
    },
  });

  const masterMutation = useMutation({
    mutationFn: async (word: string) => {
      const response = await api.post('/vocabulary/mastered', { word });
      return response.data;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['user-progress'] });
      toast.success(`Word "${res.word}" marked as mastered!`);
      handleNext();
    },
    onError: () => {
      toast.error('Failed to mark word as mastered');
    },
  });

  const handleNext = () => {
    setIsFlipped(false);
    if (words.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (words.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + words.length) % words.length);
    }
  };

  const currentWord = words[currentIndex];

  if (isLoading) {
    return (
      <div className="py-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-650" />
      </div>
    );
  }

  if (error || words.length === 0) {
    return (
      <div className="p-6 bg-white border border-slate-200 rounded-2xl text-center">
        <p className="text-sm text-slate-500 font-semibold">No vocabulary words available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-xl mx-auto bg-slate-50 min-h-[450px]">
      
      {/* Dynamic Header */}
      <div className="flex justify-between items-center text-xs font-semibold text-slate-450 border-b border-slate-200 pb-2">
        <span>Word Card {currentIndex + 1} of {words.length}</span>
        <span className="font-mono bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded">
          Review Session
        </span>
      </div>

      {/* 3D Flip Card Container */}
      <div 
        onClick={() => setIsFlipped(!isFlipped)}
        className="w-full h-80 relative cursor-pointer select-none perspective-1000"
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full h-full relative preserve-3d"
        >
          {/* FRONT Side */}
          <div className="absolute inset-0 w-full h-full bg-white border border-slate-200 rounded-3xl p-8 flex flex-col justify-between items-center text-center shadow-md backface-hidden">
            <span className="text-[9px] uppercase font-extrabold tracking-widest text-slate-400">
              Click Card to reveal meaning
            </span>
            
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-slate-900 font-sans tracking-tight">{currentWord.word}</h2>
              <span className="inline-block text-xs font-bold text-slate-400 italic">
                ({currentWord.partOfSpeech})
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-indigo-650 font-bold bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
              <Sparkles className="h-3.5 w-3.5" />
              <span>IELTS Band {currentWord.ieltsBandLevel.toFixed(1)} Vocabulary</span>
            </div>
          </div>

          {/* BACK Side */}
          <div className="absolute inset-0 w-full h-full bg-white border border-slate-200 rounded-3xl p-8 flex flex-col justify-between shadow-md backface-hidden rotate-y-180">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-black text-slate-900">{currentWord.word}</h3>
                  <span className="text-[10px] text-slate-400 font-bold italic">({currentWord.partOfSpeech})</span>
                </div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 border border-indigo-100 text-indigo-700 bg-indigo-50 rounded-full">
                  IELTS Band {currentWord.ieltsBandLevel}
                </span>
              </div>

              {/* Definition */}
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Definition</span>
                <p className="text-xs text-slate-800 font-semibold leading-relaxed">
                  {currentWord.definition}
                </p>
              </div>

              {/* Translation Tooltip support for Bangladeshi students */}
              <div className="p-2.5 rounded-lg bg-indigo-50/50 border border-indigo-100/50 flex gap-2 items-start text-xs text-indigo-900 font-semibold">
                <Lightbulb className="h-4.5 w-4.5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[9px] text-indigo-600 font-extrabold block uppercase tracking-wider">Synonyms</span>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {currentWord.synonyms.map((s, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 bg-indigo-100/60 rounded text-[10px] font-sans">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Example Context */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Example context</span>
                {currentWord.examples.map((ex, idx) => (
                  <div key={idx} className="text-xs leading-relaxed text-slate-700 pl-2 border-l-2 border-slate-200">
                    <p className="font-semibold italic">"{ex.sentence}"</p>
                    <p className="text-[11px] text-slate-450 mt-0.5 font-bold">Bangla translation: {ex.translation}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center text-[9px] text-slate-450 font-bold uppercase tracking-widest pt-2 border-t border-slate-100">
              Click again to flip back
            </div>
          </div>

        </motion.div>
      </div>

      {/* Action Deck Buttons */}
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="flex items-center justify-center p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-900 transition-all shadow-sm"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={handleNext}
            className="flex items-center justify-center p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-900 transition-all shadow-sm"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <button
          onClick={() => masterMutation.mutate(currentWord.word)}
          disabled={masterMutation.isPending}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-650/10 disabled:opacity-50"
        >
          {masterMutation.isPending ? (
            <Loader2 className="h-4.5 w-4.5 animate-spin" />
          ) : (
            <>
              <CheckCircle className="h-4.5 w-4.5" />
              <span>Mark Word as Mastered</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
