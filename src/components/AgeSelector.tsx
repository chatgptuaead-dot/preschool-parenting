import React from 'react';
import { AGE_GROUPS } from '../data/content';
import { useApp } from '../context/AppContext';
import type { AgeGroup } from '../types';

interface Props { compact?: boolean; }

export const AgeSelector: React.FC<Props> = ({ compact = false }) => {
  const { selectedAge, setSelectedAge } = useApp();

  return (
    <div className={compact ? '' : 'bg-white border-b border-sand-200 sticky top-16 z-40 shadow-sm'}>
      <div className={`max-w-7xl mx-auto ${compact ? '' : 'px-4 sm:px-6 py-3'}`}>
        <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {!compact && (
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap flex-shrink-0">
              Child's Age:
            </span>
          )}
          <button
            onClick={() => setSelectedAge('all')}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 ${
              selectedAge === 'all'
                ? 'bg-teal-500 text-white shadow-sm'
                : 'bg-sand-100 text-gray-500 hover:bg-sand-200'
            }`}
          >
            All Ages
          </button>
          {AGE_GROUPS.map(ag => (
            <button
              key={ag.id}
              onClick={() => setSelectedAge(ag.id as AgeGroup)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 ${
                selectedAge === ag.id
                  ? 'bg-teal-500 text-white shadow-sm'
                  : 'bg-sand-100 text-gray-500 hover:bg-sand-200'
              }`}
              title={ag.description}
            >
              {ag.label.split('(')[0].trim()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
