
import React, { useState, useEffect, useMemo } from 'react';
import { GermanWord, AppView, WordType } from './types';
import WordCard from './components/WordCard';
import AddWordForm from './components/AddWordForm';
import FlashcardDeck from './components/FlashcardDeck';
import { Plus, BookOpen, LayoutDashboard, Brain, Search, GraduationCap } from 'lucide-react';

const App: React.FC = () => {
  const [words, setWords] = useState<GermanWord[]>(() => {
    const saved = localStorage.getItem('deutsch_words');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        german: 'die Herausforderung',
        english: 'challenge',
        type: WordType.NOUN,
        gender: 'die',
        exampleSentence: 'Das Lernen einer neuen Sprache ist eine große Herausforderung.',
        exampleTranslation: 'Learning a new language is a big challenge.',
        masteryLevel: 2,
        createdAt: Date.now()
      },
      {
        id: '2',
        german: 'überraschend',
        english: 'surprising',
        type: WordType.ADJECTIVE,
        exampleSentence: 'Das Ergebnis war sehr überraschend.',
        exampleTranslation: 'The result was very surprising.',
        masteryLevel: 4,
        createdAt: Date.now() - 1000000
      }
    ];
  });

  const [view, setView] = useState<AppView>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    localStorage.setItem('deutsch_words', JSON.stringify(words));
  }, [words]);

  const filteredWords = useMemo(() => {
    return words.filter(w => 
      w.german.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.english.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => b.createdAt - a.createdAt);
  }, [words, searchTerm]);

  const handleAddWord = (newWordData: any) => {
    const newWord: GermanWord = {
      ...newWordData,
      id: crypto.randomUUID(),
      masteryLevel: 0,
      createdAt: Date.now(),
    };
    setWords([newWord, ...words]);
    setView('dashboard');
  };

  const handleDeleteWord = (id: string) => {
    setWords(words.filter(w => w.id !== id));
  };

  const updateMastery = (id: string, delta: number) => {
    setWords(words.map(w => {
      if (w.id === id) {
        return { ...w, masteryLevel: Math.max(0, Math.min(5, w.masteryLevel + delta)) };
      }
      return w;
    }));
  };

  const stats = useMemo(() => ({
    total: words.length,
    mastered: words.filter(w => w.masteryLevel >= 4).length,
    learning: words.filter(w => w.masteryLevel > 0 && w.masteryLevel < 4).length,
    new: words.filter(w => w.masteryLevel === 0).length,
  }), [words]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl">
              <GraduationCap className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">DeutschMaster</h1>
          </div>

          <div className="hidden md:flex bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setView('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'dashboard' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <LayoutDashboard size={16} /> Dashboard
            </button>
            <button 
              onClick={() => setView('flashcards')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'flashcards' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Brain size={16} /> Study
            </button>
          </div>

          <button 
            onClick={() => setView('add')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-indigo-100"
          >
            <Plus size={20} /> <span className="hidden sm:inline">Add Word</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 pt-8">
        {view === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">Total Vocabulary</p>
                <p className="text-3xl font-black text-slate-800">{stats.total}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-green-500 text-sm font-semibold uppercase tracking-wider mb-1">Mastered</p>
                <p className="text-3xl font-black text-slate-800">{stats.mastered}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-indigo-500 text-sm font-semibold uppercase tracking-wider mb-1">Learning</p>
                <p className="text-3xl font-black text-slate-800">{stats.learning}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-amber-500 text-sm font-semibold uppercase tracking-wider mb-1">New Words</p>
                <p className="text-3xl font-black text-slate-800">{stats.new}</p>
              </div>
            </div>

            {/* List Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <BookOpen className="text-indigo-600" />
                My Word Library
              </h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search words..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
                />
              </div>
            </div>

            {/* Word Grid */}
            {filteredWords.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWords.map(word => (
                  <WordCard key={word.id} word={word} onDelete={handleDeleteWord} />
                ))}
              </div>
            ) : (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center">
                <div className="mx-auto w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-4">
                  <Search size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">No words found</h3>
                <p className="text-slate-500 mb-6">Start by adding some German words to your collection.</p>
                <button 
                  onClick={() => setView('add')}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all"
                >
                  Add Your First Word
                </button>
              </div>
            )}
          </div>
        )}

        {view === 'flashcards' && (
          <FlashcardDeck 
            words={words.filter(w => w.masteryLevel < 5)} 
            onFinish={() => setView('dashboard')}
            updateMastery={updateMastery}
          />
        )}

        {view === 'add' && (
          <AddWordForm 
            onSave={handleAddWord}
            onCancel={() => setView('dashboard')}
          />
        )}
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-around items-center z-20">
        <button 
          onClick={() => setView('dashboard')}
          className={`flex flex-col items-center gap-1 ${view === 'dashboard' ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <LayoutDashboard size={20} />
          <span className="text-[10px] font-bold">Home</span>
        </button>
        <button 
          onClick={() => setView('flashcards')}
          className={`flex flex-col items-center gap-1 ${view === 'flashcards' ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <Brain size={20} />
          <span className="text-[10px] font-bold">Study</span>
        </button>
        <button 
          onClick={() => setView('add')}
          className={`flex flex-col items-center gap-1 ${view === 'add' ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <Plus size={20} />
          <span className="text-[10px] font-bold">Add</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
