import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTasks } from '../../hooks/useTasks';
import { ImpactTier, Category } from '../../types';

export const FirstTaskPage: React.FC = () => {
  const [name, setName] = useState('');
  const { addTask } = useTasks();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      addTask({
        name: name.trim(),
        description: 'My first task!',
        tier: ImpactTier.MEDIUM,
        category: Category.DISTRACTION,
      });
    }
    navigate('/onboarding/notifications');
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
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                Set Your First "Don't"
            </h1>
            <p className="mt-2 text-muted-light dark:text-muted-dark">
                What's one thing you want to stop doing? You can add more later.
            </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Scrolling social media after 10 PM"
              className="w-full p-4 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark text-lg"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-primary-light dark:bg-primary-dark hover:opacity-90 transition-opacity"
          >
            Add Task & Continue
          </button>
        </form>

        <div className="mt-4 text-center">
            <Link to="/onboarding/notifications" className="text-muted-light dark:text-muted-dark hover:underline">
                I'll do this later
            </Link>
        </div>
      </motion.div>
    </div>
  );
};
