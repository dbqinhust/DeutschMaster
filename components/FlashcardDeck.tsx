
import React, { useState } from 'react';
import { GermanWord } from '../types';
import { ChevronLeft, ChevronRight, RotateCcw, Volume2 } from 'lucide-react';
import { playGermanTTS } from '../services/geminiService';

interface FlashcardDeckProps {
  words: GermanWord[];
  onFinish: () => void;
  updateMastery: (id: string, delta: number) => void;
}

const FlashcardDeck: React.FC<FlashcardDeckProps> = ({ words, onFinish, updateMastery }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (words.length === 0) {
    return (
      <div className="text-center p-12 bg-white rounded-2xl shadow-sm border border-slate-200">
        <p className="text-slate-500 mb-4">No words to study yet!</p>
        <button onClick={onFinish} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold">
          Go Back
        </button>
      </div>
    );
  }

  const currentWord = words[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < words.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onFinish();
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleMastery = (delta: number) => {
    updateMastery(currentWord.id, delta);
    handleNext();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex justify-between items-center text-slate-500 font-medium">
        <span>Word {currentIndex + 1} of {words.length}</span>
        <div className="h-2 w-48 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-300" 
            style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
          />
        </div>
      </div>

      <div 
        onClick={() => setIsFlipped(!isFlipped)}
        className="relative h-[400px] w-full cursor-pointer perspective-1000 group"
      >
        <div className={`relative w-full h-full duration-500 transition-all transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
          {/* Front */}
          <div className="absolute w-full h-full backface-hidden bg-white border-2 border-slate-100 rounded-3xl shadow-xl flex flex-col items-center justify-center p-8">
            <span className="text-indigo-500 font-bold uppercase tracking-widest text-sm mb-4">German</span>
            <h2 className="text-5xl font-black text-slate-800 text-center">{currentWord.german}</h2>
            <button 
              onClick={(e) => { e.stopPropagation(); playGermanTTS(currentWord.german); }}
              className="mt-6 p-3 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100"
            >
              <Volume2 size={24} />
            </button>
            <p className="absolute bottom-8 text-slate-400 animate-pulse">Click to flip</p>
          </div>

          {/* Back */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-indigo-600 border-2 border-indigo-500 rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 text-white">
            <span className="text-indigo-200 font-bold uppercase tracking-widest text-sm mb-4">English</span>
            <h2 className="text-4xl font-bold text-center mb-6">{currentWord.english}</h2>
            <div className="bg-white/10 p-6 rounded-2xl w-full">
              <p className="text-sm opacity-80 mb-2 uppercase tracking-wide font-bold">Example Sentence</p>
              <p className="text-xl italic mb-2 leading-relaxed font-serif">"{currentWord.exampleSentence}"</p>
              <p className="text-sm opacity-70">Translation: {currentWord.exampleTranslation}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 flex justify-between items-center">
        <button 
          onClick={handlePrev} 
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-6 py-3 text-slate-500 hover:text-slate-800 disabled:opacity-30 font-semibold"
        >
          <ChevronLeft /> Previous
        </button>

        <div className="flex gap-4">
          <button 
            onClick={() => handleMastery(-1)}
            className="px-6 py-3 bg-red-100 text-red-700 rounded-xl font-bold hover:bg-red-200 transition-colors"
          >
            I forgot
          </button>
          <button 
            onClick={() => handleMastery(1)}
            className="px-6 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors shadow-lg shadow-green-100"
          >
            I know it!
          </button>
        </div>

        <button 
          onClick={handleNext} 
          className="flex items-center gap-2 px-6 py-3 text-slate-500 hover:text-slate-800 font-semibold"
        >
          Next <ChevronRight />
        </button>
      </div>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};

export default FlashcardDeck;
