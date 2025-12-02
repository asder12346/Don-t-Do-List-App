
import React, { useState, useEffect, useRef } from 'react';
import { Layout } from '../components/Layout';
import { Modal } from '../components/Modal';
import { TrashIcon } from '../components/icons';
import { motion } from 'framer-motion';
import { PageTransition } from '../components/PageTransition';
import { triggerHaptic } from '../utils/haptics';

const WORK_DURATION = 25 * 60; // 25 minutes
const BREAK_DURATION = 5 * 60; // 5 minutes

export const FocusPage: React.FC = () => {
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [timeLeft, setTimeLeft] = useState(WORK_DURATION);
  const [isActive, setIsActive] = useState(false);
  const [isWelcomeBackModalOpen, setIsWelcomeBackModalOpen] = useState(false);
  const [distractionUrls, setDistractionUrls] = useState<string[]>(() => {
    const saved = localStorage.getItem('distraction-urls');
    return saved ? JSON.parse(saved) : ['youtube.com', 'twitter.com', 'instagram.com'];
  });
  const [newUrl, setNewUrl] = useState('');
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    localStorage.setItem('distraction-urls', JSON.stringify(distractionUrls));
  }, [distractionUrls]);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      triggerHaptic([100, 50, 100]); // Long vibration pattern on finish
      if (Notification.permission === 'granted') {
          new Notification(mode === 'work' ? "Time for a break!" : "Time to focus!", {
              body: mode === 'work' ? "Great work! Your focus session is over." : "Your break is over. Let's get back to it.",
              icon: '/vite.svg',
          });
      }
      if (mode === 'work') {
        setMode('break');
        setTimeLeft(BREAK_DURATION);
      } else {
        setMode('work');
        setTimeLeft(WORK_DURATION);
      }
      setIsActive(false);
    }
  }, [timeLeft, mode]);

  useEffect(() => {
    const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible' && isActive) {
            setIsWelcomeBackModalOpen(true);
        }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
}, [isActive]);

  const toggleTimer = () => {
      triggerHaptic(20);
      setIsActive(!isActive);
  };

  const resetTimer = () => {
    triggerHaptic(10);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsActive(false);
    setTimeLeft(mode === 'work' ? WORK_DURATION : BREAK_DURATION);
  };
  
  const switchMode = (newMode: 'work' | 'break') => {
    triggerHaptic(10);
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'work' ? WORK_DURATION : BREAK_DURATION);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }

  const addUrl = (e: React.FormEvent) => {
      e.preventDefault();
      if (newUrl && !distractionUrls.includes(newUrl)) {
          triggerHaptic(10);
          setDistractionUrls([...distractionUrls, newUrl.trim()]);
          setNewUrl('');
      }
  }

  const removeUrl = (urlToRemove: string) => {
      triggerHaptic(10);
      setDistractionUrls(distractionUrls.filter(url => url !== urlToRemove));
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const totalDuration = mode === 'work' ? WORK_DURATION : BREAK_DURATION;
  const progress = (totalDuration - timeLeft) / totalDuration;

  return (
    <Layout>
      <PageTransition>
        <div className="p-4 md:p-8 flex flex-col items-center justify-start h-full pt-10 md:pt-16">
            <div className="w-full max-w-md bg-white dark:bg-bg-dark-secondary p-8 rounded-2xl shadow-lg text-center mb-8">
                <div className="flex justify-center mb-6">
                    <button onClick={() => switchMode('work')} className={`px-6 py-2 rounded-l-full transition-colors ${mode === 'work' ? 'bg-primary-light dark:bg-primary-dark text-white' : 'bg-gray-200 dark:bg-slate-700'}`}>Focus</button>
                    <button onClick={() => switchMode('break')} className={`px-6 py-2 rounded-r-full transition-colors ${mode === 'break' ? 'bg-accent-mint text-white' : 'bg-gray-200 dark:bg-slate-700'}`}>Break</button>
                </div>

                <div className="relative w-64 h-64 mx-auto mb-8">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle className="text-gray-200 dark:text-gray-700" strokeWidth="7" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                        <motion.circle
                            className={mode === 'work' ? 'text-primary-light dark:text-primary-dark' : 'text-accent-mint'}
                            strokeWidth="7"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="45"
                            cx="50"
                            cy="50"
                            initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                            animate={{ strokeDashoffset: (1 - progress) * 2 * Math.PI * 45 }}
                            transition={{ duration: 1, ease: "linear" }}
                            style={{ strokeDasharray: 2 * Math.PI * 45 }}
                            transform="rotate(-90 50 50)"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-5xl font-bold text-gray-800 dark:text-white">{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
                        <p className="text-muted-light dark:text-muted-dark mt-2">{mode === 'work' ? "Time to focus" : "Take a break"}</p>
                    </div>
                </div>

                <div className="flex justify-center space-x-4">
                    <button onClick={toggleTimer} className="px-8 py-3 w-32 rounded-lg text-white bg-primary-light dark:bg-primary-dark hover:opacity-90 transition-opacity text-lg font-semibold">
                        {isActive ? 'Pause' : 'Start'}
                    </button>
                    <button onClick={resetTimer} className="px-8 py-3 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-slate-600 hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors">
                        Reset
                    </button>
                </div>
            </div>
            
            <div className="w-full max-w-md bg-white dark:bg-bg-dark-secondary p-6 rounded-2xl shadow-lg text-center pb-24 md:pb-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Distraction Blocker</h3>
                <p className="text-sm text-muted-light dark:text-muted-dark mb-4">When the focus timer is running, we'll remind you to stay on track if you navigate away.</p>
                <form onSubmit={addUrl} className="flex gap-2 mb-4">
                    <input type="text" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="e.g., netflix.com" className="flex-grow p-2 bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md"/>
                    <button type="submit" className="px-4 py-2 rounded-md text-white bg-primary-light dark:bg-primary-dark hover:opacity-90">Add</button>
                </form>
                <div className="flex flex-wrap gap-2 justify-center">
                    {distractionUrls.map(url => (
                        <div key={url} className="flex items-center gap-2 bg-gray-200 dark:bg-slate-700 rounded-full px-3 py-1 text-sm">
                            <span>{url}</span>
                            <button onClick={() => removeUrl(url)} className="text-muted-light dark:text-muted-dark hover:text-danger"><TrashIcon className="w-4 h-4"/></button>
                        </div>
                    ))}
                </div>
            </div>

            <Modal isOpen={isWelcomeBackModalOpen} onClose={() => setIsWelcomeBackModalOpen(false)} title="Welcome Back!">
                <div className="text-center">
                    <p className="text-lg text-muted-light dark:text-muted-dark mb-6">Your focus session is still active. Stay on track and avoid those distractions!</p>
                    <button onClick={() => setIsWelcomeBackModalOpen(false)} className="px-6 py-2 rounded-md text-white bg-primary-light dark:bg-primary-dark hover:opacity-90">
                        I'm Ready
                    </button>
                </div>
            </Modal>
        </div>
      </PageTransition>
    </Layout>
  );
};
