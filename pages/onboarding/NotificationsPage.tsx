import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BellIcon } from '../../components/icons';

interface NotificationsPageProps {
  onComplete: () => void;
}

const tiers = [
    { name: "Gentle Nudges", description: "Occasional, subtle reminders." },
    { name: "Standard", description: "Pomodoro-timed (25 min) alerts." },
    { name: "Intensive", description: "Frequent checks to keep you focused." },
];

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onComplete }) => {
  const [selectedTier, setSelectedTier] = useState("Standard");
  const navigate = useNavigate();

  const handleFinish = () => {
    // Here you would save the notification preference
    console.log("Selected notification tier:", selectedTier);
    onComplete();
    navigate('/home', { replace: true });
  };

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center">
            <div className="w-16 h-16 bg-accent-yellow/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BellIcon className="w-8 h-8 text-accent-yellow" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                Stay on Track
            </h1>
            <p className="mt-2 text-muted-light dark:text-muted-dark">
                How often would you like reminders? (Placeholder)
            </p>
        </div>

        <div className="mt-8 space-y-3">
            {tiers.map(tier => (
                <button
                    key={tier.name}
                    onClick={() => setSelectedTier(tier.name)}
                    className={`w-full p-4 rounded-lg text-left border-2 transition-all ${
                        selectedTier === tier.name
                        ? 'border-primary-light dark:border-primary-dark bg-primary-light/5 dark:bg-primary-dark/5'
                        : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-bg-dark-secondary'
                    }`}
                >
                    <p className="font-semibold text-gray-800 dark:text-white">{tier.name}</p>
                    <p className="text-sm text-muted-light dark:text-muted-dark">{tier.description}</p>
                </button>
            ))}
        </div>

        <div className="mt-8">
          <button
            onClick={handleFinish}
            className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-primary-light dark:bg-primary-dark hover:opacity-90 transition-opacity"
          >
            Finish Setup
          </button>
        </div>
      </motion.div>
    </div>
  );
};
