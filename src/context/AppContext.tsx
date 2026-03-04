import React, { createContext, useContext, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { AgeGroup, AppTab, UserProfile } from '../types';

interface AppContextType {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  selectedAge: AgeGroup | 'all';
  setSelectedAge: (age: AgeGroup | 'all') => void;
  groqApiKey: string;
  setGroqApiKey: (key: string) => void;
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile | null) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [selectedAge, setSelectedAge] = useLocalStorage<AgeGroup | 'all'>('nashet-age', 'all');
  const [groqApiKey, setGroqApiKey] = useLocalStorage<string>('nashet-groq-key', '');
  const [userProfile, setUserProfile] = useLocalStorage<UserProfile | null>('nashet-user', null);

  return (
    <AppContext.Provider value={{
      activeTab, setActiveTab,
      selectedAge, setSelectedAge,
      groqApiKey, setGroqApiKey,
      userProfile, setUserProfile,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
};
