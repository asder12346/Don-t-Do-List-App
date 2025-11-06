import React, { useState, useEffect, createContext } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { FocusPage } from './pages/FocusPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AiCoachPage } from './pages/AiCoachPage';
import { ThemeContextType } from './types';
import { useNotificationManager } from './hooks/useNotificationManager';

// Onboarding Pages
import { WelcomePage } from './pages/onboarding/WelcomePage';
import { BenefitsPage } from './pages/onboarding/BenefitsPage';
import { AuthPlaceholderPage } from './pages/onboarding/AuthPlaceholderPage';
import { FirstTaskPage } from './pages/onboarding/FirstTaskPage';
import { NotificationsPage } from './pages/onboarding/NotificationsPage';

export const ThemeContext = createContext<ThemeContextType | null>(null);
const ONBOARDING_COMPLETED_KEY = 'onboardingCompleted';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    // If a theme is saved in localStorage, use it. Otherwise, default to dark.
    return savedTheme ? (savedTheme as 'light' | 'dark') : 'dark';
  });

  // This state is just to help re-render, the source of truth is localStorage
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(() => {
    return localStorage.getItem(ONBOARDING_COMPLETED_KEY) === 'true';
  });

  // Initialize the notification manager to handle background reminders.
  useNotificationManager();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  const completeOnboarding = () => {
    localStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
    setIsOnboardingCompleted(true);
  };


  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <HashRouter>
        <Routes>
          {isOnboardingCompleted ? (
            // --- MAIN APP ROUTES ---
            // If onboarding is complete, render the main application routes.
            <>
              {/* As requested, the root path redirects to /home for existing users. */}
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/focus" element={<FocusPage />} />
              <Route path="/ai-coach" element={<AiCoachPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
               {/* Redirect any lingering attempts to access onboarding back to home. */}
              <Route path="/onboarding/*" element={<Navigate to="/home" replace />} />
            </>
          ) : (
            // --- ONBOARDING FLOW ROUTES ---
            // If onboarding is not complete, set up and direct the user through the onboarding flow.
            <>
              {/* The necessary routes for the multi-step onboarding flow. */}
              <Route path="/onboarding/welcome" element={<WelcomePage />} />
              <Route path="/onboarding/benefits" element={<BenefitsPage />} />
              <Route path="/onboarding/auth" element={<AuthPlaceholderPage />} />
              <Route path="/onboarding/first-task" element={<FirstTaskPage />} />
              <Route path="/onboarding/notifications" element={<NotificationsPage onComplete={completeOnboarding} />} />

              {/* As requested, redirect the root path and any other path to the start of the onboarding flow. */}
              <Route path="*" element={<Navigate to="/onboarding/welcome" replace />} />
            </>
          )}
        </Routes>
      </HashRouter>
    </ThemeContext.Provider>
  );
};

export default App;