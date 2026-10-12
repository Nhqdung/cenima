import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { MovieDetailPage } from './pages/MovieDetailPage';
import { WatchPage } from './pages/WatchPage';
import { MyListPage } from './pages/MyListPage';
import { AuthModal } from './components/auth/AuthModal';
import { authStorage, type UserProfile } from './lib/auth';
import { Analytics } from '@vercel/analytics/react';
import { LanguageProvider } from './context/LanguageContext';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [initialAuthMode, setInitialAuthMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    setCurrentUser(authStorage.getCurrentUser());
  }, []);

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setInitialAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    authStorage.logout();
    setCurrentUser(null);
  };

  const handleAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user);
  };

  return (
    <LanguageProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-midnight-900 text-[#F5F5F7] flex flex-col font-sans">
          <Header 
            currentUser={currentUser}
            onOpenAuth={handleOpenAuth}
            onLogout={handleLogout}
          />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/movie/:slug" element={<MovieDetailPage currentUser={currentUser} onOpenAuth={handleOpenAuth} />} />
              <Route path="/watch/:slug" element={<WatchPage currentUser={currentUser} onOpenAuth={handleOpenAuth} />} />
              <Route path="/my-list" element={<MyListPage />} />
            </Routes>
          </main>
          <Footer />

          <AuthModal
            isOpen={isAuthModalOpen}
            defaultMode={initialAuthMode}
            onClose={() => setIsAuthModalOpen(false)}
            onSuccess={handleAuthSuccess}
          />

          {/* Vercel Web Analytics */}
          <Analytics />
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
};

export default App;
