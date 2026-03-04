import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ContentLibrary } from './components/ContentLibrary';
import { Assessments } from './components/Assessments';
import { ParentingGuide } from './components/ParentingGuide';
import { Forum } from './components/Forum';
import { AIExpert } from './components/AIExpert';
import { Footer } from './components/Footer';

const App: React.FC = () => {
  const { activeTab } = useApp();

  const renderContent = () => {
    switch (activeTab) {
      case 'home':        return <><Hero /><Footer /></>;
      case 'content':     return <><ContentLibrary /><Footer /></>;
      case 'assessments': return <><Assessments /><Footer /></>;
      case 'guide':       return <><ParentingGuide /><Footer /></>;
      case 'forum':       return <><Forum /><Footer /></>;
      case 'expert':      return <AIExpert />;
      default:            return <><Hero /><Footer /></>;
    }
  };

  return (
    <div className="min-h-screen bg-sand-100 flex flex-col">
      <Navbar />
      <main className="flex-1">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
