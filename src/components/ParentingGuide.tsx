import React, { useState, useMemo } from 'react';
import { Star, ChevronDown, ChevronUp, BookOpen, Search, Filter } from 'lucide-react';
import { TECHNIQUES } from '../data/techniques';
import { AgeSelector } from './AgeSelector';
import { useApp } from '../context/AppContext';
import type { Technique } from '../types';

const CATEGORY_LABELS: Record<string, { label: string; emoji: string; color: string }> = {
  discipline:    { label: 'Discipline & Limits', emoji: '🎯', color: 'bg-red-50 text-red-700 border-red-200' },
  communication: { label: 'Communication',        emoji: '💬', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  learning:      { label: 'Learning & Play',      emoji: '📚', color: 'bg-green-50 text-green-700 border-green-200' },
  emotional:     { label: 'Emotional Growth',     emoji: '❤️', color: 'bg-pink-50 text-pink-700 border-pink-200' },
  social:        { label: 'Social Development',   emoji: '🤝', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  spiritual:     { label: 'Spiritual & Values',   emoji: '🌙', color: 'bg-gold-50 text-gold-700 border-gold-200' },
};

const STRICTNESS_LABELS = ['', 'Very Gentle', 'Gentle', 'Balanced', 'Firm', 'Very Structured'];
const STRICTNESS_COLORS = ['', '#16a34a', '#65a30d', '#d97706', '#ea580c', '#dc2626'];

const TechniqueCard: React.FC<{ t: Technique }> = ({ t }) => {
  const [open, setOpen] = useState(false);
  const meta = CATEGORY_LABELS[t.category];

  return (
    <div className="card overflow-hidden">
      <button
        className="w-full text-left p-6 hover:bg-sand-50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${meta?.color?.split(' ')[0]}`}>
            {meta?.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-display font-bold text-gray-800 text-base leading-snug">{t.title}</h3>
              {open ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0 mt-1" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0 mt-1" />}
            </div>
            {t.arabicTitle && <p className="arabic text-sm text-gray-400 mb-2">{t.arabicTitle}</p>}
            <p className="text-sm text-gray-500 leading-relaxed">{t.summary}</p>

            <div className="flex flex-wrap items-center gap-2 mt-3">
              {/* Strictness meter */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-400">Firmness:</span>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(n => (
                    <div
                      key={n}
                      className="w-4 h-2 rounded-full transition-colors"
                      style={{ backgroundColor: n <= t.strictnessLevel ? STRICTNESS_COLORS[t.strictnessLevel] : '#e5e7eb' }}
                    />
                  ))}
                </div>
                <span className="text-xs font-medium" style={{ color: STRICTNESS_COLORS[t.strictnessLevel] }}>
                  {STRICTNESS_LABELS[t.strictnessLevel]}
                </span>
              </div>

              <span className={`badge border text-xs ${meta?.color}`}>{meta?.label}</span>

              {t.ageGroups.slice(0, 2).map(a => (
                <span key={a} className="badge bg-teal-50 text-teal-600 text-xs">{a}</span>
              ))}
              {t.ageGroups.length > 2 && <span className="badge bg-gray-100 text-gray-400 text-xs">+{t.ageGroups.length - 2}</span>}
            </div>
          </div>
        </div>
      </button>

      {open && (
        <div className="border-t border-sand-200 bg-sand-50 animate-fadeIn">
          {/* Description */}
          <div className="p-6 pb-4">
            <p className="text-sm text-gray-600 leading-relaxed mb-5">{t.description}</p>

            {/* Steps */}
            <div className="mb-5">
              <h4 className="text-xs font-semibold text-teal-600 uppercase tracking-wide mb-3 flex items-center gap-1">
                <Star size={12} /> Practical Steps
              </h4>
              <ol className="space-y-2">
                {t.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                    <span className="w-6 h-6 rounded-full bg-teal-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Research Basis */}
            <div className="source-card pl-4 py-2 mb-4 bg-white rounded-xl">
              <p className="text-xs font-semibold text-gold-600 uppercase tracking-wide mb-1">Research Basis</p>
              <p className="text-xs text-gray-500 leading-relaxed">{t.researchBasis}</p>
            </div>

            {/* Islamic Context */}
            {t.islamicContext && (
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-4">
                <p className="text-xs font-semibold text-teal-600 uppercase tracking-wide mb-2 flex items-center gap-1">
                  🌙 Islamic Perspective
                </p>
                <p className="text-sm text-teal-800 leading-relaxed">{t.islamicContext}</p>
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {t.tags.map(tag => (
                <span key={tag} className="badge bg-white border border-sand-300 text-gray-400 text-xs">#{tag}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const ParentingGuide: React.FC = () => {
  const { selectedAge } = useApp();
  const [category, setCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [strictFilter, setStrictFilter] = useState<number>(0);

  const filtered = useMemo(() => {
    return TECHNIQUES.filter(t => {
      const ageOk  = selectedAge === 'all' || t.ageGroups.includes(selectedAge as any);
      const catOk  = category === 'all' || t.category === category;
      const strictOk = strictFilter === 0 || t.strictnessLevel === strictFilter;
      const q      = search.toLowerCase();
      const searchOk = !q || t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) ||
                        t.tags.some(tag => tag.includes(q));
      return ageOk && catOk && strictOk && searchOk;
    });
  }, [selectedAge, category, search, strictFilter]);

  return (
    <div>
      <AgeSelector />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h2 className="section-title">Parenting Techniques Guide</h2>
          <p className="section-subtitle">
            Evidence-based parenting strategies sourced from peer-reviewed psychology, culturally adapted for Arab families — with Islamic context woven throughout.
          </p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="input-field pl-10"
              placeholder="Search techniques..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select
            className="input-field"
            value={strictFilter}
            onChange={e => setStrictFilter(Number(e.target.value))}
          >
            <option value={0}>All Firmness Levels</option>
            {[1,2,3,4,5].map(n => (
              <option key={n} value={n}>{STRICTNESS_LABELS[n]}</option>
            ))}
          </select>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
              category === 'all' ? 'bg-teal-500 text-white border-teal-500' : 'bg-white text-gray-500 border-sand-300 hover:border-teal-300'
            }`}
          >
            All Categories
          </button>
          {Object.entries(CATEGORY_LABELS).map(([cat, meta]) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all border flex items-center gap-1.5 ${
                category === cat
                  ? 'bg-teal-500 text-white border-teal-500'
                  : 'bg-white text-gray-500 border-sand-300 hover:border-teal-300'
              }`}
            >
              {meta.emoji} {meta.label}
            </button>
          ))}
        </div>

        {/* Firmness Guide */}
        <div className="card p-5 mb-8 bg-gradient-to-r from-sand-50 to-white">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={16} className="text-teal-500" />
            <p className="text-sm font-semibold text-gray-700">Understanding Firmness Levels</p>
          </div>
          <div className="flex flex-wrap gap-4 text-xs">
            {[1,2,3,4,5].map(n => (
              <div key={n} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: STRICTNESS_COLORS[n] }} />
                <span className="font-medium" style={{ color: STRICTNESS_COLORS[n] }}>Level {n}: {STRICTNESS_LABELS[n]}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Optimal firmness increases with age. Research (Baumrind, 1991; Dwairy 2006) consistently shows warm + firm parenting produces best outcomes across Arab populations.
          </p>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <BookOpen size={40} className="mx-auto mb-4 opacity-30" />
            <p>No techniques found for this combination.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-400">{filtered.length} technique{filtered.length !== 1 ? 's' : ''} shown</p>
            {filtered.map(t => <TechniqueCard key={t.id} t={t} />)}
          </div>
        )}

        {/* Bottom Attribution */}
        <div className="mt-12 p-6 bg-teal-50 rounded-2xl border border-teal-200">
          <h4 className="font-semibold text-teal-700 mb-2">Primary Sources</h4>
          <ul className="text-xs text-teal-600 space-y-1 leading-relaxed">
            <li>• Baumrind (1966, 1991) — Authoritative Parenting Framework, Child Development Journal</li>
            <li>• Gottman & DeClaire (1997) — Raising an Emotionally Intelligent Child, Simon & Schuster</li>
            <li>• Dwairy & Menshar (2006) — Parenting Style in Arab Societies, Journal of Adolescence</li>
            <li>• AAP (2018) — The Power of Play, Pediatrics</li>
            <li>• WHO (2019) — Guidelines on Physical Activity for Children Under 5</li>
            <li>• Al-Ghazali — Ihya Ulum al-Din (Islamic educational philosophy)</li>
            <li>• Ibn Qayyim Al-Jawziyyah — Tuhfat Al-Mawdud bi Ahkam Al-Mawlud (Islamic child-rearing)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
