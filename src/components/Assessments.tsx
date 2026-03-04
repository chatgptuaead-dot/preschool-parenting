import React, { useState } from 'react';
import { Brain, ChevronRight, RotateCcw, CheckCircle, AlertTriangle, AlertCircle, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { ADHD_ASSESSMENT, MI_ASSESSMENT, MILESTONES } from '../data/assessments';
import type { MilestoneAgeGroup } from '../data/assessments';
import type { AssessmentDefinition, AssessmentResult } from '../types';

// ── MI Result rendering ──────────────────────────────────────────────────────
const MI_LABELS: Record<string, { emoji: string; color: string; arabicName: string }> = {
  Linguistic:    { emoji: '📚', color: '#3B82F6', arabicName: 'اللغوي' },
  Logical:       { emoji: '🔢', color: '#8B5CF6', arabicName: 'المنطقي الرياضي' },
  Spatial:       { emoji: '🎨', color: '#EC4899', arabicName: 'المكاني البصري' },
  Musical:       { emoji: '🎵', color: '#F59E0B', arabicName: 'الموسيقي' },
  Kinesthetic:   { emoji: '⚽', color: '#10B981', arabicName: 'الحركي الجسدي' },
  Interpersonal: { emoji: '🤝', color: '#06B6D4', arabicName: 'الاجتماعي' },
  Intrapersonal: { emoji: '🪞', color: '#6366F1', arabicName: 'الذاتي' },
  Naturalist:    { emoji: '🌿', color: '#22C55E', arabicName: 'الطبيعي' },
};

// ── Generic Assessment Component ─────────────────────────────────────────────
const AssessmentRunner: React.FC<{ def: AssessmentDefinition; onBack: () => void }> = ({ def, onBack }) => {
  const [scores, setScores] = useState<Record<number, number>>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  const ITEMS_PER_PAGE = 6;
  const questions = def.questions;
  const totalPages = Math.ceil(questions.length / ITEMS_PER_PAGE);
  const pageQuestions = questions.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);
  const answeredCount = Object.keys(scores).length;
  const progress = (answeredCount / questions.length) * 100;

  const handleScore = (qId: number, val: number) => setScores(prev => ({ ...prev, [qId]: val }));

  const pageComplete = pageQuestions.every(q => scores[q.id] !== undefined);

  const submit = () => {
    const res = def.scoring.interpret(scores);
    setResult(res);
  };

  if (showDisclaimer) return (
    <div className="max-w-2xl mx-auto animate-fadeIn">
      <button onClick={onBack} className="text-sm text-gray-500 hover:text-teal-600 mb-6 flex items-center gap-1 transition-colors">
        ← Back to Assessments
      </button>
      <div className="card p-8">
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center mb-5">
          <Info size={24} />
        </div>
        <h2 className="font-display text-2xl font-bold text-gray-800 mb-1">{def.title}</h2>
        <p className="arabic text-lg text-gray-500 mb-4">{def.arabicTitle}</p>
        <p className="text-sm text-gray-600 leading-relaxed mb-5">{def.description}</p>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
          <p className="text-sm text-amber-800 leading-relaxed">{def.disclaimer}</p>
        </div>
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-6">
          <p className="text-xs font-semibold text-teal-600 uppercase tracking-wide mb-1">Academic Source</p>
          <p className="text-sm text-teal-800 leading-relaxed">{def.source}</p>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-500 mb-6">
          <span className="badge bg-teal-50 text-teal-600">{questions.length} Questions</span>
          <span className="badge bg-sand-100 text-gray-500">{def.ageRange}</span>
          <span className="badge bg-sand-100 text-gray-500">{Math.ceil(questions.length / 2)} min approx.</span>
        </div>
        <button onClick={() => setShowDisclaimer(false)} className="btn-primary w-full justify-center text-base py-3">
          Begin Assessment <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );

  if (result) return <AssessmentResultView def={def} result={result} scores={scores} onRetake={() => { setScores({}); setCurrentPage(0); setResult(null); setShowDisclaimer(true); }} onBack={onBack} />;

  return (
    <div className="max-w-2xl mx-auto animate-fadeIn">
      <button onClick={onBack} className="text-sm text-gray-500 hover:text-teal-600 mb-6 flex items-center gap-1 transition-colors">
        ← Back to Assessments
      </button>

      {/* Progress */}
      <div className="card p-5 mb-5">
        <div className="flex items-center justify-between mb-2 text-sm">
          <span className="font-semibold text-gray-700">{def.title}</span>
          <span className="text-gray-400">{answeredCount}/{questions.length} answered</span>
        </div>
        <div className="w-full bg-sand-200 rounded-full h-2">
          <div className="bg-teal-500 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-xs text-gray-400 mt-2">Page {currentPage + 1} of {totalPages}</p>
      </div>

      {/* Questions */}
      <div className="space-y-4 mb-6">
        {pageQuestions.map((q, qi) => (
          <div key={q.id} className="card p-5 animate-fadeIn" style={{ animationDelay: `${qi * 60}ms` }}>
            <div className="flex items-start gap-3 mb-4">
              <span className="w-7 h-7 rounded-full bg-teal-100 text-teal-600 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {q.id}
              </span>
              <div>
                <p className="text-sm font-medium text-gray-800 leading-relaxed">{q.text}</p>
                {q.arabicText && <p className="arabic text-sm text-gray-500 mt-1">{q.arabicText}</p>}
                {q.subscale && <span className="badge bg-purple-50 text-purple-600 text-xs mt-1">{q.subscale}</span>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {def.scoring.options.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => handleScore(q.id, opt.value)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-all border text-left leading-tight ${
                    scores[q.id] === opt.value
                      ? 'bg-teal-500 text-white border-teal-500 shadow-sm'
                      : 'bg-white text-gray-500 border-sand-300 hover:border-teal-300 hover:bg-teal-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        {currentPage > 0 && (
          <button onClick={() => setCurrentPage(p => p - 1)} className="btn-secondary flex-1 justify-center">
            Previous
          </button>
        )}
        {currentPage < totalPages - 1 ? (
          <button
            onClick={() => setCurrentPage(p => p + 1)}
            disabled={!pageComplete}
            className={`flex-1 justify-center ${pageComplete ? 'btn-primary' : 'btn-primary opacity-40 cursor-not-allowed'}`}
          >
            Next Page <ChevronRight size={16} />
          </button>
        ) : (
          <button
            onClick={submit}
            disabled={answeredCount < questions.length}
            className={`flex-1 justify-center ${answeredCount >= questions.length ? 'btn-gold' : 'btn-gold opacity-40 cursor-not-allowed'}`}
          >
            <CheckCircle size={16} /> Submit ({answeredCount}/{questions.length})
          </button>
        )}
      </div>
    </div>
  );
};

// ── Result View ───────────────────────────────────────────────────────────────
const AssessmentResultView: React.FC<{
  def: AssessmentDefinition;
  result: AssessmentResult;
  scores: Record<number, number>;
  onRetake: () => void;
  onBack: () => void;
}> = ({ def, result, scores, onRetake, onBack }) => {
  const isMI = def.id === 'mi';
  let miData: { subscores: Record<string,number>; sorted: [string,number][] } | null = null;

  if (isMI) {
    try { miData = JSON.parse(result.detail); } catch { /* ignore */ }
  }

  const LevelIcon = result.level === 'low' ? CheckCircle :
                    result.level === 'moderate' ? Info :
                    result.level === 'elevated' ? AlertTriangle : AlertCircle;

  return (
    <div className="max-w-2xl mx-auto animate-slideUp">
      <button onClick={onBack} className="text-sm text-gray-500 hover:text-teal-600 mb-6 flex items-center gap-1">
        ← Back to Assessments
      </button>

      {/* Result Header */}
      <div className="card p-7 mb-5">
        <div className="flex items-center gap-3 mb-4">
          <LevelIcon size={28} style={{ color: result.color }} />
          <h2 className="font-display text-xl font-bold text-gray-800">{result.headline}</h2>
        </div>

        {!isMI && (
          <p className="text-sm text-gray-600 leading-relaxed bg-sand-50 rounded-xl p-4">{result.detail}</p>
        )}

        {/* MI Bar Chart */}
        {isMI && miData && (
          <div className="space-y-3">
            {miData.sorted.map(([name, score]) => {
              const pct = Math.round((score / 15) * 100);
              const meta = MI_LABELS[name];
              return (
                <div key={name}>
                  <div className="flex items-center justify-between mb-1 text-sm">
                    <span className="font-medium text-gray-700 flex items-center gap-1.5">
                      <span>{meta?.emoji}</span> {name}
                      <span className="arabic text-xs text-gray-400">({meta?.arabicName})</span>
                    </span>
                    <span className="font-bold" style={{ color: meta?.color }}>{pct}%</span>
                  </div>
                  <div className="w-full bg-sand-200 rounded-full h-3">
                    <div
                      className="h-3 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: meta?.color || '#006D77' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className="card p-6 mb-5">
        <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <CheckCircle size={16} className="text-teal-500" />
          Recommendations
        </h3>
        <div className="space-y-3">
          {result.recommendations.map((rec, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-teal-50 rounded-xl">
              <span className="w-5 h-5 rounded-full bg-teal-500 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
                {i + 1}
              </span>
              <p className="text-sm text-gray-700 leading-relaxed">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Seek Help Banner */}
      {result.seekHelp && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-5">
          <div className="flex items-center gap-2 text-red-700 font-semibold mb-2">
            <AlertTriangle size={18} />
            Professional Evaluation Recommended
          </div>
          <p className="text-sm text-red-600 leading-relaxed">
            Based on the screening results, we recommend consulting with a licensed child psychologist or developmental paediatrician. Early intervention leads to significantly better outcomes.
          </p>
        </div>
      )}

      {/* Source */}
      <div className="card p-5 mb-6 source-card">
        <p className="text-xs font-semibold text-gold-600 uppercase tracking-wide mb-1">Assessment Source</p>
        <p className="text-xs text-gray-500 leading-relaxed">{def.source}</p>
      </div>

      <div className="flex gap-3">
        <button onClick={onRetake} className="btn-secondary flex-1 justify-center">
          <RotateCcw size={16} /> Retake Assessment
        </button>
        <button onClick={onBack} className="btn-primary flex-1 justify-center">
          Other Assessments <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

// ── Milestones Checker ────────────────────────────────────────────────────────
const MilestonesChecker: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [selectedGroup, setSelectedGroup] = useState<MilestoneAgeGroup | null>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [showResult, setShowResult] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  const toggle = (id: string) => setChecked(prev => ({ ...prev, [id]: !prev[id] }));

  const analyze = () => {
    if (!selectedGroup) return;
    setShowResult(true);
  };

  const notChecked = selectedGroup ? selectedGroup.items.filter((item) => !checked[item.id]) : [];
  const domainCounts = selectedGroup
    ? selectedGroup.items.reduce<Record<string, { total: number; checked: number }>>((acc, item) => {
        if (!acc[item.domain]) acc[item.domain] = { total: 0, checked: 0 };
        acc[item.domain].total++;
        if (checked[item.id]) acc[item.domain].checked++;
        return acc;
      }, {})
    : {};

  if (showResult && selectedGroup) return (
    <div className="max-w-2xl mx-auto animate-slideUp">
      <button onClick={() => setShowResult(false)} className="text-sm text-gray-500 hover:text-teal-600 mb-6 flex items-center gap-1">
        ← Back to Checklist
      </button>
      <div className="card p-6 mb-5">
        <h3 className="font-display text-xl font-bold text-gray-800 mb-4">
          Milestone Report — {selectedGroup.label}
        </h3>
        {Object.entries(domainCounts).map(([domain, { total, checked: c }]) => {
          const pct = Math.round((c / total) * 100);
          const color = pct >= 80 ? '#16a34a' : pct >= 60 ? '#d97706' : '#dc2626';
          return (
            <div key={domain} className="mb-4">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">{domain}</span>
                <span className="font-bold" style={{ color }}>{c}/{total} ({pct}%)</span>
              </div>
              <div className="w-full bg-sand-200 rounded-full h-2">
                <div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
              </div>
            </div>
          );
        })}
        {notChecked.length > 0 && (
          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-5">
            <p className="font-semibold text-amber-700 mb-3 flex items-center gap-2">
              <AlertTriangle size={16} /> Items Not Yet Achieved ({notChecked.length})
            </p>
            <ul className="space-y-2">
              {notChecked.map(item => (
                <li key={item.id} className="text-sm text-amber-800 flex items-start gap-2">
                  <span className="badge bg-amber-100 text-amber-600 mt-0.5">{item.domain}</span>
                  {item.text}
                </li>
              ))}
            </ul>
            {notChecked.length >= 3 && (
              <p className="text-sm text-amber-700 mt-4 font-medium">
                ⚠️ Three or more milestones not yet achieved. Consider discussing with your paediatrician. WHO & CDC recommend evaluation if 2+ domain milestones are delayed.
              </p>
            )}
          </div>
        )}
        {notChecked.length === 0 && (
          <div className="mt-5 bg-green-50 border border-green-200 rounded-xl p-5 text-center">
            <CheckCircle size={32} className="text-green-500 mx-auto mb-3" />
            <p className="font-semibold text-green-700">All milestones achieved!</p>
            <p className="text-sm text-green-600 mt-1">Your child is on track with WHO/CDC developmental standards for {selectedGroup.label}.</p>
          </div>
        )}
      </div>
      <p className="text-xs text-gray-400 text-center">
        Based on CDC "Learn the Signs. Act Early." and WHO Multicentre Growth Reference Study.
        This checklist is not a diagnostic tool. Consult your paediatrician for clinical assessment.
      </p>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto animate-fadeIn">
      <button onClick={onBack} className="text-sm text-gray-500 hover:text-teal-600 mb-6 flex items-center gap-1">
        ← Back to Assessments
      </button>
      <div className="card p-6 mb-6">
        <h2 className="font-display text-2xl font-bold text-gray-800 mb-2">Developmental Milestones</h2>
        <p className="arabic text-lg text-gray-500 mb-3">مراحل النمو والتطور</p>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          Track your child's developmental milestones across communication, movement, social, and cognitive domains.
          Based on CDC "Learn the Signs. Act Early." and WHO Child Development Standards.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800 leading-relaxed">
          📌 Select your child's age group below and check each milestone they have achieved. Review the results at the end.
        </div>
      </div>

      {/* Age Group Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {MILESTONES.map(mg => (
          <button
            key={mg.age}
            onClick={() => { setSelectedGroup(mg); setChecked({}); setShowResult(false); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
              selectedGroup?.age === mg.age
                ? 'bg-teal-500 text-white border-teal-500'
                : 'bg-white text-gray-600 border-sand-300 hover:border-teal-300'
            }`}
          >
            {mg.label}
          </button>
        ))}
      </div>

      {selectedGroup && (
        <div className="animate-fadeIn">
          {/* Domain groupings */}
          {(['Communication', 'Movement', 'Social', 'Cognitive'] as const).map(domain => {
            const items = selectedGroup.items.filter((item) => item.domain === domain);
            if (!items.length) return null;
            const isOpen = openGroup === domain;
            return (
              <div key={domain} className="card mb-3 overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-sand-50 transition-colors"
                  onClick={() => setOpenGroup(isOpen ? null : domain)}
                >
                  <span className="font-semibold text-gray-700">{domain}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-teal-600">
                      {items.filter((x) => checked[x.id]).length}/{items.length}
                    </span>
                    {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                  </div>
                </button>
                {isOpen && (
                  <div className="border-t border-sand-200 p-4 space-y-3 animate-fadeIn">
                    {items.map(item => (
                      <label key={item.id} className="flex items-start gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                          checked[item.id] ? 'bg-teal-500 border-teal-500' : 'border-gray-300 group-hover:border-teal-400'
                        }`} onClick={() => toggle(item.id)}>
                          {checked[item.id] && <CheckCircle size={12} className="text-white" />}
                        </div>
                        <div>
                          <p className="text-sm text-gray-700 leading-relaxed">{item.text}</p>
                          {item.arabicText && <p className="arabic text-xs text-gray-400 mt-0.5">{item.arabicText}</p>}
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <button
            onClick={analyze}
            className="btn-gold w-full justify-center mt-4 py-3 text-base"
          >
            <CheckCircle size={18} /> View My Report
          </button>
        </div>
      )}
    </div>
  );
};

// ── Main Assessments Page ─────────────────────────────────────────────────────
export const Assessments: React.FC = () => {
  const [active, setActive] = useState<string | null>(null);

  const CARDS = [
    { def: ADHD_ASSESSMENT, emoji: '🧠', subtitle: 'Parent-report · 18 questions · ~10 min', color: 'blue' },
    { def: MI_ASSESSMENT,   emoji: '🌟', subtitle: 'Parent-report · 40 questions · ~15 min', color: 'purple' },
  ];

  if (active === 'adhd')       return <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10"><AssessmentRunner def={ADHD_ASSESSMENT} onBack={() => setActive(null)} /></div>;
  if (active === 'mi')         return <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10"><AssessmentRunner def={MI_ASSESSMENT}   onBack={() => setActive(null)} /></div>;
  if (active === 'milestones') return <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10"><MilestonesChecker onBack={() => setActive(null)} /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h2 className="section-title">Assessments & Screenings</h2>
        <p className="section-subtitle">
          Professional-grade screening tools adapted from internationally validated instruments, used in clinics across the Arab world.
          Results provide guidance — professional evaluation is recommended for clinical concerns.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* ADHD & MI Cards */}
        {CARDS.map(({ def, emoji, subtitle, color }) => (
          <div key={def.id} className="card p-6 flex flex-col">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4 bg-${color}-50`}>
              {emoji}
            </div>
            <h3 className="font-display font-bold text-gray-800 text-lg mb-0.5">{def.title}</h3>
            <p className="arabic text-sm text-gray-400 mb-2">{def.arabicTitle}</p>
            <p className="text-xs text-gray-400 mb-3">{subtitle}</p>
            <p className="text-sm text-gray-500 leading-relaxed flex-1">{def.description.slice(0, 160)}…</p>
            <div className="mt-4 pt-4 border-t border-sand-200">
              <div className="text-xs text-teal-600 font-medium mb-3 source-card pl-3 py-1">
                {def.source.slice(0, 80)}…
              </div>
              <button onClick={() => setActive(def.id)} className="btn-primary w-full justify-center">
                Start Assessment <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ))}

        {/* Milestones Card */}
        <div className="card p-6 flex flex-col">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4 bg-green-50">
            📋
          </div>
          <h3 className="font-display font-bold text-gray-800 text-lg mb-0.5">Developmental Milestones</h3>
          <p className="arabic text-sm text-gray-400 mb-2">مراحل النمو والتطور</p>
          <p className="text-xs text-gray-400 mb-3">Parent-checklist · 5 age groups · ~5 min</p>
          <p className="text-sm text-gray-500 leading-relaxed flex-1">
            Track your child's progress across communication, movement, social, and cognitive domains. Based on CDC "Learn the Signs. Act Early." and WHO Growth Reference Study.
          </p>
          <div className="mt-4 pt-4 border-t border-sand-200">
            <div className="text-xs text-teal-600 font-medium mb-3 source-card pl-3 py-1">
              CDC Developmental Milestones & WHO Multicentre Growth Reference Study (2006)
            </div>
            <button onClick={() => setActive('milestones')} className="btn-primary w-full justify-center">
              Start Checklist <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-800 mb-1">Important Disclaimer</p>
            <p className="text-sm text-amber-700 leading-relaxed">
              These tools are <strong>screening instruments only</strong>, not diagnostic tests. Results identify areas for further exploration and should never replace a comprehensive clinical evaluation by a licensed professional. If any assessment raises concern, we strongly encourage consulting:
            </p>
            <ul className="text-sm text-amber-700 mt-2 space-y-1 ml-4 list-disc">
              <li><strong>UAE:</strong> SEHA Developmental Paediatrics, Priory Hospital Dubai</li>
              <li><strong>KSA:</strong> Ministry of Health Child Development Centers, King Faisal Specialist Hospital</li>
              <li><strong>Jordan:</strong> King Hussein Medical Center, University of Jordan Child Development Clinic</li>
              <li><strong>Lebanon:</strong> American University of Beirut Medical Center Paediatrics</li>
              <li><strong>Egypt:</strong> Cairo University Children's Hospital, CAPMAS child services</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
