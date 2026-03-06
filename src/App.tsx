import React from 'react';
import './styles/globals.css';
import { useAppState } from './hooks/useAppState';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { Dashboard } from './pages/Dashboard';
import { CalendarPage } from './pages/Calendar';
import { TopicsPage } from './pages/Topics';
import { ReportsPage } from './pages/Reports';
import { exportToPDF } from './services/pdfExport';

function App() {
  const {
    topics, sessions, theme, activeTab,
    setActiveTab, toggleTheme,
    addTopic, deleteTopic,
    toggleStudySession, markTodayStudied,
  } = useAppState();

  const handleExportPDF = () => {
    exportToPDF(topics, sessions);
  };

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard topics={topics} sessions={sessions} onMarkToday={markTodayStudied} />;
      case 'calendar':
        return <CalendarPage topics={topics} sessions={sessions} onToggleSession={toggleStudySession} />;
      case 'topics':
        return (
          <TopicsPage
            topics={topics}
            sessions={sessions}
            onAdd={addTopic}
            onDelete={deleteTopic}
            onMarkToday={markTodayStudied}
          />
        );
      case 'reports':
        return <ReportsPage topics={topics} sessions={sessions} />;
    }
  };

  return (
    <>
      <Header theme={theme} onToggleTheme={toggleTheme} onExportPDF={handleExportPDF} />
      <main className="page-content">
        {renderPage()}
      </main>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </>
  );
}

export default App;
