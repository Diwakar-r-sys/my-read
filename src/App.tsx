import React from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import Layout from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import Timeline from '@/pages/Timeline';
import ExamTracker from '@/pages/ExamTracker';
import YouTubeGrowth from '@/pages/YouTubeGrowth';

const AppContent: React.FC = () => {
  const { activeTab } = useApp();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'timeline': return <Timeline />;
      case 'exam': return <ExamTracker />;
      case 'youtube': return <YouTubeGrowth />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout>
      {renderContent()}
    </Layout>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
