
import React from 'react';
import { GermanWord, WordType } from '../types';
import { Volume2, BookOpen, Trash2 } from 'lucide-react';
import { playGermanTTS } from '../services/geminiService';

interface WordCardProps {
  word: GermanWord;
  onDelete: (id: string) => void;
}

const WordCard: React.FC<WordCardProps> = ({ word, onDelete }) => {
  const getGenderColor = (gender?: string) => {
    switch (gender) {
      case 'der': return 'text-blue-600 bg-blue-50';
      case 'die': return 'text-red-600 bg-red-50';
      case 'das': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full ${getGenderColor(word.gender)}`}>
            {word.gender ? `${word.gender} ` : ''}{word.type}
          </span>
          <h3 className="text-xl font-bold text-slate-800 mt-2">{word.german}</h3>
          <p className="text-slate-500 font-medium italic">{word.english}</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => playGermanTTS(word.german)}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Listen"
          >
            <Volume2 size={18} />
          </button>
          <button 
            onClick={() => onDelete(word.id)}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-slate-50 rounded-lg border-l-4 border-indigo-400">
        <div className="flex items-start gap-2">
          <BookOpen size={14} className="text-indigo-500 mt-1 shrink-0" />
          <p className="text-sm text-slate-700 italic">"{word.exampleSentence}"</p>
        </div>
        <p className="text-xs text-slate-500 mt-1 ml-6">{word.exampleTranslation}</p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((level) => (
            <div 
              key={level}
              className={`h-1.5 w-6 rounded-full ${level <= word.masteryLevel ? 'bg-indigo-500' : 'bg-slate-200'}`}
            />
          ))}
        </div>
        <span className="text-[10px] font-semibold text-slate-400 uppercase">Mastery {word.masteryLevel}/5</span>
      </div>
    </div>
  );
};

export default WordCard;
