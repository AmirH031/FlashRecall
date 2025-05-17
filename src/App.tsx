import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { FlashcardProvider } from './contexts/FlashcardContext';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { StudyPage } from './pages/StudyPage';
import { ManagePage } from './pages/ManagePage';
import { DashboardPage } from './pages/DashboardPage';
import { Footer } from './components/Footer';

export type AppPage = 'home' | 'study' | 'manage' | 'dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('home');

  // Handle navigation
  const navigateTo = (page: AppPage) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <ThemeProvider>
      <FlashcardProvider>
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <Navbar currentPage={currentPage} navigateTo={navigateTo} />
          <main className="flex-grow px-4 md:px-8 lg:px-16 py-6 md:py-10">
            {currentPage === 'home' && <HomePage navigateTo={navigateTo} />}
            {currentPage === 'study' && <StudyPage navigateTo={navigateTo} />}
            {currentPage === 'manage' && <ManagePage />}
            {currentPage === 'dashboard' && <DashboardPage />}
          </main>
          <Footer />
        </div>
      </FlashcardProvider>
    </ThemeProvider>
  );
}

export default App;