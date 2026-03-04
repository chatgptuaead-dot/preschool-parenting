import React from 'react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { setActiveTab } = useApp();
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-white text-lg font-bold">ن</div>
              <div>
                <span className="block font-display font-bold text-white text-lg leading-none">Nashet</span>
                <span className="block text-xs text-gray-400 arabic">نشأة</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              The Middle East's most comprehensive parenting platform — evidence-based, culturally rooted, and deeply informed by Islamic values.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wide">Platform</h4>
            <ul className="space-y-2">
              {[
                ['Content Library', 'content'],
                ['Assessments', 'assessments'],
                ['Parenting Guide', 'guide'],
                ['Community Forum', 'forum'],
                ['Dr. Layla AI', 'expert'],
              ].map(([label, tab]) => (
                <li key={tab}>
                  <button onClick={() => setActiveTab(tab as any)} className="text-sm text-gray-400 hover:text-gold-300 transition-colors">
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Sources */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wide">Key Sources</h4>
            <ul className="space-y-2 text-xs text-gray-400 leading-relaxed">
              <li>World Health Organization (WHO)</li>
              <li>American Academy of Pediatrics</li>
              <li>Arab Journal of Psychiatry</li>
              <li>Conners Rating Scales (ADHD)</li>
              <li>Howard Gardner — MI Theory</li>
              <li>CDC "Learn the Signs. Act Early."</li>
              <li>Sahih Al-Bukhari & Muslim (Hadith)</li>
              <li>King Abdulaziz University Research</li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wide">Important</h4>
            <p className="text-xs text-gray-400 leading-relaxed mb-3">
              All content is for educational purposes only. Assessments are screening tools, not diagnostic instruments. Always consult licensed healthcare professionals for medical or psychological concerns.
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              The AI (Dr. Layla) is an AI assistant and cannot replace a licensed psychologist or paediatrician.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span>© 2025 Nashet. Built for families across the Arab world.</span>
          </div>
          <div className="arabic text-gray-500">
            "وَجَعَلْنَاكُمْ شُعُوبًا وَقَبَائِلَ لِتَعَارَفُوا" — القرآن الكريم ٤٩:١٣
          </div>
        </div>
      </div>
    </footer>
  );
};
