import React from 'react';
import { BookOpen, Brain, Users, MessageCircle, Star, ArrowRight, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

const FEATURES = [
  { icon: <BookOpen size={22} />, title: 'Curated Content Library', desc: 'Books, films, music & activities with peer-reviewed cultural relevance for Middle Eastern families.', tab: 'content' as const },
  { icon: <Brain size={22} />, title: 'Professional Assessments', desc: 'Conners-based ADHD screening, Gardner\'s Multiple Intelligences, and WHO developmental milestones.', tab: 'assessments' as const },
  { icon: <Star size={22} />, title: 'Evidence-Based Parenting Guide', desc: 'Age-specific techniques grounded in psychology, culturally adapted for the Arab world.', tab: 'guide' as const },
  { icon: <Users size={22} />, title: 'Community Forum', desc: 'Connect with parents across the MENA region — share experiences, ask questions, find your tribe.', tab: 'forum' as const },
  { icon: <MessageCircle size={22} />, title: 'AI Expert: Dr. Layla Hassan', desc: 'A culturally-aware AI parenting advisor drawing from peer-reviewed research and Islamic wisdom.', tab: 'expert' as const },
];

const SOURCES = [
  'World Health Organization (WHO)',
  'American Academy of Pediatrics',
  'Arab Journal of Psychiatry',
  'King Abdulaziz University Research',
  'Conners Rating Scales (ADHD)',
  'Howard Gardner (Multiple Intelligences)',
  'Hamdan Bin Mohammed Smart University',
  'Quran & Authenticated Hadith',
];

export const Hero: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <div>
      {/* ── Hero Banner ── */}
      <section className="pattern-bg text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 rounded-full text-sm mb-6 backdrop-blur-sm border border-white/20">
              <ShieldCheck size={14} className="text-gold-300" />
              <span>Peer-reviewed sources · Culturally adapted for MENA</span>
            </div>
            <h1 className="font-display text-5xl sm:text-6xl font-bold leading-tight mb-4">
              Raise Thriving Children
              <span className="block text-gold-300 mt-1">the Right Way</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/80 mb-3 max-w-2xl leading-relaxed">
              The first comprehensive parenting platform built for Middle Eastern families — combining world-class developmental science with Islamic values and Arab cultural wisdom.
            </p>
            <p className="arabic text-xl text-white/70 mb-8 text-right">
              "وَاللَّهُ أَخْرَجَكُم مِّن بُطُونِ أُمَّهَاتِكُمْ لَا تَعْلَمُونَ شَيْئًا وَجَعَلَ لَكُمُ السَّمْعَ وَالْأَبْصَارَ وَالْأَفْئِدَةَ"
              <span className="block text-sm text-white/50 mt-1">— Quran 16:78</span>
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setActiveTab('content')} className="btn-gold text-base px-6 py-3">
                Explore Content <ArrowRight size={18} />
              </button>
              <button onClick={() => setActiveTab('expert')} className="inline-flex items-center gap-2 px-6 py-3 bg-white/15 text-white border border-white/30 rounded-xl font-semibold text-base transition-all hover:bg-white/25 backdrop-blur-sm active:scale-95">
                Chat with Dr. Layla <MessageCircle size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature Cards ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="section-title">Everything You Need, In One Place</h2>
          <p className="section-subtitle mx-auto text-center">
            Built on decades of research, trusted by families across Saudi Arabia, UAE, Jordan, Lebanon, Egypt, Kuwait, Qatar, and beyond.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(f.tab)}
              className="card text-left p-6 group hover:border-teal-300 hover:-translate-y-1 transition-all duration-200 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-500 flex items-center justify-center mb-4 group-hover:bg-teal-500 group-hover:text-white transition-all duration-200">
                {f.icon}
              </div>
              <h3 className="font-semibold text-gray-800 mb-2 font-display">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              <span className="mt-4 text-teal-500 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                Explore <ArrowRight size={14} />
              </span>
            </button>
          ))}
          {/* Age Selector card */}
          <div className="card p-6 bg-gradient-to-br from-gold-50 to-sand-100 border-gold-200 col-span-1 md:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 rounded-xl bg-gold-100 text-gold-500 flex items-center justify-center mb-4 text-xl">
              🎯
            </div>
            <h3 className="font-semibold text-gray-800 mb-2 font-display">Age-Personalised</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Set your child's age and every section — content, techniques, assessments — adapts to show what's most relevant for their developmental stage.
            </p>
            <button
              onClick={() => setActiveTab('guide')}
              className="mt-4 text-gold-600 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
            >
              Set child's age <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Sources Banner ── */}
      <section className="bg-teal-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h3 className="font-display text-2xl font-semibold mb-2">Built on Trusted Sources</h3>
            <p className="text-white/70 text-sm">All content references peer-reviewed research and culturally relevant scholarship</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {SOURCES.map((s, i) => (
              <span key={i} className="px-4 py-2 bg-white/10 rounded-full text-sm text-white/90 border border-white/20">
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quick Stats ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { n: '40+', label: 'Curated Content Items', sub: 'books, films, music' },
            { n: '3', label: 'Professional Assessments', sub: 'ADHD, MI, Milestones' },
            { n: '15', label: 'Parenting Techniques', sub: 'evidence-based, age-sorted' },
            { n: '8+', label: 'Research Sources', sub: 'peer-reviewed journals' },
          ].map((stat, i) => (
            <div key={i} className="card p-6">
              <div className="font-display text-4xl font-bold text-teal-500 mb-1">{stat.n}</div>
              <div className="font-semibold text-gray-700 text-sm mb-1">{stat.label}</div>
              <div className="text-xs text-gray-400">{stat.sub}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
