'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CheckCircle, ChevronLeft, ChevronRight, RotateCw, Sparkles, Loader2, Bookmark } from 'lucide-react';
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

function VocabularyWorkspace() {
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
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + words.length) % words.length);
    }, 150);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-950">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (error || words.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-center px-4">
        <BookOpen className="h-12 w-12 text-slate-655 mb-3" />
        <h3 className="text-lg font-bold text-white">No Vocabulary Words Seeding</h3>
        <p className="text-slate-400 text-sm mt-1">Please try restarting the backend or check seeds.</p>
        <button
          onClick={() => router.push('/dashboard')}
          className="mt-6 text-sm font-semibold text-indigo-400"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const activeWord = words[currentIndex];

  return (
    <div className="relative flex flex-col justify-between min-h-screen bg-slate-950 px-4 py-8 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl" />

      {/* Header */}
      <div className="max-w-xl mx-auto w-full z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/dashboard')}
            className="p-2 rounded-xl bg-slate-900 border border-slate-850 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-all"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-base font-bold text-white">IELTS Vocabulary Trainer</h2>
            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Spaced Repetition Practice</p>
          </div>
        </div>

        <span className="text-xs font-mono text-slate-500">
          {currentIndex + 1} of {words.length} words
        </span>
      </div>

      {/* Flashcard Area */}
      <div className="max-w-md mx-auto w-full z-10 my-auto py-12 flex justify-center items-center">
        <div className="relative w-full h-80 perspective" style={{ perspective: 1200 }}>
          <motion.div
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            style={{ transformStyle: 'preserve-3d' }}
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full h-full relative cursor-pointer select-none"
          >
            {/* Front Side */}
            <div
              style={{ backfaceVisibility: 'hidden' }}
              className="absolute inset-0 bg-slate-900 border border-slate-850/80 rounded-3xl p-8 flex flex-col justify-between shadow-2xl"
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border text-indigo-400 bg-indigo-500/10 border-indigo-500/20 tracking-wider">
                  {activeWord.category}
                </span>
                <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                  <Bookmark className="h-3.5 w-3.5" />
                  <span>Band {activeWord.ieltsBandLevel.toFixed(1)}</span>
                </span>
              </div>

              <div className="text-center space-y-2 my-auto">
                <h3 className="text-3xl font-extrabold text-white tracking-tight">{activeWord.word}</h3>
                <p className="text-xs font-medium text-slate-500 italic">({activeWord.partOfSpeech})</p>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 font-bold uppercase tracking-wider">
                <RotateCw className="h-3.5 w-3.5" />
                <span>Click Card to Flip</span>
              </div>
            </div>

            {/* Back Side */}
            <div
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
              className="absolute inset-0 bg-slate-900 border border-slate-850/80 rounded-3xl p-8 flex flex-col justify-between shadow-2xl"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start border-b border-slate-850 pb-2">
                  <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">Definition</span>
                  <span className="text-xs text-slate-400 font-bold italic">"{activeWord.word}"</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed font-medium">{activeWord.definition}</p>
                
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Synonyms</span>
                  <p className="text-xs text-slate-400 font-semibold">{activeWord.synonyms.join(', ')}</p>
                </div>

                <div className="space-y-1 border-t border-slate-850 pt-3">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Example Context</span>
                  <p className="text-xs text-slate-300 italic leading-relaxed">"{activeWord.examples[0]?.sentence}"</p>
                  <p className="text-[11px] text-slate-500 mt-1">{activeWord.examples[0]?.translation}</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 font-bold uppercase tracking-wider pt-2 border-t border-slate-850">
                <RotateCw className="h-3.5 w-3.5" />
                <span>Click to View Front</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="max-w-xl mx-auto w-full z-10 flex flex-col gap-4 items-center">
        {/* Swiping action buttons */}
        <div className="flex gap-4 w-full justify-center">
          <button
            onClick={handleNext}
            className="flex-1 max-w-[140px] py-3 rounded-xl border border-slate-800 bg-slate-950 text-slate-400 hover:text-white text-xs font-bold hover:border-slate-700 transition-all text-center"
          >
            Still Learning
          </button>
          
          <button
            onClick={() => masterMutation.mutate(activeWord.word)}
            disabled={masterMutation.isPending}
            className="flex-1 max-w-[180px] py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-500/10 flex items-center justify-center gap-1.5"
          >
            {masterMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                <span>I Know This!</span>
              </>
            )}
          </button>
        </div>

        {/* Left/Right controls */}
        <div className="flex items-center gap-6 text-slate-500">
          <button onClick={handlePrev} className="hover:text-slate-200 transition-colors">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <span className="text-xs font-semibold uppercase tracking-widest">Card Navigation</span>
          <button onClick={handleNext} className="hover:text-slate-200 transition-colors">
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
