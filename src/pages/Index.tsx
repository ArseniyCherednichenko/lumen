import { useState, useEffect } from 'react';
import SplashView from '@/components/SplashView';
import TimerView from '@/components/TimerView';
import StatsView from '@/components/StatsView';
import QuotesView from '@/components/QuotesView';
import SettingsView from '@/components/SettingsView';
import Navigation from '@/components/Navigation';

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('timer');
  const [statsKey, setStatsKey] = useState(0);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleStatsUpdate = () => {
    setStatsKey(prev => prev + 1);
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'timer':
        return <TimerView onStatsUpdate={handleStatsUpdate} />;
      case 'stats':
        return <StatsView key={statsKey} />;
      case 'quotes':
        return <QuotesView />;
      case 'settings':
        return <SettingsView onStatsReset={handleStatsUpdate} />;
      default:
        return <TimerView onStatsUpdate={handleStatsUpdate} />;
    }
  };

  if (showSplash) {
    return <SplashView onComplete={handleSplashComplete} />;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {renderActiveView()}
      </div>
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
