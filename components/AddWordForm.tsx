
import React, { useState } from 'react';
import { WordType, GermanWord } from '../types';
import { Sparkles, Loader2, Save } from 'lucide-react';
import { getAIAssistedWord } from '../services/geminiService';

interface AddWordFormProps {
  onSave: (word: Omit<GermanWord, 'id' | 'masteryLevel' | 'createdAt'>) => void;
  onCancel: () => void;
}

const AddWordForm: React.FC<AddWordFormProps> = ({ onSave, onCancel }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<GermanWord>>({
    german: '',
    english: '',
    type: WordType.NOUN,
    gender: 'der',
    exampleSentence: '',
    exampleTranslation: ''
  });

  const handleAIHelp = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const data = await getAIAssistedWord(input);
      setFormData(prev => ({ ...prev, ...data }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.german && formData.english) {
      onSave(formData as any);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl max-w-2xl mx-auto border border-indigo-100">
      <div className="flex items-center gap-2 mb-8">
        <Sparkles className="text-indigo-600" />
        <h2 className="text-2xl font-bold text-slate-800">Add New Word</h2>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-bold text-slate-700 mb-2">
          Magic Input (Write a word in German or English)
        </label>
        <div className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. 'Apple' or 'Apfel'"
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
          <button 
            onClick={handleAIHelp}
            disabled={loading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition-all"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
            AI Fill
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-2">Let AI suggest translation, grammar, and example sentences.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">German Word</label>
            <input 
              type="text"
              required
              value={formData.german}
              onChange={e => setFormData({ ...formData, german: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">English Translation</label>
            <input 
              type="text"
              required
              value={formData.english}
              onChange={e => setFormData({ ...formData, english: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Word Type</label>
            <select 
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value as WordType })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {Object.values(WordType).map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
          {formData.type === WordType.NOUN && (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Gender</label>
              <div className="flex gap-2">
                {['der', 'die', 'das'].map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: g as any })}
                    className={`flex-1 py-3 rounded-xl border font-bold transition-all ${
                      formData.gender === g 
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                      : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Example Sentence (German)</label>
          <textarea 
            required
            value={formData.exampleSentence}
            onChange={e => setFormData({ ...formData, exampleSentence: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 h-24"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Translation (English)</label>
          <input 
            type="text"
            required
            value={formData.exampleTranslation}
            onChange={e => setFormData({ ...formData, exampleTranslation: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex gap-4 pt-4 border-t border-slate-100">
          <button 
            type="button" 
            onClick={onCancel}
            className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
          >
            <Save size={18} />
            Save Word
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddWordForm;
