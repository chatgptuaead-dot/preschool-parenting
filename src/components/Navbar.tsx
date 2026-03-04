import React, { useState } from 'react';
import { BookOpen, Brain, Users, MessageCircle, Star, Menu, X, Moon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { AppTab } from '../types';

const NAV_ITEMS: { id: AppTab; label: string; icon: React.ReactNode }[] = [
  { id: 'home',        label: 'Home',        icon: <Moon size={16} /> },
  { id: 'content',     label: 'Content',     icon: <BookOpen size={16} /> },
  { id: 'assessments', label: 'Assessments', icon: <Brain size={16} /> },
  { id: 'guide',       label: 'Parenting Guide', icon: <Star size={16} /> },
  { id: 'forum',       label: 'Community',   icon: <Users size={16} /> },
  { id: 'expert',      label: 'Dr. Layla AI', icon: <MessageCircle size={16} /> },
];

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-sand-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => { setActiveTab('home'); setMenuOpen(false); }}
            className="flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center text-white text-lg font-bold shadow-sm group-hover:bg-teal-600 transition-colors">
              ن
            </div>
            <div className="leading-tight">
              <span className="block font-display font-bold text-teal-600 text-lg leading-none">Nashet</span>
              <span className="block text-xs text-gray-400 arabic">نشأة</span>
            </div>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`tab-btn ${activeTab === item.id ? 'tab-btn-active' : 'tab-btn-inactive'}`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.id === 'expert' && (
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                )}
              </button>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-500 hover:text-teal-600 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-sand-200 bg-white px-4 py-3 space-y-1 animate-fadeIn">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setMenuOpen(false); }}
              className={`w-full text-left tab-btn ${activeTab === item.id ? 'tab-btn-active' : 'tab-btn-inactive'}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
